class ResizeEvents {
  constructor(publisher, options) {
    this.signal = publisher.signal;
    this.options = options;
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.scrollHeight = document.body.scrollHeight;
  }

  debouncedListener() {
    console.log('Debounced Listener!');
  }

  throttledListener() {
    console.log('Throttled Listener!');
  }
}

export default ResizeEvents;
