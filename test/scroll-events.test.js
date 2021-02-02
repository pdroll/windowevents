const WindowEvents =  require('../windowevents')
const { fireEvent } = require('@testing-library/dom')
const { objectContaining } = expect

beforeEach(() => {
  // Mock the scroll height of the body
  Object.defineProperty(document.body, 'scrollHeight', {
    writable: true, configurable: true, value: 1536
  })
})

describe('scroll events', () => {
  it('publishes scroll.down event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.down', callback)

    await fireEvent.scroll(window, { target: { scrollY: 311 } });
    await fireEvent.scroll(window, { target: { scrollY: 384 } });
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledWith({ scrollTop: 384, scrollPercent: 50 })
  })

  it('publishes scroll.up event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.up', callback)

    await fireEvent.scroll(window, { target: { scrollY: 311 } });
    await fireEvent.scroll(window, { target: { scrollY: 192 } });
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledWith({ scrollTop: 192, scrollPercent: 25 })
  })

  it('publishes scroll.bottom event ', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.bottom', callback)

    await fireEvent.scroll(window, { target: { scrollY: 311 } });
    await fireEvent.scroll(window, { target: { scrollY: 768 } });
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledWith({ scrollTop: 768, scrollPercent: 100 })
  })

  it('publishes scroll.top event ', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('scroll.top', callback)

    await fireEvent.scroll(window, { target: { scrollY: 311 } });
    await fireEvent.scroll(window, { target: { scrollY: 0 } });
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledWith({ scrollTop: 0, scrollPercent: 0 })
  })

  it('publishes scroll.start and scroll.stop events', async () => {
    const winEvents = new WindowEvents()
    const startCallback = jest.fn()
    const stopCallback = jest.fn()

    winEvents.on('scroll.start', startCallback)
    winEvents.on('scroll.stop', stopCallback)

    await fireEvent.scroll(window, { target: { scrollY: 384 } });

    expect(startCallback).toHaveBeenCalledWith({ scrollTop: 384, scrollPercent: 50 })
    expect(stopCallback).not.toHaveBeenCalled()

    jest.runAllTimers()

    expect(stopCallback).toHaveBeenCalledWith({ scrollTop: 384, scrollPercent: 50 })
  })

  it('includes scroll data in getInfo', async () => {
    const winEvents = new WindowEvents()

    await fireEvent.scroll(window, { target: { scrollY: 576 } });

    expect(winEvents.getState()).toEqual(objectContaining({
      scrollTop: 576,
      scrollPercent: 75
    }))
  })

  it('updateState updates scroll percentage when page changes height', async () => {
    const winEvents = new WindowEvents()

    await fireEvent.scroll(window, { target: { scrollY: 768 } });

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
