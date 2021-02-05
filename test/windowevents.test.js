const WindowEvents = require('../windowevents')

describe('WindowEvents', () => {
  describe('options', () => {
    it.skip('allows the default scroll delay to be overridden', () => {})

    it.skip('allows the default resize delay to be overridden', () => {})
  })
  describe('#on', () => {
    it('adds event listeners for all future events', () => {
      const winEvents = new WindowEvents()
      const callback = jest.fn()

      winEvents.on('resize', callback)

      window.resizeTo(500, 500)
      jest.runAllTimers()
      expect(callback).toHaveBeenCalledTimes(1)

      window.resizeTo(400, 600)
      jest.runAllTimers()
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('#once', () => {
    it('adds an event listener for only the next one occurrence of an event', () => {
      const winEvents = new WindowEvents()
      const callback = jest.fn()

      winEvents.once('resize', callback)

      window.resizeTo(1000, 700)
      jest.runAllTimers()
      expect(callback).toHaveBeenCalledTimes(1)

      window.resizeTo(800, 400)
      jest.runAllTimers()
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('#off', () => {
    it('removes a previously added event listener', () => {
      const winEvents = new WindowEvents()
      const callback = jest.fn()
      const callback2 = jest.fn()

      const visibilityChangeListener = winEvents.on('visibilityChange', callback)
      winEvents.on('visibilityChange', callback2)

      document.hidden = true
      window.dispatchEvent(new Event('visibilitychange'))

      expect(callback).toHaveBeenCalledWith({ visible: false })

      winEvents.off('visibilityChange', visibilityChangeListener)

      document.hidden = false
      window.dispatchEvent(new Event('visibilitychange'))

      expect(callback).not.toHaveBeenCalledWith({ visible: true })
      expect(callback2).toHaveBeenCalledWith({ visible: true })
    })

    describe('when a listener is not specified', () => {
      it('removes all previously added event listener', () => {
        const winEvents = new WindowEvents()
        const callback = jest.fn()
        const callback2 = jest.fn()

        winEvents.on('visibilityChange', callback)
        winEvents.on('visibilityChange', callback2)

        document.hidden = true
        window.dispatchEvent(new Event('visibilitychange'))

        expect(callback).toHaveBeenCalledWith({ visible: false })

        winEvents.off('visibilityChange')

        document.hidden = false
        window.dispatchEvent(new Event('visibilitychange'))

        expect(callback).not.toHaveBeenCalledWith({ visible: true })
        expect(callback2).not.toHaveBeenCalledWith({ visible: true })
      })
    })
  })
})
