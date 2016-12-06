class ScrollEvents {
  constructor(publisher, options, sizeRef) {
    this.signal = publisher.signal;
    this.options = options;
    this.scrollTop = window.scrollY || window.pageYOffset;
    console.log(sizeRef);
  }

  debouncedListener() {
    console.log('Debounced Listener!');
  }

  throttledListener() {
    console.log('Throttled Listener!');
  }
}

export default ScrollEvents;
