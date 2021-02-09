const { fireEvent } = require('@testing-library/dom')

global.window.scrollTo = async (scrollX, scrollY) => {
  const target = { scrollX, scrollY }
  return fireEvent.scroll(window, { target })
}


// Simulate window resize event
const resizeEvent = document.createEvent('Event')
resizeEvent.initEvent('resize', true, true)

global.window.resizeTo = (width, height) => {
  global.window.innerWidth = width || global.window.innerWidth
  global.window.innerHeight = height || global.window.innerHeight
  global.window.dispatchEvent(resizeEvent)
}

global.beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();

  // Set default viewport size
  window.resizeTo(1024, 768)

  // Mock the scroll height of the body
  Object.defineProperty(document.body, 'scrollHeight', {
    writable: true, value: 2000
  })

  // Mock the document.hidden property
  Object.defineProperty(document, 'hidden', {
    writable: true, value: false
  })

  // Mock the document.readyState property
  Object.defineProperty(document, 'readyState', {
    writable: true, value: 'loading'
  })
})


global.afterEach(() => {
  jest.runAllTimers();
})
