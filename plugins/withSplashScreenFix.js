const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to ensure splash screen logo exists in Android drawable
 */
const withSplashScreenFix = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const splashSource = path.join(projectRoot, 'assets/images/splash-icon.png');
      const drawableDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/drawable'
      );
      const splashDest = path.join(drawableDir, 'splashscreen_logo.png');

      // Ensure drawable directory exists
      if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true });
      }

      // Copy splash icon if source exists
      if (fs.existsSync(splashSource)) {
        fs.copyFileSync(splashSource, splashDest);
        console.log('✅ Splash screen logo copied to drawable folder');
      } else {
        console.warn('⚠️  Splash source not found:', splashSource);
      }

      return config;
    },
  ]);
};

module.exports = withSplashScreenFix;
