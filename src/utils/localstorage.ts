export const prefix = 'octotread-'

export const getItem = (key: string) => {
  return localStorage.getItem(`${prefix}${key}`)
}

export const setItem = (key: string, value: string) => {
  localStorage.setItem(`${prefix}${key}`, value)
}
