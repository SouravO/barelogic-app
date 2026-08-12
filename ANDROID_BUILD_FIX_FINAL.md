# Android Build Fix - Complete Solution

## Problem Summary

The EAS Build for Android was failing with two different errors:

### Error 1: Missing Splash Screen Logo
```
error: resource drawable/splashscreen_logo (aka com.barelogic.app:drawable/splashscreen_logo) not found.
```

### Error 2: Dependency Resolution Failure (after committing android folder)
```
Could not determine the dependencies of task ':app:mergeReleaseNativeLibs'.
No matching variant of project :react-native-gesture-handler was found.
```

## Root Cause

1. **Splash Screen Issue**: The `expo-splash-screen` plugin wasn't generating the `splashscreen_logo.png` drawable during `expo prebuild`, even though it was referenced in `styles.xml`

2. **Dependency Issue**: When the android folder was committed to git, EAS Build tried to use it directly but the native module paths were incorrect for the EAS Build environment (`/home/expo/workingdir/build/`)

## Solution Applied

### ✅ Created Custom Expo Config Plugin

**File**: `plugins/withSplashScreenFix.js`

This plugin runs during the prebuild process and automatically copies the splash icon to the correct drawable location:

```javascript
const withSplashScreenFix = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // Copies assets/images/splash-icon.png to 
      // android/app/src/main/res/drawable/splashscreen_logo.png
      ...
    },
  ]);
};
```

### ✅ Converted app.json to app.config.js

This allows us to programmatically add the custom plugin:

```javascript
plugins: [
  "expo-router",
  ["expo-splash-screen", { imageWidth: 200 }],
  ...
  withSplashScreenFix  // <-- Our custom plugin
],
```

### ✅ Kept android folder gitignored

- Let EAS Build generate the android folder fresh using `expo prebuild`
- This ensures all native module paths are correct for the build environment
- The custom plugin runs during prebuild and fixes the splash screen automatically

### ✅ Cleaned up secrets

- Removed API keys from `eas.json` to pass GitHub push protection
- API keys should be set via EAS Secrets instead

## Files Modified

```
✅ Created:
   - plugins/withSplashScreenFix.js
   - app.config.js (migrated from app.json)
   - eas-hooks/eas-build-post-install.sh (backup hook)

✅ Modified:
   - .gitignore (kept android folder ignored)
   - eas.json (removed secrets, added hook reference)
   - app.json (kept for backward compatibility)

✅ Removed:
   - android/ folder (back to gitignored, generated on-demand)
```

## Verification

Local build test successful:
```bash
$ npx expo prebuild --platform android --clean
✅ Splash screen logo copied to drawable folder
✔ Finished prebuild

$ cd android && ./gradlew :app:assembleRelease
BUILD SUCCESSFUL in 3m 21s
```

APK generated: `android/app/build/outputs/apk/release/app-release.apk` (103MB)

## Next Steps

### To build with EAS:

```bash
# For preview build (APK):
eas build --platform android --profile preview

# For production build (AAB):
eas build --platform android --profile production
```

### To set API keys in EAS:

```bash
eas secret:create --name EXPO_PUBLIC_GEMINI_API_KEY --value "your-api-key-here" --type string
```

Then update `eas.json` to reference it:
```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_GEMINI_API_KEY": "@EXPO_PUBLIC_GEMINI_API_KEY"
      }
    }
  }
}
```

## How It Works

1. **EAS Build starts** → Runs `npm install`
2. **Prebuild phase** → Runs `expo prebuild` to generate native code
3. **Plugin execution** → Our custom plugin copies splash icon
4. **Gradle build** → Finds splashscreen_logo.png and builds successfully

## Technical Details

- The expo-splash-screen plugin creates a `Theme.App.SplashScreen` style that references `@drawable/splashscreen_logo`
- This drawable needs to exist at build time
- The plugin wasn't creating it automatically (possible bug or configuration issue)
- Our custom plugin ensures it's created consistently in all build environments

## Troubleshooting

If the build still fails:

1. Check that `assets/images/splash-icon.png` exists
2. Verify the plugin is listed in app.config.js
3. Check EAS Build logs for "✅ Splash screen logo copied to drawable folder"
4. Ensure android folder is gitignored (not committed)

## References

- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [Expo Splash Screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
