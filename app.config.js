const withSplashScreenFix = require('./plugins/withSplashScreenFix');

module.exports = {
  expo: {
    name: "notwo-app",
    slug: "notwo-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.notwo.app",
      infoPlist: {
        NSCameraUsageDescription: "We need camera access to analyze your skin for personalized recommendations",
        NSPhotoLibraryUsageDescription: "We need photo library access to upload images for skin analysis"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#ffffff"
      },
      package: "com.notwo.app",
      permissions: [
        "CAMERA",
        "READ_MEDIA_IMAGES"
      ],
      versionCode: 1
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-image",
      "expo-status-bar",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          imageWidth: 200
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to analyze your skin",
          microphonePermission: false,
          recordAudioAndroid: false
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            buildArchs: ["arm64-v8a"],
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            enableBundleCompression: true
          }
        }
      ],
      withSplashScreenFix
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "ce89b66f-c23e-4121-ba9a-7b0783e7540c"
      }
    }
  }
};
