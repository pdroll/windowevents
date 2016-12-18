class LoadEvents {
  constructor(publisher, options) {
    this.signal = publisher.signal;
    this.options = options;

    this.changeListenter = this.changeListenter.bind(this);

    this.updateState();
  }

  updateState() {
    this.loaded = document.readyState;
  }

  getState() {
    return {
      loaded: this.loaded,
    };
  }

  changeListenter() {
    this.loaded = document.readyState;

    const loadedObj = {
      loaded: this.loaded,
    };

    this.signal('load', [loadedObj]);

    if (this.loaded === 'interactive') {
      this.signal('load.interactive', [loadedObj]);
    } else if (this.loaded === 'complete') {
      this.signal('load.complete', [loadedObj]);
    }
  }
}

export default LoadEvents;
