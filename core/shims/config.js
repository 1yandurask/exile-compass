// Заглушка настроек Awakened PoE Trade — только то, что читают модули ядра
const WIDGET = { apiLatencySeconds: 2, merchantOnly: true, collapseListings: 'api', activateStockFilter: false, searchStatRange: 10 }
export function AppConfig (name) { return name ? WIDGET : { language: 'en', useIntlSite: false } }
export function poeWebApi () { return 'www.pathofexile.com' }
