/// <reference types="cypress" />

describe('Reseize events', () => {
  beforeEach(() => {
    cy.visit('./cypress/test.html')
  })

  it('publishes resize.start event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('resize.start', callback)

      cy.viewport(800, 500)
    })

    cy.wrap().should(() => {
      expect(callback).to.be.calledWith({
        height: 500,
        width: 800,
        orientation: 'landscape',
        scrollHeight: 1000
      })
    })
  })

  it('publishes resize.stop event', () => {
    const stopCallback = cy.stub()
    const resizeCallback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('resize.stop', stopCallback)
      winEvents.on('resize', resizeCallback)

      cy.viewport(1024, 768)
    })

    cy.wrap().should(() => {
      const expectedState = {
        height: 768,
        width: 1024,
        orientation: 'landscape',
        scrollHeight: 1000
      }

      expect(stopCallback).to.be.calledWith(expectedState)
      expect(resizeCallback).to.be.calledWith(expectedState)
    })
  })

  it('publishes resize.orientationChange event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('resize.orientationChange', callback)

      cy.viewport(600, 800)
    })

    cy.wrap().should(() => {
      expect(callback).to.be.calledWith({
        height: 800,
        width: 600,
        orientation: 'portrait',
        scrollHeight: 1000
      })
    })
  })

  it('publishes resize.scrollHeightChange event', () => {
    const callback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('resize.scrollHeightChange', callback)

      // Set the viewport narrow enough to force
      // our content to be taller than 1000px
      cy.viewport(330, 480)
      cy.wait(100)
      cy.viewport(320, 480)
    })

    cy.wrap().should(() => {
      expect(callback).to.be.calledWithMatch({
        height: 480,
        width: 320,
        orientation: 'portrait'
      })
    })
  })
})
