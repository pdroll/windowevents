class ResizeEvents {
  constructor(publisher, options) {
    this.signal = publisher.signal;
    this.options = options;
    this.resizeTimeout = null;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);

    this.updateState();
  }

  updateState() {
    this.height = this.lastH = window.innerHeight;
    this.width = this.lastW = window.innerWidth;
    this.scrollHeight = this.lastS = document.body.scrollHeight;
    this.orientation = this.lastO = this.height > this.width ? 'portrait' : 'landscape';
  }

  getState() {
    return {
      height: this.height,
      width: this.width,
      scrollHeight: this.scrollHeight,
      orientation: this.orientation,
    };
  }

  debouncedListener() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.scrollHeight = document.body.scrollHeight;
    this.orientation = this.height > this.width ? 'portrait' : 'landscape';

    const sizeObj = {
      height: this.height,
      width: this.width,
      scrollHeight: this.scrollHeight,
      orientation: this.orientation,
    };

    this.signal('resize.start', [sizeObj]);

    this.lastH = this.height;
    this.lastW = this.width;
    this.lastS = this.scrollHeight;
  }

  throttledListener() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.scrollHeight = document.body.scrollHeight;
    this.orientation = this.height > this.width ? 'portrait' : 'landscape';

    const sizeObj = {
      height: this.height,
      width: this.width,
      scrollHeight: this.scrollHeight,
      orientation: this.orientation,
    };

    this.signal('resize', [sizeObj]);

    if (this.orientation !== this.lastO) {
      this.signal('resize.orientationChange', [sizeObj]);
    }

    if (this.scrollHeight !== this.lastS) {
      this.signal('resize.scrollHeightChange', [sizeObj]);
    }

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.signal('resize.stop', [sizeObj]);
    }, this.options.resizeDelay + 1);

    this.lastH = this.height;
    this.lastW = this.width;
    this.lastS = this.scrollHeight;
    this.lastO = this.orientation;
  }
}

export default ResizeEvents;
