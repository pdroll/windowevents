/*!
 * WindowEvents.js
 * @author Pete Droll <droll.p@gmail.com>
 * @license MIT
 */
import { Covenant } from 'covjs'
import debounce from 'throttle-debounce/debounce'
import throttle from 'throttle-debounce/throttle'
import ScrollEvents from './scroll'
import ResizeEvents from './resize'
import VisibilityEvents from './visibility'
import LoadEvents from './load'

class WindowEvents {
  constructor (opts) {
    const defaultOptions = {
      scrollDelay: 100,
      resizeDelay: 350
    }

    this.options = opts ? { ...defaultOptions, ...opts } : defaultOptions

    const publisher = new Covenant()
    this.on = publisher.on
    this.once = publisher.once
    this.off = publisher.off

    const resizeEvents = new ResizeEvents(publisher, this.options)
    // Pass resizeEvents object to scroll listener
    // in order to have access to window height, width
    const scrollEvents = new ScrollEvents(publisher, this.options, resizeEvents)
    const visibilityEvents = new VisibilityEvents(publisher, this.options)
    const loadEvents = new LoadEvents(publisher, this.options)

    this.getState = () => ({
      ...resizeEvents.getState(),
      ...scrollEvents.getState(),
      ...visibilityEvents.getState(),
      ...loadEvents.getState()
    })

    this.updateState = () => {
      resizeEvents.updateState()
      scrollEvents.updateState()
      visibilityEvents.updateState()
      loadEvents.updateState()
      return this.getState()
    }

    window.addEventListener('scroll', debounce(
      // Delay
      this.options.scrollDelay,
      // At beginning
      true,
      // Debounced function
      scrollEvents.debouncedListener
    ), false)
    window.addEventListener('scroll', throttle(
      // Delay
      this.options.scrollDelay,
      // No Trailing. If false, will get called one last time after the last throttled call
      false,
      // Throttled function
      scrollEvents.throttledListener
    ), false)
    window.addEventListener('resize', debounce(
      // Delay
      this.options.resizeDelay,
      // At beginning
      true,
      // Debounced function
      resizeEvents.debouncedListener
    ), false)
    window.addEventListener('resize', throttle(
      // Delay
      this.options.resizeDelay,
      // No Trailing. If false, will get called one last time after the last throttled call
      false,
      // Throttled function
      resizeEvents.throttledListener
    ), false)

    window.addEventListener('visibilitychange', visibilityEvents.changeListenter, false)

    document.addEventListener('readystatechange', () => {
      // Update the state once all
      // images and resources have loaded
      this.updateState()
      loadEvents.changeListenter()
    }, false)
  }
}

export default WindowEvents
