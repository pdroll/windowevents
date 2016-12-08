class ScrollEvents {
  constructor(publisher, options, sizeRef) {
    this.signal = publisher.signal;
    this.options = options;
    this.scrollTop = this.lastScrollTop = window.scrollY || window.pageYOffset;
    this.windowSize = sizeRef;
    this.scrollTimeout = null;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);
  }

  getState() {
    return {
      scrollTop: this.scrollTop,
    };
  }

  debouncedListener() {
    this.scrollTop = window.scrollY || window.pageYOffset;
    this.signal('scroll.start', [this.scrollTop]);

    this.lastScrollTop = this.scrollTop;
  }

  throttledListener() {
    this.scrollTop = window.scrollY || window.pageYOffset;

    this.signal('scroll', [this.scrollTop]);

    if (this.scrollTop > this.lastScrollTop) {
      this.signal('scroll.down', [this.scrollTop]);
    } else if (this.scrollTop < this.lastScrollTop) {
      this.signal('scroll.up', [this.scrollTop]);
    }

    if (this.scrollTop <= 0) {
      this.signal('scroll.top', [this.scrollTop]);
    }

    if (this.scrollTop + this.windowSize.height >= this.windowSize.scrollHeight) {
      this.signal('scroll.bottom', [this.scrollTop]);
    }

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.signal('scroll.stop', [this.scrollTop]);
    }, this.options.scrollDelay + 1);

    this.lastScrollTop = this.scrollTop;
  }
}

export default ScrollEvents;
