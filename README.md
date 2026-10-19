# Birthdays

A local-first birthday calendar for iPhone. The app runs in Expo Go (Expo SDK 57). There is no account and no server.

## Run it on your iPhone

1. Install **Expo Go** from the App Store. The version number should start with **57**.
2. On your computer, in this folder, run:

```bash
npx expo start
```

3. Scan the QR code with the iPhone **Camera** app, then tap the banner to open Expo Go.
4. If the phone cannot reach your computer, stop the server (Ctrl+C) and run:

```bash
npx expo start --tunnel
```

Your phone and computer should be on the same Wi‑Fi for the first command. Tunnel mode works across networks, but it is slower.

## Where things live

- `app/` — screens and navigation
- `components/` — shared UI
- `i18n/` — Greek (`el`) and English (`en`); Greek is the default
- `store/` — birthdays saved on the device
- `lib/` — date logic and photo files
