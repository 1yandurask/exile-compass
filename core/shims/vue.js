// Заглушка Vue: модулям ядра реактивность не нужна, они работают в основном процессе
export const shallowReactive = (x) => x
export const reactive = (x) => x
export const readonly = (x) => x
export const shallowRef = (value) => ({ value })
export const ref = (value) => ({ value })
export const computed = (fn) => ({ get value () { return fn() } })
export const watch = () => () => {}
export const nextTick = (fn) => Promise.resolve().then(fn)
