const WindowEvents = require('../windowevents')
const { objectContaining } = expect

describe('Resize events', () => {
  describe('resize delay', () => {
    describe('with customs options', () => {
      it('throttles scroll events to the delay specified', () => {
        const winEvents = new WindowEvents({ resizeDelay: 500 })
        const callback = jest.fn()

        winEvents.on('resize', callback)
        window.resizeTo(1000, 700)
        window.resizeTo(900, 650)

        jest.advanceTimersByTime(400)
        expect(callback).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(101)
        expect(callback).toHaveBeenCalledTimes(2)
      })
    })

    describe('with default options', () => {
      it('throttles scroll events to 350ms', () => {
        const winEvents = new WindowEvents()
        const callback = jest.fn()

        winEvents.on('resize', callback)
        window.resizeTo(1000, 700)
        window.resizeTo(900, 650)

        jest.advanceTimersByTime(300)
        expect(callback).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(51)
        expect(callback).toHaveBeenCalledTimes(2)
      })
    })
  })

  it('publishes resize.start event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('resize.start', callback)
    window.resizeTo(1000, 700)

    expect(callback).toHaveBeenCalledWith({
      orientation: 'landscape',
      scrollHeight: 2000,
      width: 1000,
      height: 700
    })
  })

  it('publishes resize.stop event', async () => {
    const winEvents = new WindowEvents()
    const stopCallback = jest.fn()
    const resizeCallback = jest.fn()

    winEvents.on('resize', resizeCallback)
    winEvents.on('resize.stop', stopCallback)
    window.resizeTo(1200, 800)

    const expectedState = {
      orientation: 'landscape',
      scrollHeight: 2000,
      width: 1200,
      height: 800
    }

    expect(resizeCallback).toHaveBeenCalledWith(expectedState)
    expect(stopCallback).not.toHaveBeenCalled()

    jest.runAllTimers()

    expect(stopCallback).toHaveBeenCalledWith(expectedState)
  })

  it('publishes resize.orientationChange event', () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('resize.orientationChange', callback)

    window.resizeTo(800, 768)
    jest.runAllTimers()
    expect(callback).not.toHaveBeenCalled()

    window.resizeTo(320, 480)
    jest.runAllTimers()
    expect(callback).toHaveBeenCalledWith({
      orientation: 'portrait',
      scrollHeight: 2000,
      width: 320,
      height: 480
    })
  })

  it('publishes resize.scrollHeightChange event', () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('resize.scrollHeightChange', callback)

    window.resizeTo(720, 480)
    window .resizeTo(320, 480)
    document.body.scrollHeight = 2500

    jest.runAllTimers()
    expect(callback).toHaveBeenCalledWith({
      orientation: 'portrait',
      scrollHeight: 2500,
      width: 320,
      height: 480
    })
  })

  it('includes window size data in getInfo', async () => {
    window.resizeTo(768, 1024)
    const winEvents = new WindowEvents()

    expect(winEvents.getState()).toEqual(objectContaining({
      orientation: 'portrait',
      scrollHeight: 2000,
      height: 1024,
      width: 768
    }))
  })
})
