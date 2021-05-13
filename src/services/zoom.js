export function decideZoomOnClick() {
  let width = window.innerWidth
  if (width < 425) {
    return 1.5
  } else if (width < 825) {
    return 2
  }
  return 2.25
}