// setProperty(obj, 'a.b.c', v)
export function setProperty (obj, path, value) {
  const keys = path.split('.')
  let o = obj
  for (const k of keys.slice(0, -1)) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k] }
  o[keys[keys.length - 1]] = value
  return obj
}
