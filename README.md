# Tic Tac Toe

The original HTML/CSS/JavaScript game, packaged for Android with Capacitor 8.
The pages, fonts, icons, and AI workers are bundled in the app and work offline.

Easy uses the same minimax scores as Hard but chooses the lowest score: a
player-winning possibility (-1), then a draw (0), then a computer win (1).
It chooses randomly among equally bad moves and opens randomly on an empty board.
Run `npm test` to check its choices against an independent solver across all
reachable positions, including both starting players.

Normal cycles through target scores 1, 1, 0, -1 on its computer turns, then
repeats. If the target is unavailable, it chooses the closest score (preferring
the higher score on a tie), with random choices among equally scored moves.
An empty-board opening is random and counts as its first turn. The counter
starts over for each new game.

Settings controls who starts each game: Computer, 1P, or Alternate. Alternate
begins with the player and remembers the next starter across games and visits.
Play and Play another game start directly, without a first-turn popup.

Two players shares one device, with Player 1 using your saved symbol and color.
Choose Player 1 or Player 2 as the starter under 2P First Turn in Settings.
Replay keeps the same mode; single-player starter preferences are independent.

## Project layout

- `src/`: HTML pages and browser files.
  - `styles/`: shared and page stylesheets.
  - `js/`: interface, settings, localization, and game scripts.
  - `workers/`: Easy, Normal, and Hard AI workers.
  - `assets/`: bundled font, icons, and original bitmap images.
  - `locales/`: translation files.
- `docs/`: [styling guide](docs/STYLING.md).
- `legacy/`: original PHP page, retained for reference.
- `scripts/`: web packaging script.
- `tests/`: automated checks.
- `android/`: native Android project.
- `dist/`: generated web build.

## Web preview

From the repository root:

```sh
python3 -m http.server 7000 --directory src
```

Open `http://localhost:7000`. Edit the web files in `src/`; `dist/`
and Android's copied web assets are generated and should not be edited.

## Android debug build

Requires Node.js 22+, npm, JDK 21, and an Android SDK with platform 36,
build-tools 35.0.0, and platform-tools. Use the project's Gradle wrapper;
Android Studio and an emulator are optional.

```sh
npm ci
npm run android:build
```

`npm run android:build` packages the web assets, syncs Capacitor, and runs
`android/gradlew assembleDebug`. The APK is created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Configure `ANDROID_HOME` to point to your Android SDK and `JAVA_HOME` to your
JDK. The first build needs internet access to download Gradle and Maven dependencies.

## Install on a phone

With one authorized USB or wireless ADB device connected:

```sh
adb devices -l
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.shahrukhshamim.tictactoe/.MainActivity
```

The app is named **Tic Tac Toe**, with application ID
`com.shahrukhshamim.tictactoe`. This is a debug build for testing. Store signing,
release builds, and iOS packaging are separate steps.
