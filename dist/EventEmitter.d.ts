export type EventOptions = {
    once?: boolean;
};
type EventItem = EventOptions & {
    callback: Function;
};
declare class EventEmitter {
    events: {
        [key: string]: Array<EventItem>;
    };
    constructor();
    once(type: string, callback: Function): this;
    on(type: string, callback: Function, options?: EventOptions): this;
    off(type: string, callback?: Function): this;
    emit(type: string, ...data: any[]): this;
}
export default EventEmitter;
