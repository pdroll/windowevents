/// <reference types="cypress" />

describe('Scrolling events', () => {
  beforeEach(() => {
    cy.clock()
    cy.visit('./cypress/test.html')
  })

  it('publishes scroll.down event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('scroll.down', callback)

      cy.scrollTo(0, 250, { duration: 100 })
      cy.tick(100)
    }).then(() => {
      expect(callback).to.be.calledWith({ scrollTop: 250, scrollPercent: 50 })
    })
  })

  it('publishes scroll.up event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('scroll.up', callback)

      cy.scrollTo(0, 250)
      cy.scrollTo(0, 50, { duration: 100 })
      cy.tick(100)
    }).then(() => {
      expect(callback).to.be.calledWith({ scrollTop: 50, scrollPercent: 10 })
    })
  })

  it('publishes scroll.bottom event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('scroll.bottom', callback)

      cy.scrollTo(0, 500, { duration: 100 })
      cy.tick(100)
    }).then(() => {
      expect(callback).to.be.calledWith({ scrollTop: 500, scrollPercent: 100 })
    })
  })

  it('publishes scroll.top event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('scroll.top', callback)

      cy.scrollTo(0, 250)
      cy.scrollTo(0, 0, { duration: 100 })
      cy.tick(100)
    }).then(() => {
      expect(callback).to.be.calledWith({ scrollTop: 0, scrollPercent: 0 })
    })
  })

  it('publishes scroll.start and scroll.stop events', () => {
    const startCallback = cy.stub()
    const stopCallback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('scroll.start', startCallback)
      winEvents.on('scroll.stop', stopCallback)

      cy.scrollTo(0, 250, { duration: 100 })
    }).then(() => {
      /* eslint-disable no-unused-expressions */
      expect(startCallback).to.be.called
      expect(stopCallback).not.to.be.called
      /* eslint-enable no-unused-expressions */
    }).then(() => {
      cy.tick(500)
    }).then(() => {
      expect(stopCallback).to.be.calledWith({ scrollTop: 250, scrollPercent: 50 })
    })
  })

  it('updateState updates scroll percentage when page changes height', () => {
    let winEvents
    cy.window().then((window) => {
      winEvents = new window.WindowEvents()

      cy.scrollTo(0, 300, { duration: 100 })
      cy.tick(100)
    }).then(() => {
      expect(winEvents.getState()).to.include({
        scrollTop: 300,
        scrollPercent: 60
      })
    }).then(() => {
      cy.window().then((window) => {
        window.document.getElementById('hidden-content').classList.remove('hidden')
        winEvents.updateState()
      })
    }).then(() => {
      expect(winEvents.getState()).to.include({
        scrollTop: 300,
        scrollPercent: 20
      })
    })
  })
})
