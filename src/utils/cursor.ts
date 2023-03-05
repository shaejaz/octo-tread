// TODO: replace deprecated functions
export function getCursor(i: number) {
  return btoa(`cursor:${i}`)
}

export function extractCursorNumber(i: string) {
  return parseInt(atob(i).split(':')[1], 10)
}
