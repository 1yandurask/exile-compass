// Замена модуля данных Awakened PoE Trade (@/assets/data): те же экспорты, но данные
// читаются из строк ndjson, переданных в init(), а индексы строятся в памяти (Map),
// вместо сгенерированных при сборке .bin-файлов.
import type { BaseType, DropEntry, Stat, StatOrGroup, StatMatcher, TranslationDict } from '../apt/src/assets/data/interfaces'
import EN_CLIENT_STRINGS from '../../data/en/client_strings.js'

export * from '../apt/src/assets/data/interfaces'

export let ITEM_DROP: DropEntry[] = []
export let CLIENT_STRINGS: TranslationDict = EN_CLIENT_STRINGS as any
export let CLIENT_STRINGS_REF: TranslationDict = EN_CLIENT_STRINGS as any
export let APP_PATRONS: Array<{ from: string, months: number, style: number }> = []

export let ITEM_BY_TRANSLATED: (ns: BaseType['namespace'], name: string) => BaseType[] | undefined = () => undefined
export let ITEM_BY_REF: (ns: BaseType['namespace'], name: string) => BaseType[] | undefined = () => undefined
export let ITEMS_ITERATOR: (includes: string, andIncludes?: string[]) => Generator<BaseType> = function * () {}
export let ALTQ_GEM_NAMES: () => Generator<string> = function * () {}
export let REPLICA_UNIQUE_NAMES: () => Generator<string> = function * () {}
export let STAT_BY_MATCH_STR: (name: string) => { matcher: StatMatcher, stat: Stat } | undefined = () => undefined
export let STAT_BY_MATCH_STR_V2: (name: string) => StatOrGroup | undefined = () => undefined
export let STAT_BY_REF_V2: (name: string) => StatOrGroup | undefined = () => undefined
export let STATS_ITERATOR: (includes: string, andIncludes?: string[]) => Generator<Stat> = function * () {}

function ndjsonFindLines<T> (ndjson: string) {
  return function * (searchString: string, andIncludes: string[] = []): Generator<T> {
    let start = 0
    while (start < ndjson.length) {
      const matchPos = ndjson.indexOf(searchString, start)
      if (matchPos === -1) break
      start = ndjson.lastIndexOf('\n', matchPos) + 1
      let end = ndjson.indexOf('\n', matchPos)
      if (end === -1) end = ndjson.length
      const jsonLine = ndjson.slice(start, end)
      if (andIncludes.every(str => jsonLine.includes(str))) yield JSON.parse(jsonLine) as T
      start = end + 1
    }
  }
}

function lines (ndjson: string) {
  return ndjson.split('\n').filter(Boolean)
}

function loadItems (ndjson: string) {
  const byName = new Map<string, BaseType[]>()
  const byRef = new Map<string, BaseType[]>()
  for (const line of lines(ndjson)) {
    const r = JSON.parse(line) as BaseType
    const kn = `${r.namespace}::${r.name}`
    const kr = `${r.namespace}::${r.refName}`
    if (!byName.has(kn)) byName.set(kn, [])
    byName.get(kn)!.push(r)
    if (!byRef.has(kr)) byRef.set(kr, [])
    byRef.get(kr)!.push(r)
  }
  // Как в оригинале: идём по записям с этим именем, пока у записи есть disc или unique
  const find = (map: Map<string, BaseType[]>) => (ns: BaseType['namespace'], name: string) => {
    const list = map.get(`${ns}::${name}`)
    if (!list) return undefined
    const out: BaseType[] = []
    for (const r of list) {
      out.push(r)
      if (!r.disc && !r.unique) break
    }
    return out
  }
  ITEM_BY_TRANSLATED = find(byName)
  ITEM_BY_REF = find(byRef)
  ITEMS_ITERATOR = ndjsonFindLines<BaseType>(ndjson)
  const names = (it: Generator<BaseType>) => { const all = [...it].map(i => i.name); return function * () { yield * all } }
  ALTQ_GEM_NAMES = names(ITEMS_ITERATOR('altQuality":["Anomalous'))
  REPLICA_UNIQUE_NAMES = names(ITEMS_ITERATOR('refName":"Replica'))
}

function loadStats (ndjson: string) {
  const byRef = new Map<string, StatOrGroup>()
  const byMatcher = new Map<string, StatOrGroup>()
  for (const line of lines(ndjson)) {
    const sg = JSON.parse(line) as StatOrGroup
    const stats = ('stats' in sg) ? sg.stats : [sg]
    for (const s of stats) {
      if (!byRef.has(s.ref)) byRef.set(s.ref, sg)
      for (const m of s.matchers) {
        if (!byMatcher.has(m.string)) byMatcher.set(m.string, sg)
        if (m.advanced && !byMatcher.has(m.advanced)) byMatcher.set(m.advanced, sg)
      }
    }
  }
  STAT_BY_REF_V2 = (ref: string) => byRef.get(ref)
  STAT_BY_MATCH_STR_V2 = (matchStr: string) => byMatcher.get(matchStr)
  STAT_BY_MATCH_STR = function (matchStr: string) {
    const statOrGroup = STAT_BY_MATCH_STR_V2(matchStr)
    if (!statOrGroup) return undefined
    let stat: Stat
    if ('stats' in statOrGroup) {
      const stats = statOrGroup.stats.filter(s => s.matchers.some(m => m.string === matchStr || m.advanced === matchStr))
      if (stats.length !== 1) return undefined
      stat = stats[0]
    } else {
      stat = statOrGroup
    }
    const matcher = stat.matchers.find(m => m.string === matchStr || m.advanced === matchStr)!
    return { stat, matcher }
  }
  const _STATS_ITERATOR = ndjsonFindLines<StatOrGroup>(ndjson)
  STATS_ITERATOR = function * (includes, andIncludes) {
    for (const sg of _STATS_ITERATOR(includes, andIncludes)) {
      if ('stats' in sg) yield * sg.stats
      else yield sg
    }
  }
}

export function pseudoStatByRef (ref: string): Stat | undefined {
  const statOrGroup = STAT_BY_REF_V2(ref)
  if (statOrGroup != null && 'stats' in statOrGroup) {
    return statOrGroup.stats.find(stat => stat.ref === ref && 'pseudo' in stat.trade.ids)
  }
  return statOrGroup
}

export function stat (text: string) {
  return text
}

export function init (itemsNdjson: string, statsNdjson: string) {
  loadItems(itemsNdjson)
  loadStats(statsNdjson)
}
