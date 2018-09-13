export type WatcherCallback = () => void

let isMonitoring: boolean = false
let isScrolling: boolean = false
const watchers: Set<WatcherCallback> = new Set()

function onScroll() {
  if (!isScrolling) {
    isScrolling = true
    requestAnimationFrame(update)
  }
}

function update() {
  isScrolling = false
  watchers.forEach(cb => cb())
}

function start() {
  if (!isMonitoring) {
    window.addEventListener('scroll', onScroll)
    isMonitoring = true
  }
}

function stop() {
  if (isMonitoring) {
    watchers.clear()
    window.removeEventListener('scroll', onScroll)
    isMonitoring = false
  }
}

export function watch(cb: WatcherCallback) {
  if (!isMonitoring) {
    start()
  }
  watchers.add(cb)
}

export function unwatch(cb: WatcherCallback) {
  watchers.delete(cb)
  if (!watchers.size) {
    stop()
  }
}

export function destroy() {
  stop()
}
