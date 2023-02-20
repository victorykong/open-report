import VTMEventDOM from "./";

// Fake timeout
export function setInterval(cb: Function, ms = 1000) {
  setTimeout(() => {
    cb();
    setInterval(cb);
  }, ms);
}

// 从增量异步节点中获取有效标记的元素
export function findElementFromAddedNodes(
  nodeList: NodeList,
  type: "click" | "show"
) {
  const list = Array.from(nodeList);

  return list.reduce((arr: Array<Element>, ele: Node | Element) => {
    // 防止 text #comment 等无效节点
    if (!(ele instanceof Element)) {
      return arr;
    }

    // 后代节点处理
    if (type === "show") {
      const showList = Array.from(
        ele.querySelectorAll(VTMEventDOM.selectorShow)
      );
      arr.push(...showList);
    }
    if (type === "click") {
      const clickList = Array.from(
        ele.querySelectorAll(VTMEventDOM.selectorClick)
      );
      arr.push(...clickList);
    }

    // 当前节点本身处理
    type === "show" &&
      ele.classList.contains(VTMEventDOM.selectorShow.substring(1)) &&
      arr.push(ele);
    type === "click" &&
      ele.classList.contains(VTMEventDOM.selectorClick.substring(1)) &&
      arr.push(ele);

    return arr;
  }, []);
}

// 生成随机唯一 id
export function genRandomid() {
  const now = Date.now();
  const random8 = Math.random().toString(36).slice(2, 10);
  return `${now}_${random8}`;
}
