import "./polyfill";
type EventType = "view" | "show" | "click";
type Options = Partial<{
    show: Partial<{
        threshold: number;
    }>;
}>;
type EmitDataClick = {
    ele: Element;
    asyncData?: {
        [key: string]: string;
    };
    isLoadingAsyncData?: boolean;
    eleId?: string;
};
type EmitDataShow = Array<IntersectionObserverEntry & {
    readonly isShow: boolean;
    asyncData?: {
        [key: string]: string;
    };
    isLoadingAsyncData?: boolean;
    eleId?: string;
}>;
type Callback<T> = T extends "click" ? CallbackClick : T extends "show" ? CallbackShow : CallbackView;
type CallbackClick = (entry: EmitDataClick) => void;
type CallbackShow = (entryList: EmitDataShow) => void;
type CallbackView = () => void;
declare class VTMEventDOM {
    options: Options;
    private event;
    private callbackAsyncList;
    private mapBindClickElement;
    static selectorClick: string;
    static selectorShow: string;
    static attrAsyncDataPrefix: string;
    private observerIntersection;
    constructor(options?: Options);
    private init;
    on<T>(type: EventType, callback: Callback<T>): this;
    private emit;
    private onClick;
    private onClickSync;
    private patchAsyncClick;
    private onShow;
    private onShowSync;
    private patchAsyncShow;
    private onGlobalObserve;
    private $emit;
    private initIntervalCallbackAsyncList;
    private createIntersectionObserver;
}
export default VTMEventDOM;
