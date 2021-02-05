const WindowEvents = require('../windowevents')
const { objectContaining } = expect

describe('Load events', () => {
  it('publishes load.interactive event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('load.interactive', callback)

    document.readyState = 'interactive'
    document.dispatchEvent(new Event('readystatechange'))

    expect(callback).toHaveBeenCalledWith({ loaded: 'interactive' })
  })

  it('publishes load.complete event', async () => {
    const winEvents = new WindowEvents()
    const completeCallback = jest.fn()
    const changeCallback = jest.fn()

    winEvents.on('load', changeCallback)
    winEvents.on('load.complete', completeCallback)

    document.readyState = 'interactive'
    document.dispatchEvent(new Event('readystatechange'))

    expect(completeCallback).not.toHaveBeenCalled()
    expect(changeCallback).toHaveBeenCalledWith({ loaded: 'interactive' })

    document.readyState = 'complete'
    document.dispatchEvent(new Event('readystatechange'))

    expect(completeCallback).toHaveBeenCalledWith({ loaded: 'complete' })
    expect(changeCallback).toHaveBeenCalledWith({ loaded: 'interactive' })
  })

  it('includes load data in getInfo', async () => {
    const winEvents = new WindowEvents()

    expect(winEvents.getState()).toEqual(objectContaining({
      loaded: 'loading'
    }))
  })
})
