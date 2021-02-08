const WindowEvents = require('../windowevents')
const { objectContaining } = expect

beforeEach(() => {
  document.body.scrollHeight = 1536
})

describe('Scroll events', () => {
  describe('scroll delay', () => {
    describe('with customs options', () => {
      it('throttles scroll events to the delay specified', async () => {
        const winEvents = new WindowEvents({ scrollDelay: 200 })
        const callback = jest.fn()

        winEvents.on('scroll', callback)
        window.scrollTo(0, 311)
        window.scrollTo(0, 400)

        jest.advanceTimersByTime(101)
        expect(callback).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledTimes(2)
      })
    })

    describe('with default options', () => {
      it('throttles scroll events to 100ms', async () => {
        const winEvents = new WindowEvents()
        const callback = jest.fn()

        winEvents.on('scroll', callback)
        window.scrollTo(0, 200)
        window.scrollTo(0, 311)

        jest.advanceTimersByTime(90)
        expect(callback).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(12)
        expect(callback).toHaveBeenCalledTimes(2)
      })
    })
  })

  it('publishes scroll.down event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.down', callback)

    window.scrollTo(0, 311)
    window.scrollTo(0, 384)
    jest.runAllTimers()

    expect(callback).toHaveBeenCalledWith({ scrollTop: 384, scrollPercent: 50 })
  })

  it('publishes scroll.up event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.up', callback)

    window.scrollTo(0, 311)
    window.scrollTo(0, 192)
    jest.runAllTimers()

    expect(callback).toHaveBeenCalledWith({ scrollTop: 192, scrollPercent: 25 })
  })

  it('publishes scroll.bottom event ', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.bottom', callback)

    window.scrollTo(0, 311)
    window.scrollTo(0, 768)
    jest.runAllTimers()

    expect(callback).toHaveBeenCalledWith({ scrollTop: 768, scrollPercent: 100 })
  })

  it('publishes scroll.top event ', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.top', callback)

    window.scrollTo(0, 311)
    window.scrollTo(0, 0)

    jest.runAllTimers()
    expect(callback).toHaveBeenCalledWith({ scrollTop: 0, scrollPercent: 0 })
  })

  it('publishes scroll.start and scroll.stop events', async () => {
    const winEvents = new WindowEvents()
    const startCallback = jest.fn()
    const stopCallback = jest.fn()

    winEvents.on('scroll.start', startCallback)
    winEvents.on('scroll.stop', stopCallback)

    window.scrollTo(0, 384)

    expect(startCallback).toHaveBeenCalledWith({ scrollTop: 384, scrollPercent: 50 })
    expect(stopCallback).not.toHaveBeenCalled()

    jest.runAllTimers()

    expect(stopCallback).toHaveBeenCalledWith({ scrollTop: 384, scrollPercent: 50 })
  })

  it('includes scroll data in getInfo', async () => {
    const winEvents = new WindowEvents()

    window.scrollTo(0, 576)

    expect(winEvents.getState()).toEqual(objectContaining({
      scrollTop: 576,
      scrollPercent: 75
    }))
  })

  it('updateState updates scroll percentage when page changes height', async () => {
    const winEvents = new WindowEvents()

    window.scrollTo(0, 768)

    expect(winEvents.getState()).toEqual(objectContaining({
      scrollTop: 768,
      scrollPercent: 100
    }))

    document.body.scrollHeight = 2304

    winEvents.updateState()

    expect(winEvents.getState()).toEqual(objectContaining({
      scrollTop: 768,
      scrollPercent: 50
    }))
  })
})
