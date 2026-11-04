// Минимальная замена neverthrow: только то, что использует разборщик
class Ok { constructor (v) { this.value = v } isOk () { return true } isErr () { return false } map (f) { return new Ok(f(this.value)) } andThen (f) { return f(this.value) } }
class Err { constructor (e) { this.error = e } isOk () { return false } isErr () { return true } map () { return this } andThen () { return this } }
export const ok = (v) => new Ok(v)
export const err = (e) => new Err(e)
export const Result = {}
