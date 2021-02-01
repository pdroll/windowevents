class VisibilityEvents {
  constructor (publisher, options) {
    this.signal = publisher.signal
    this.options = options

    this.changeListenter = this.changeListenter.bind(this)

    this.updateState()
  }

  updateState () {
    this.visible = !document.hidden
  }

  getState () {
    return {
      visible: this.visible
    }
  }

  changeListenter () {
    this.visible = !document.hidden

    const visibleObj = {
      visible: this.visible
    }

    this.signal('visibilityChange', [visibleObj])

    if (this.visible) {
      this.signal('visibilityChange.show', [visibleObj])
    } else {
      this.signal('visibilityChange.hide', [visibleObj])
    }
  }
}

export default VisibilityEvents
