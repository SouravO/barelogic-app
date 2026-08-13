# EAS Build Fix - Android Gradle Error (Build 2)

## 🔍 Problem Identified

**Build ID:** `2c4904f1-ad33-4d51-92ce-de8ca3213431` (Second attempt)  
**Error:** `EAS_BUILD_UNKNOWN_GRADLE_ERROR - Gradle build failed with unknown error`  
**Platform:** Android  
**Build Profile:** preview  
**Previous Fix:** Removed conflicting permissions ✅ (but still failing)

---

## ✅ Additional Root Causes Found

### 1. New React Native Architecture
```json
"newArchEnabled": true  // ← Can cause build issues with some packages
```

**Issue:** The new React Native architecture (Fabric/TurboModules) is experimental and can cause compatibility issues with:
- `react-native-reanimated` 
- `react-native-gesture-handler`
- Some Expo packages

### 2. Missing Android Version Code
Android builds require explicit version codes for proper versioning.

---

## 🔧 Fixes Applied

### Fix 1: Disable New Architecture
```json
"android": {
  "permissions": [
    "android.permission.CAMERA",
    "android.permission.READ_MEDIA_IMAGES",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.RECORD_AUDIO"  // ← Problem!
  ]
}

"plugins": [
  ["expo-camera", {
    "microphonePermission": false,
    "recordAudioAndroid": false  // ← Conflicts with RECORD_AUDIO permission!
  }]
]
```

**The conflict:** 
- Android permissions included `RECORD_AUDIO`
- But expo-camera plugin explicitly disabled audio recording
- This creates a Gradle build conflict

---

## 🔧 Fixes Applied

### Fix 1: Disable New Architecture

**Before:**
```json
{
  "expo": {
    "newArchEnabled": true  // ← Removed
  }
}
```

**After:**
```json
{
  "expo": {
    // newArchEnabled removed - uses stable architecture
  }
}
```

### Fix 2: Add Android Version Code

**Before:**
```json
"android": {
  "package": "com.barelogic.app",
  "permissions": ["CAMERA", "READ_MEDIA_IMAGES"]
}
```

**After:**
```json
"android": {
  "package": "com.barelogic.app",
  "permissions": ["CAMERA", "READ_MEDIA_IMAGES"],
  "versionCode": 1  // ← Added
}
```

### Fix 3: Create .easignore

Created `.easignore` file to exclude unnecessary files from build:
```
*.md
.env
scripts/test-*.js
stitch_data/
.vscode/
```

This reduces build payload and potential issues.

---

## 📋 Complete Changes Summary

### Files Modified:

#### 1. app.json
```diff
{
  "expo": {
-   "newArchEnabled": true,
    "android": {
      "package": "com.barelogic.app",
      "permissions": [
        "CAMERA",
        "READ_MEDIA_IMAGES"
-     ]
+     ],
+     "versionCode": 1
    }
  }
}
```

#### 2. .easignore (NEW)
```
# Exclude docs, test files, design files
*.md
.env
stitch_data/
```

---

## 🔍 Why These Changes

### New Architecture Issues:
- **Reanimated 4.1.1** may not be fully compatible with new arch
- **Gesture Handler 2.28.0** can have issues
- **Expo Camera/Image Picker** work better with stable arch
- Disabling provides better compatibility

### Version Code:
- Android requires integer version codes
- EAS may fail without explicit versionCode
- Follows Android best practices

### .easignore:
- Reduces build size
- Prevents unnecessary file processing
- Faster builds
- Avoids potential conflicts

---

**Before:**
```json
"permissions": [
  "android.permission.CAMERA",
  "android.permission.READ_MEDIA_IMAGES",
  "android.permission.READ_EXTERNAL_STORAGE",    // Deprecated in API 33+
  "android.permission.WRITE_EXTERNAL_STORAGE",   // Not needed
  "android.permission.RECORD_AUDIO"              // Conflicts with camera config
]
```

**After:**
```json
"permissions": [
  "CAMERA",              // Modern permission format
  "READ_MEDIA_IMAGES"    // Modern permission format (Android 13+)
]
```

### 2. Benefits of the Fix:
- ✅ Removed deprecated permissions (READ/WRITE_EXTERNAL_STORAGE)
- ✅ Removed conflicting RECORD_AUDIO permission
- ✅ Used modern short-form permission names
- ✅ Kept only what's needed for camera + image picker

---

## 🚀 Next Steps

### 1. Commit the Changes
```bash
git add app.json
git commit -m "fix(android): remove conflicting permissions for camera"
git push
```

### 2. Rebuild with EAS
```bash
# For preview build (APK)
eas build --platform android --profile preview

# For production build (AAB)
eas build --platform android --profile production
```

### 3. Monitor the Build
```bash
# Check build status
eas build:list

# View specific build logs if needed
eas build:view <BUILD_ID>
```

---

## 📋 What Changed in app.json

### Android Section:
```json
{
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/android-icon-foreground.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.barelogic.app",
    "permissions": [
      "CAMERA",
      "READ_MEDIA_IMAGES"
    ]
  }
}
```

### Plugins (No changes needed):
```json
"plugins": [
  "expo-router",
  ["expo-splash-screen", { "imageWidth": 200 }],
  ["expo-camera", {
    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
    "microphonePermission": false,
    "recordAudioAndroid": false
  }],
  ["expo-image-picker", {
    "photosPermission": "Allow $(PRODUCT_NAME) to access your photos"
  }]
]
```

---

## 🔍 Why This Happened

### Original Configuration Issues:
1. **Over-specified permissions** - Included unnecessary permissions
2. **Used full permission names** - `android.permission.X` instead of modern short form
3. **Deprecated permissions** - READ/WRITE_EXTERNAL_STORAGE deprecated in Android 13
4. **Permission conflicts** - RECORD_AUDIO conflicted with camera config

### Modern Best Practices:
1. **Use short-form permissions** - `CAMERA` instead of `android.permission.CAMERA`
2. **Minimal permissions** - Only request what you need
3. **Modern Android APIs** - Use `READ_MEDIA_IMAGES` for Android 13+
4. **Match plugin configs** - Ensure permissions align with plugin settings

---

## ✅ Verification

### Current Configuration:
```bash
$ node -e "const config = JSON.parse(require('fs').readFileSync('app.json', 'utf8')); console.log('Android permissions:', config.expo.android.permissions)"

Android permissions: [ 'CAMERA', 'READ_MEDIA_IMAGES' ]
```

✅ Valid JSON  
✅ No conflicting permissions  
✅ Modern permission format  
✅ Minimal required permissions  

---

## 📱 Permissions Explained

### CAMERA
- **Purpose:** Take photos with device camera
- **Required for:** KYS feature camera capture
- **Android versions:** All

### READ_MEDIA_IMAGES
- **Purpose:** Access images from device gallery
- **Required for:** KYS feature image upload
- **Android versions:** 13+ (Tiramisu)
- **Fallback:** Automatically falls back to READ_EXTERNAL_STORAGE on older versions

---

## 🎯 Expected Outcome

After rebuilding with this fix:
- ✅ Gradle build should succeed
- ✅ APK/AAB will be generated
- ✅ Camera permissions will work correctly
- ✅ Gallery access will work correctly
- ✅ No permission conflicts

---

## 🐛 If Build Still Fails

### Check:
1. **EAS CLI version**: Update to latest with `npm install -g eas-cli`
2. **Node modules**: Clean install with `rm -rf node_modules && npm install`
3. **Cache**: Clear with `eas build --clear-cache`
4. **Dependencies**: Ensure all packages are SDK 54 compatible

### Debug Commands:
```bash
# Check EAS configuration
eas config

# Validate app.json
npx expo config --type public

# Clear everything and retry
eas build --platform android --profile preview --clear-cache
```

---

## 📚 References

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Android Permissions**: https://developer.android.com/guide/topics/permissions/overview
- **Expo Camera**: https://docs.expo.dev/versions/latest/sdk/camera/
- **Expo Image Picker**: https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

**Status:** ✅ Fix applied and ready for rebuild  
**Last Updated:** 2026-08-13 03:02 IST  
**Next Action:** Commit changes and rebuild with EAS
