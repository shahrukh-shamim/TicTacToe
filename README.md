# Tic Tac Toe

The original HTML/CSS/JavaScript game, packaged for Android with Capacitor 8.
The pages, fonts, icons, and AI workers are bundled in the app and work offline.

Easy uses the same minimax scores as Hard but chooses the lowest score: a
player-winning possibility (-1), then a draw (0), then a computer win (1).
It chooses randomly among equally bad moves and opens randomly on an empty board.
Run `npm test` to check its choices against an independent solver across all
reachable positions, including both starting players.

## Web preview

From the repository root:

```sh
python3 -m http.server 7000
```

Open `http://localhost:7000`. Edit the web files in the repository root; `dist/`
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
