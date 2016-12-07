class ResizeEvents {
  constructor(publisher, options) {
    this.signal = publisher.signal;
    this.options = options;
    this.height = this.previousHeight = window.innerHeight;
    this.width = this.previousWidth = window.innerWidth;
    this.scrollHeight = this.previousScrollHeight = document.body.scrollHeight;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);
  }

  debouncedListener() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.scrollHeight = document.body.scrollHeight;
  }

  throttledListener() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.scrollHeight = document.body.scrollHeight;
  }
}

export default ResizeEvents;
