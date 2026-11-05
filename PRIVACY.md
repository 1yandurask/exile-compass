# Privacy Policy — Exile Compass

Effective date: 4 November 2026

Exile Compass is a free Windows desktop app for Path of Exile: a leveling plan over the game and a price check on a key. It has no accounts, no servers of its own, no analytics and no ads. The developer does not collect, receive or store any of your data.

## What the app reads on your computer

- **The game's log file (`Client.txt`).** To know which area you enter, your character's class or ascendancy and the level they reached. It is only read, never changed.
- **The item you check.** When you press the price check key, the app asks the game to copy the item under the cursor, reads that text from the clipboard and then puts back what was in your clipboard before.
- **Which window is in front, and where you click while the price window is open.** Keys are only sent when the Path of Exile window is in front. While the price window is open the app notices a left click outside it, so it can close; it does not record where you click.
- **Running programs.** For Discord, the app checks every few seconds whether Path of Exile is running, by its process name only.

## What the app stores on your computer

Builds, settings, keys, window positions, the price check league and ticks (quests, Labyrinth trials, bought gems) are saved in `%APPDATA%\Exile Compass`. On first start the app copies builds and settings from `%APPDATA%\PoE Act Guide` and `%APPDATA%\PoE Price Check` if they exist. Nothing is sent anywhere.

## When the app connects to the internet

- **Build links.** When you paste a pobb.in, pastebin.com or poe.ninja link, the app downloads that build. Only the link you pasted is requested.
- **pathofexile.com (Grinding Gear Games).** To list leagues and to search the official trade site when you check an item. The search contains the item's properties and the filters you chose. GGG receives a normal web request (your IP address and the app's browser identifier) and may set its usual cookies.
- **poe.ninja.** For currency rates (chaos / divine equivalents).
- **GitHub.** To check for and download updates.

Those sites' own privacy policies apply. No other connections are made.

## Discord

With “Show in Discord” on, the app sends your character's class or ascendancy, level, current area and session time to the Discord app on your own computer. Discord shows it as your activity to people who can see your profile, according to your Discord settings. The app reads nothing from your Discord account. Turn it off in Settings or in Discord at any time.

## Children

The app is not directed at children under 13 and does not collect personal data from anyone.

## Changes

If this policy changes, the new version will be published at this address with a new effective date.

## Contact

Open an issue at https://github.com/1yandurask/exile-compass/issues

Exile Compass is not affiliated with or endorsed by Grinding Gear Games or Discord.
