/// <reference types="cypress" />

describe('Visibility change events', () => {
  beforeEach(() => {
    cy.visit('./cypress/test.html')
  })

  it('publishes visibilityChange.hide event', () => {
    const changeCallback = cy.stub()
    const hideCallback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('visibilityChange', changeCallback)
      winEvents.on('visibilityChange.hide', hideCallback)
    }).then(() => {
      cy.document().then((doc) => {
        cy.stub(doc, 'hidden').value(true)
        cy.document().trigger('visibilitychange')
      }).then(() => {
        expect(changeCallback).to.be.calledWith({ visible: false })
        expect(hideCallback).to.be.calledWith({ visible: false })
      })
    })
  })

  it('publishes visibilityChange.show event', () => {
    const changeCallback = cy.stub()
    const showCallback = cy.stub()

    cy.window().then((window) => {
      const winEvents = new window.WindowEvents()

      winEvents.on('visibilityChange', changeCallback)
      winEvents.on('visibilityChange.show', showCallback)
    }).then(() => {
      cy.document().then((doc) => {
        // First hide the page
        cy.stub(doc, 'hidden').value(true)
        cy.document().trigger('visibilitychange')
      }).then((doc) => {
        expect(changeCallback).to.be.calledWith({ visible: false })
        expect(showCallback).not.to.be.called // eslint-disable-line no-unused-expressions

        // Then show it again
        cy.stub(doc, 'hidden').value(false)
        cy.document().trigger('visibilitychange')
      }).then(() => {
        expect(changeCallback).to.be.calledWith({ visible: true })
        expect(showCallback).to.be.calledWith({ visible: true })
      })
    })
  })
})
