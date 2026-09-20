# ArmoredHub

A mobile-first **military vehicle catalog**, recreated in React and packaged for
Android (APK) with Capacitor. Recreated from the original Base44 app
(`armored-hub-258c12fe.base44.app`). Runs entirely on **local mock data** — no
backend or internet required.

## Features

- **Home / Military Arsenal** — searchable catalog, category filter chips
  (All Vehicles + per-category), 2-column card grid.
- **Vehicle detail** — hero image, spec grid (Top Speed, Range, Crew, Weight),
  Armament, Overview, and an admin-only Admin Note.
- **Add / Edit / Delete vehicles** — full form (admin only) with a delete
  confirmation dialog. Changes persist on-device via `localStorage`.
- **Saved** — bookmark vehicles (favorites), stored per-device.
- **Profile** — Admin Mode toggle (stands in for the original user/admin roles)
  and a "Reset Catalog" action to restore the seed data.
- **Bottom tab navigation** — Home · Catalog · Saved · Profile.

## Tech stack

| Concern    | Choice                          |
| ---------- | ------------------------------- |
| UI         | React 18 + React Router (hash)  |
| Styling    | Tailwind CSS                    |
| Icons      | lucide-react                    |
| Build      | Vite                            |
| Mobile/APK | Capacitor (Android)             |
| Data       | Mock service over `localStorage`|

## Project structure

```
src/
  data/mockVehicles.js   # seed data + CATEGORIES / ERAS
  lib/
    api.js               # mock CRUD service (swap for real API later)
    useAuth.jsx          # admin-mode context
    useSaved.js          # favorites hook
  components/            # BottomNav, Layout, VehicleCard, VehicleForm, ...
  pages/                 # Home, VehicleDetail, Saved, Profile, NotFound
```

## Run in the browser (development)

```bash
npm install
npm run dev
```

Open the printed URL. It renders at phone width (centered column).

## Build the web app

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Build the Android APK

The Android project already exists in `android/`. To turn it into an APK you
need the **Android SDK** (this repo's machine has the JDK but not the SDK yet).

1. **Install Android Studio** (bundles the SDK):
   https://developer.android.com/studio
   During setup, let it install the Android SDK + Platform-Tools.
2. **Point the tools at the SDK.** Either open the project once in Android
   Studio, or set the env var and create `android/local.properties`:
   ```
   sdk.dir=C:\\Users\\Admin\\AppData\\Local\\Android\\Sdk
   ```
3. **Sync web assets → native, then build:**
   ```bash
   npm run build
   npx cap sync android
   cd android
   gradlew.bat assembleDebug
   ```
   The debug APK lands at:
   `android/app/build/outputs/apk/debug/app-debug.apk`
   (or run the shortcut `npm run apk`).
4. **Or build from the IDE:** `npm run cap:open` opens the project in Android
   Studio — then **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

Install `app-debug.apk` on a phone (enable "Install unknown apps") to run it.

### Release APK (signed)

For a Play Store / distributable build, generate a keystore and run
`gradlew.bat assembleRelease` with signing configured in
`android/app/build.gradle`. See
https://capacitorjs.com/docs/android/deploying-to-google-play

## Moving off mock data later

Every data call goes through `src/lib/api.js`
(`listVehicles`, `getVehicle`, `createVehicle`, `updateVehicle`,
`deleteVehicle`). Replace those function bodies with `fetch()` calls to a real
API and the rest of the app is unchanged.
