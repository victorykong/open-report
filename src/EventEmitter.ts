export type EventOptions = {
  once?: boolean;
};

type EventItem = EventOptions & {
  callback: Function;
};

class EventEmitter {
  events: { [key: string]: Array<EventItem> };

  constructor() {
    this.events = {};
  }

  once(type: string, callback: Function) {
    this.on(type, callback, {
      once: true,
    });

    return this;
  }

  on(type: string, callback: Function, options?: EventOptions) {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    this.events[type].push({
      callback,
      ...options,
    });

    return this;
  }

  off(type: string, callback?: Function) {
    if (!callback) {
      delete this.events[type];
      return this;
    }

    this.events[type] = this.events[type].filter(
      (e) => e.callback !== callback
    );
    return this;
  }

  emit(type: string, ...data: any[]) {
    if (!this.events[type]) {
      return this;
    }

    this.events[type].forEach((e, i) => {
      e.callback(...data);

      // 只使用一次，删除
      if (e.once) {
        this.events[type].splice(i, 1);
      }
    });
    return this;
  }
}

export default EventEmitter;
