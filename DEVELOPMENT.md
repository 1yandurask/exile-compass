# Exile Compass — for the developer

Notes for building and maintaining the app (in Russian). The player-facing page is [README.md](README.md).


### Собрать `.exe`

Нужны Windows и Node.js 20+.

```bash
npm install
npm run core      # собрать lib/core.js (разбор предметов из Awakened PoE Trade)
npm run fonts     # скачать шрифты Alegreya в renderer/fonts (без них — шрифты Windows)
npm test          # тесты и две сквозные проверки (прокачка и проверка цены)
npm start         # запустить
npm run dist      # установщик и portable-версия в dist/
```

Windows при первом запуске покажет SmartScreen («неизвестный издатель»), потому что файл не подписан.

### Сборка на GitHub (без Node.js на своём компьютере)

В проекте есть `.github/workflows/main.yml`. После загрузки проекта в репозиторий `1yandurask/exile-compass`:

1. Вкладка **Actions** → «Build Windows app» → **Run workflow**.
2. Через 5–10 минут во вкладке **Releases** появится релиз `v<версия из package.json>` с двумя файлами:
   - `Exile-Compass-Setup.exe` — установщик в один клик (ставится в профиль пользователя, права администратора не нужны, создаёт ярлыки и сразу запускает программу);
   - `Exile-Compass-Portable.exe` — без установки.
3. Новая версия: поменять `"version"` в `package.json`, загрузить изменения, снова Run workflow. Релиз с уже существующей версией не перезаписывается. В релиз кроме `.exe` попадают `latest.yml` и `.blockmap` — по ним программы у игроков находят и скачивают обновление; удалять их нельзя.

Если репозиторий называется иначе — поправьте `owner`/`repo` в разделе `build.publish` и `repository` в `package.json`.

### Как устроено

Exile Compass — это PoE Act Guide и PoE Price Check в одной программе.

- `main.js` — основной процесс: настройки, клавиши (одна таблица `settings.hotkeys`, проверка столкновений), окна прокачки, уведомления, Discord, обновления, трей.
- `src/priceCheck.js` — проверка цены: окно цены, поиск на сайте торговли (`src/trade.js`), правила фильтров (`src/rules.js`), ядро разбора `lib/core.js`.
- `src/keys.js` — один процесс PowerShell на все нажатия: COPY (Ctrl+Alt+C), CHAT (/exit), PASTE (поиск у торговца), WATCH/UNWATCH (клик мимо окна цены), FOCUS (вернуть фокус игре).
- `renderer/main.*` — главное окно: вкладки Leveling, Price check, Keys, Settings и первый запуск.
- Первый запуск: если в `%APPDATA%` есть папки `PoE Act Guide` и `PoE Price Check`, оттуда переносятся билды и настройки (`migrateOld` в `main.js`). Клавиши проверки цены и главного окна не отбирают клавишу, уже занятую раньше — тогда они остаются пустыми, их выбирают на вкладке Keys.
- Discord: используется то же приложение Discord, что было у PoE Act Guide. Чтобы в профиле было написано Exile Compass, переименуйте приложение в Discord Developer Portal.

### Обновить дерево к новой лиге

Данные дерева — `data/tree.json` и `data/tree.js` (версия 3.29.1). Цвета камней — `data/gems.json` из Path of Building Community (MIT, лицензия в `data/LICENSE-PathOfBuilding.txt`); обновить: `node scripts/build-gems.js путь/к/PathOfBuilding/src/Data/Gems.lua`. Когда GGG выпустит новое дерево:

```bash
git clone --depth 1 https://github.com/grindinggear/skilltree-export ../skilltree-export
node scripts/build-tree.js ../skilltree-export/data.json 3.30.0
```

### Камни у продавцов и карта зон

`data/gem-vendors.json` (какие камни, каким классам и после какого квеста продают в городах и дают в награду за квесты) и `data/areas.json` (зоны, их id из журнала и соседи) собраны из проекта [Exile-Leveling](https://github.com/HeartofPhos/exile-leveling) (MIT, лицензия в `data/LICENSE-exile-leveling.txt`). Обновить к новой лиге:

```bash
git clone --depth 1 https://github.com/HeartofPhos/exile-leveling ../exile-leveling
node scripts/build-leveling.js ../exile-leveling/common/data/json
```

### Тексты

Все тексты — обычные JSON-файлы в `data/`, их можно править без программирования:

- `data/secrets.json` — секретные комнаты. Формат: акты → записи с `title`, `area`, `text`, `zone` (точное название зоны из журнала — по нему всплывает уведомление).
- `data/quests.json` — квесты с очками пассивов. Поле `zones` — точные названия зон из журнала игры («You have entered …»), по ним всплывают уведомления.
- `data/labyrinth.json` — испытания Лабиринта; поле `zone` работает так же.

**Перед публикацией стоит перепроверить в игре:**
- «Deal with the Bandits — kill all three»: источники расходятся, 1 или 2 очка. В файле — 2.
- «An End to Hunger» (Китава, 10 акт): в файле 2 очка.
- Названия зон испытаний Cruel и Merciless (The Lower Prison, The Crypt, The Bath House, The Tunnel, The Ossuary).

Данные собраны по гайдам Mobalytics и Maxroll; вики PoE не была доступна для проверки.

## Структура

```
main.js                 окна, хоткеи, библиотека билдов, трей
preload.js              мост между окнами и основным процессом
src/pob.js              код/ссылки PoB → этапы и камни
src/xml.js              разбор XML без зависимостей
src/hotkeys.js          нажатие клавиши → сочетание для Windows
src/clientLog.js        чтение Client.txt: зоны, уровень персонажа
src/zones.js            квесты/испытания/секреты в зоне и в соседних зонах
src/gems.js             какие камни купить в этом городе
src/discord.js          показ класса и уровня в профиле Discord
src/xp.js               штраф опыта
src/searches.js         строки поиска у торговца
src/keys.js             нажатия в игру для команды /exit
renderer/build.*        окно билда
renderer/tree.js        отрисовка дерева
renderer/quests.*       квесты и Лабиринт
renderer/secrets.*      секретные комнаты
renderer/main.*         главное окно
data/                   дерево GGG, квесты, Лабиринт, секретные комнаты
scripts/build-tree.js   подготовка дерева из выгрузки GGG
test/                   тесты, тестовый билд и сквозная проверка без Electron
```

Имена файлов в релизе постоянные (без номера версии), поэтому ссылки на главной странице всегда ведут на последнюю версию:
`https://github.com/1yandurask/exile-compass/releases/latest/download/Exile-Compass-Setup.exe`.
