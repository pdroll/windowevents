class ScrollEvents {
  constructor (publisher, options, sizeRef) {
    this.signal = publisher.signal
    this.options = options
    this.windowSize = sizeRef
    this.scrollTimeout = null

    this.debouncedListener = this.debouncedListener.bind(this)
    this.throttledListener = this.throttledListener.bind(this)

    this.updateState()
  }

  updateState () {
    this.scrollTop = this.lastScrollTop = window.scrollY || window.pageYOffset
    this.scrollPercent =
        (this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height)) * 100
  }

  getState () {
    return {
      scrollTop: this.scrollTop,
      scrollPercent: this.scrollPercent
    }
  }

  debouncedListener () {
    this.scrollTop = window.scrollY || window.pageYOffset
    this.scrollPercent =
        (this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height)) * 100

    this.signal('scroll.start', [{
      scrollTop: this.scrollTop,
      scrollPercent: this.scrollPercent
    }])

    this.lastScrollTop = this.scrollTop
  }

  throttledListener () {
    this.scrollTop = window.scrollY || window.pageYOffset
    this.scrollPercent =
        (this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height)) * 100

    const scrollObj = {
      scrollTop: this.scrollTop,
      scrollPercent: this.scrollPercent
    }

    this.signal('scroll', [scrollObj])

    if (this.scrollTop > this.lastScrollTop) {
      this.signal('scroll.down', [scrollObj])
    } else if (this.scrollTop < this.lastScrollTop) {
      this.signal('scroll.up', [scrollObj])
    }

    if (this.scrollTop <= 0) {
      this.signal('scroll.top', [scrollObj])
    }

    if (scrollObj.scrollPercent >= 100) {
      this.signal('scroll.bottom', [scrollObj])
    }

    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => {
      this.signal('scroll.stop', [scrollObj])
    }, this.options.scrollDelay + 1)

    this.lastScrollTop = this.scrollTop
  }
}

export default ScrollEvents
