const WindowEvents = require('../windowevents')
const { objectContaining } = expect

describe('Page visibility events', () => {
  it('publishes visibilityChange.hide event', async () => {
    const winEvents = new WindowEvents()
    const callback = jest.fn()

    winEvents.on('visibilityChange.hide', callback)

    document.hidden = true
    window.dispatchEvent(new Event('visibilitychange'))

    expect(callback).toHaveBeenCalledWith({ visible: false })
  })

  it('publishes visibilityChange.show event', async () => {
    const winEvents = new WindowEvents()
    const changeCallback = jest.fn()
    const showCallback = jest.fn()

    winEvents.on('visibilityChange', changeCallback)
    winEvents.on('visibilityChange.show', showCallback)

    document.hidden = true
    window.dispatchEvent(new Event('visibilitychange'))

    expect(changeCallback).toHaveBeenCalledWith({ visible: false })
    expect(showCallback).not.toHaveBeenCalled()

    document.hidden = false
    window.dispatchEvent(new Event('visibilitychange'))

    expect(changeCallback).toHaveBeenLastCalledWith({ visible: true })
    expect(showCallback).toHaveBeenCalledWith({ visible: true })
  })

  it('includes visibility data in getInfo', async () => {
    const winEvents = new WindowEvents()

    expect(winEvents.getState()).toEqual(objectContaining({
      visible: true
    }))
  })
})
