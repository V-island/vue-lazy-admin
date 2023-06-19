import gs from 'good-storage'

export function setItem(key, value) {
  gs.set(key, value)
}

export function getItem(key) {
  return gs.get(key)
}

export function removeItem(key) {
  gs.remove(key)
}

export function getAll(keys) {
  return gs.getAll(keys)
}

export function clear() {
  gs.clear()
}

export default {
  setItem,
  getItem,
  removeItem,
  getAll,
  clear,
}
