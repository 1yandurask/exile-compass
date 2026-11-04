# Third-party licences

## Awakened PoE Trade

The item parser, the item data (`data/en/*`) and the search filter logic in `core/apt/` come from
[Awakened PoE Trade](https://github.com/SnosMe/awakened-poe-trade) by Alexander Drozdov,
MIT License — full text in [`core/apt/LICENSE`](core/apt/LICENSE).
The exact source commit is in `core/apt/SOURCE-COMMIT`. Changed in Exile Compass: `parser/advanced-mod-desc.ts` also records whether an eldritch implicit is from the Eater of Worlds or the Searing Exarch; `web/price-check/filters/pseudo/index.ts` keeps every single elemental resistance (hidden) instead of only the highest. `lib/core.js` is built from these files by `scripts/build-core.js`.

Path of Exile is a trademark of Grinding Gear Games. Exile Compass is not affiliated with or endorsed by Grinding Gear Games.

## Alegreya and Alegreya Sans

The fonts in `renderer/fonts` (downloaded at build time by `scripts/fetch-fonts.js`) are Alegreya and Alegreya Sans by Juan Pablo del Peral, Huerta Tipográfica, licensed under the SIL Open Font License 1.1. The licence texts are shipped next to the fonts (`OFL-Alegreya.txt`, `OFL-AlegreyaSans.txt`).

## PoE Act Guide data

Passive tree data: official GGG export. Gem colours from Path of Building Community (MIT, `data/LICENSE-PathOfBuilding.txt`). Gem vendors, quest rewards and area map from Exile-Leveling (MIT, `data/LICENSE-exile-leveling.txt`).
