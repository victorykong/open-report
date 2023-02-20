import "./polyfill";
import EventEmitter from "./EventEmitter";
import * as utils from "./utils";

type EventType = "view" | "show" | "click";
type Options = Partial<{
  show: Partial<{
    threshold: number; // 可见程度
  }>;
}>;

// emit => $emit
type EmitData<T> = T extends "click" ? EmitDataClick : EmitDataShow;
type EmitDataClick = {
  ele: Element;
  asyncData?: { [key: string]: string }; // Async data: click
  isLoadingAsyncData?: boolean; // 是否正在加载异步数据
  eleId?: string; // 元素对应id
};
type EmitDataShow = Array<
  IntersectionObserverEntry & {
    readonly isShow: boolean;
    asyncData?: { [key: string]: string }; // Async data: show 异步数据由原本的 entries 合并返回
    isLoadingAsyncData?: boolean; // 是否正在加载异步数据
    eleId?: string; // 元素对应id
  }
>;

// 外部接入监听回调
type Callback<T> = T extends "click"
  ? CallbackClick
  : T extends "show"
  ? CallbackShow
  : CallbackView;
type CallbackClick = (entry: EmitDataClick) => void;
type CallbackShow = (entryList: EmitDataShow) => void;
type CallbackView = () => void;

// 异步列表
type CallbackAsyncList = Array<CallbackAsyncListItem | null>;
type CallbackAsyncListItem = {
  type: EventType;
  data: any;
  // T extends "click"
  //   ? EmitDataClick
  //   : T extends "show"
  //   ? EmitDataShow
  //   : any; // show/click 分别回调的数据
};

class VTMEventDOM {
  options: Options;
  private event: EventEmitter;
  private callbackAsyncList!: CallbackAsyncList;
  private mapBindClickElement: WeakMap<Element, true> = new WeakMap();
  static selectorClick = ".vcr-click";
  static selectorShow = ".vcr-show";
  static attrAsyncDataPrefix = "data-vcr-d-"; // e.g: data-vcr-d-shopPrice

  // intersection 采用（复用 intersection 可以解决同一个节点不会重复触发曝光回调）
  // mutation 不采用（callback 逻辑多样化，即使重复执行监听，对业务不影响，不对外做任何处理）
  private observerIntersection!: IntersectionObserver;

  constructor(options?: Options) {
    this.event = new EventEmitter();
    this.options = options || {};
    this.init();
  }

  private init() {
    this.observerIntersection = this.createIntersectionObserver();
    this.initIntervalCallbackAsyncList(); // 异步数据修正处理
  }

  on<T>(type: EventType, callback: Callback<T>) {
    switch (type) {
      case "view":
        // @ts-ignore
        callback(); // new VTMEventDOM => on `view` => callback
        break;

      case "click":
        this.event.on(type, callback);
        this.onClick();
        break;

      case "show":
        this.event.on(type, callback);
        this.onShow();
        break;
    }

    return this;
  }

  private emit<T>(type: EventType, data: EmitData<T>) {
    this.$emit({ type, data });
  }

  private onClick() {
    this.onClickSync();
    this.onGlobalObserve("click");
  }

  // 同步注册点击事件
  private onClickSync(eleList?: Array<Element>) {
    if (!eleList) {
      eleList = Array.from(
        document.querySelectorAll(VTMEventDOM.selectorClick)
      );
    }

    const self = this;
    eleList.forEach((ele) => {
      if (this.mapBindClickElement.has(ele)) {
        return;
      }

      this.mapBindClickElement.set(ele, true);
      ele.addEventListener("click", () => {
        self.emit<"click">("click", { ele });
      });
    });
  }

  // 处理在 `onGlobalObserve -> sync` 流程中 未被捕获的异步 click 节点
  private patchAsyncClick(eleAsyncTarget?: Element) {
    if (!eleAsyncTarget || !(eleAsyncTarget instanceof Element)) {
      return;
    }

    const self = this;
    const mutation = new MutationObserver(handlerMutation);

    mutation.observe(eleAsyncTarget, {
      childList: true,
      subtree: true,
    });

    function handlerMutation(
      mutationList: MutationRecord[],
      observer: MutationObserver
    ) {
      mutationList.forEach((mutation) => {
        const eleList = utils.findElementFromAddedNodes(
          mutation.addedNodes,
          "click"
        );

        self.onClickSync(eleList);
      });
    }
  }

  private onShow() {
    this.onShowSync();
    this.onGlobalObserve("show");
  }

  private onShowSync(eleList?: Array<Element>) {
    if (!eleList) {
      eleList = Array.from(document.querySelectorAll(VTMEventDOM.selectorShow));
    }

    const observer = this.observerIntersection; // 复用 IntersectionObserver
    eleList.forEach((ele) => {
      observer.observe(ele);
    });
  }

  private patchAsyncShow(eleAsyncTarget?: Element) {
    if (!eleAsyncTarget || !(eleAsyncTarget instanceof Element)) {
      return;
    }

    const self = this;
    const mutation = new MutationObserver(handlerMutation);

    mutation.observe(eleAsyncTarget, {
      childList: true,
      subtree: true,
    });

    function handlerMutation(
      mutationList: MutationRecord[],
      observer: MutationObserver
    ) {
      mutationList.forEach((mutation) => {
        const eleList = utils.findElementFromAddedNodes(
          mutation.addedNodes,
          "show"
        );

        self.onShowSync(eleList);
      });
    }
  }

  private onGlobalObserve(type: "show" | "click") {
    const self = this;

    const mutation = new MutationObserver(handlerMutation);
    function handlerMutation(
      mutationList: MutationRecord[],
      observer: MutationObserver
    ) {
      mutationList.forEach((mutation) => {
        const { addedNodes } = mutation; // 使用 addedNodes 最大程度保证尽可能少的去反复执行监听代码

        // 无新增节点
        if (addedNodes.length === 0) {
          return;
        }

        // 无效节点屏蔽（text comment）
        const addedNodesElement = Array.from(addedNodes).filter((addedNode) => {
          return addedNode instanceof Element;
        }) as Array<Element>;

        // 此处需要保证的是 反复执行监听 无论曝光/点击 不会造成执行多次即可
        addedNodesElement.forEach((ele) => {
          if (type === "click") {
            // 基于 ele 的同步“点击节点”扫描
            self.onClickSync([
              // addedNode 本身就是 click 节点
              ...(ele.classList.contains(VTMEventDOM.selectorClick.substring(1))
                ? [ele]
                : []),
              // addedNode 后代的 click 节点
              ...Array.from(ele.querySelectorAll(VTMEventDOM.selectorClick)),
            ]);

            // 基于 ele 的异步监听“点击节点”扫描
            self.patchAsyncClick(ele);
          }

          if (type === "show") {
            // 基于 ele 的同步“曝光节点”扫描
            self.onShowSync([
              // addedNode 本身就是 show 节点
              ...(ele.classList.contains(VTMEventDOM.selectorShow.substring(1))
                ? [ele]
                : []),
              // addedNode 后代的 show 节点
              ...Array.from(ele.querySelectorAll(VTMEventDOM.selectorShow)),
            ]);

            // 基于 ele 的异步监听“曝光节点”扫描
            self.patchAsyncShow(ele);
          }
        });
      });
    }

    mutation.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 均 emit 返回至 SDK
  // 如需要异步数据处理 则生成ele关联的id & 追加至 callbackAsyncList
  private $emit(callbackItem: CallbackAsyncListItem) {
    const { type, data } = callbackItem;

    if (type === "show") {
      const entries: EmitDataShow = data;

      const resolved: EmitDataShow = [], // 已经准备好的数据
        pending: EmitDataShow = []; // 未准备好的数据

      for (const item of entries) {
        const ele = item.target;

        // 每个异步数据均已准备好？
        let hasAllAsyncData = true;
        const attrs = ele.getAttributeNames();
        const asyncDataObj = attrs.reduce((obj, attr) => {
          // 其它正常数据
          if (!attr.startsWith(VTMEventDOM.attrAsyncDataPrefix)) {
            return obj;
          }

          const asyncData = ele.getAttribute(attr);

          attr = attr.replace(VTMEventDOM.attrAsyncDataPrefix, ""); // 删除 prefix

          // 未准备好
          if (!asyncData) {
            hasAllAsyncData = false;
            obj[attr] = ""; // 未准备好的数据 赋空字符
            return obj;
          }

          // 准备好赋值
          obj[attr] = asyncData;
          return obj;
        }, {} as { [key: string]: string });

        item.asyncData = asyncDataObj; // 赋值异步数据

        // 所有数据均已准备好
        if (hasAllAsyncData) {
          resolved.push(item);
          continue;
        }

        // 未准备好的数据添加标识
        item.isLoadingAsyncData = true;
        item.eleId = utils.genRandomid();
        pending.push(item);
      }

      // 均回调
      this.event.emit(type, [...resolved, ...pending]);

      // 只要 pending 有
      // 追加到 callbackAsyncList
      if (pending.length > 0) {
        this.callbackAsyncList.push({
          type,
          data: pending,
        });
      }
    } else if (type === "click") {
      const entry: EmitDataClick = data;
      const { ele } = entry;

      // 每个异步数据均已准备好？
      let hasAllAsyncData = true;
      const attrs = ele.getAttributeNames();
      const asyncDataObj = attrs.reduce((obj, attr) => {
        // 其它正常数据
        if (!attr.startsWith(VTMEventDOM.attrAsyncDataPrefix)) {
          return obj;
        }
        const asyncData = ele.getAttribute(attr);

        attr = attr.replace(VTMEventDOM.attrAsyncDataPrefix, ""); // 删除 prefix

        // 未准备好
        if (!asyncData) {
          hasAllAsyncData = false;
          obj[attr] = ""; // 未准备好的数据 赋空字符
          return obj;
        }

        // 准备好赋值
        obj[attr] = asyncData;
        return obj;
      }, {} as { [key: string]: string });

      entry.asyncData = asyncDataObj;

      // 所有数据均已准备好
      if (hasAllAsyncData) {
        this.event.emit(type, entry); // 无异步数据标识
        return;
      }

      // 未准备好的数据添加异步标识
      entry.isLoadingAsyncData = true;
      entry.eleId = utils.genRandomid();
      this.event.emit(type, entry);

      // 并追加到异步队列
      this.callbackAsyncList.push({
        type,
        data: entry,
      });
    }
  }

  // 异步数据修正处理
  // 每个元素最多只会 emit 2次
  //  即：有多个异步数据属性的情况下 不会根据某个返回进行 emit
  //      有异步数据属性未准备好之前，emit 一次
  //      当所有异步数据属性上都有值时，再 emit 一次
  private initIntervalCallbackAsyncList() {
    this.callbackAsyncList = [];

    utils.setInterval(checkAsyncData.bind(this), 1000);

    function checkAsyncData(this: VTMEventDOM) {
      if (this.callbackAsyncList.length === 0) {
        return;
      }

      // 无限重试 直到前往下一个页面
      // 查看异步数据是否全部返回
      // 返回则更新 并再次 emit
      this.callbackAsyncList.forEach((item, index) => {
        if (!item) {
          return;
        }

        if (item.type === "show") {
          const entries: EmitDataShow = item.data;
          const resolved: EmitDataShow = [], // 已经准备好的数据
            pending: EmitDataShow = []; // 未准备好的数据

          for (const item of entries) {
            const ele = item.target;

            // 每个异步数据均已准备好？
            let hasAllAsyncData = true;
            const attrs = ele.getAttributeNames();
            const asyncDataObj = attrs.reduce((obj, attr) => {
              // 其它正常数据
              if (!attr.startsWith(VTMEventDOM.attrAsyncDataPrefix)) {
                return obj;
              }

              const asyncData = ele.getAttribute(attr);

              attr = attr.replace(VTMEventDOM.attrAsyncDataPrefix, ""); // 删除 prefix

              // 未准备好
              if (!asyncData) {
                hasAllAsyncData = false;
                obj[attr] = ""; // 未准备好的数据 赋空字符
                return obj;
              }

              // 准备好赋值
              obj[attr] = asyncData;
              return obj;
            }, {} as { [key: string]: string });

            item.asyncData = asyncDataObj; // 赋值异步数据

            // 所有数据均已准备好
            if (hasAllAsyncData) {
              item.isLoadingAsyncData = false;
              resolved.push(item);
              continue;
            }

            pending.push(item); // 未准备好的数据 继续留在 callbackAsyncList 中
          }

          this.callbackAsyncList[index] = null; // 每次都重置一下 向后追加 item会被resolved/pending拆开

          // 已准备好的异步数据回调
          if (resolved.length > 0) {
            this.event.emit(item.type, resolved);
          }

          // 未准备好的数据 继续留在 callbackAsyncList 中
          if (pending.length > 0) {
            this.callbackAsyncList.push({
              type: item.type,
              data: pending,
            });
          }
        } else if (item.type === "click") {
          const entry: EmitDataClick = item.data;
          const { ele } = entry;

          // 每个异步数据均已准备好？
          let hasAllAsyncData = true;
          const attrs = ele.getAttributeNames();
          const asyncDataObj = attrs.reduce((obj, attr) => {
            // 其它正常数据
            if (!attr.startsWith(VTMEventDOM.attrAsyncDataPrefix)) {
              return obj;
            }
            const asyncData = ele.getAttribute(attr);

            attr = attr.replace(VTMEventDOM.attrAsyncDataPrefix, ""); // 删除 prefix

            // 未准备好
            if (!asyncData) {
              hasAllAsyncData = false;
              obj[attr] = ""; // 未准备好的数据 赋空字符
              return obj;
            }

            // 准备好赋值
            obj[attr] = asyncData;
            return obj;
          }, {} as { [key: string]: string });

          // 所有数据均已准备好
          if (hasAllAsyncData) {
            entry.asyncData = asyncDataObj; // 赋值准备好的所有异步数据

            this.callbackAsyncList[index] = null;
            entry.isLoadingAsyncData = false;
            this.event.emit(item.type, entry);

            return;
          }
        }
      });
    }
  }

  private createIntersectionObserver() {
    const self = this;

    const observer = new IntersectionObserver(handler, {
      threshold: self.options.show?.threshold || 0.1,
    });

    function handler(
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) {
      self.emit<"show">(
        "show",
        entries.map((i) => {
          return Object.assign(i, { isShow: i.isIntersecting });
        })
      );
    }

    return observer;
  }
}

export default VTMEventDOM;
