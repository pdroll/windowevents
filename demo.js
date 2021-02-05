// WindowEvents is availble on the window
// since we've already loaded it via
// it's own script tag
const { WindowEvents } = window

// Alternatively, you can include WindowEvents
// if you are using a bundler. I.e.
//
// const WindowEvents = require('windowevents')
// or
// import WindowEvents from 'windowevents'

const winEvents = new WindowEvents()
window.winEvents = winEvents

console.log('You can run `winEvents.getState()` in the console to see all the data WindowEvents gives you')
console.log(winEvents.getState())

const DOM = {
  body: document.body,
  header: document.querySelector('[data-header]'),
  nextLink: document.querySelector('[data-next-link]'),
  progress: document.querySelector('[data-progress]'),
  commentsButton: document.querySelector('[data-show-comments]'),
  commentsSection: document.querySelector('[data-comments]'),
  video: document.querySelector('[data-video]')
}
let commentsDisplayed = false

// Remove the `no-js` class from the body
// as soon as JS interactive
winEvents.on('load.interactive', () => {
  DOM.body.classList.remove('no-js')
  DOM.body.classList.add('js')
})

// Hide header when we've scrolled down a bit
winEvents.on('scroll.down', function (scrollData) {
  if (scrollData.scrollTop > 200) {
    DOM.header.classList.add('hide')
  }
})

// Show header when we scroll up
winEvents.on('scroll.up', function () {
  DOM.header.classList.remove('hide')
})

// Show Link to next article when we've almost
// finished scrolling through the current page.
const nextLinkListener = winEvents.on('scroll', function (scrollData) {
  if (scrollData.scrollPercent >= 80) {
    DOM.nextLink.classList.add('show')

    // Remove this listener once we show
    // the next link once.
    winEvents.off('scroll', nextLinkListener)
  }
})

// Update progress bar as we read the article
const updateProgressBar = function (scrollData) {
  DOM.progress.style.width = scrollData.scrollPercent + '%'

  if (commentsDisplayed && scrollData.scrollPercent >= 100) {
    // off can also take a function as a second parameter
    winEvents.off('scroll', updateProgressBar)
  }
}

winEvents.on('scroll', updateProgressBar)

let wasPlaying = false

// Pause video when window loses focus
winEvents.on('visibilityChange.hide', function () {
  console.log('visibility hide')
  wasPlaying = DOM.video.currentTime > 0 && !DOM.video.paused && !DOM.video.ended
  DOM.video.pause()
})

// Play video when window regains focus,
// if it was playing when the window lost focus
winEvents.on('visibilityChange.show', function () {
  console.log('visibility show')
  if (wasPlaying) {
    DOM.video.play()
  }
})

DOM.commentsButton.addEventListener('click', function () {
  DOM.commentsButton.parentNode.removeChild(DOM.commentsButton)
  DOM.commentsSection.classList.remove('hide')
  commentsDisplayed = true

  // Showing the comments has changed the
  // scroll height of the page. We'll need
  // update the winEvents instance
  const winState = winEvents.updateState()
  updateProgressBar(winState)
})
