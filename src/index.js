import publisher from 'covjs';

class WindowEvents {

  constructor(opts) {
    const defaultOptions = {
      scrollDelay: 25,
      resizeDelay: 100,
    };

    this.options = opts ? { ...defaultOptions, ...opts } : defaultOptions;
    this.publisher = publisher;
  }

  listen() {
    console.log('Lets listen for events', this);
  }
}

module.exports = WindowEvents;
