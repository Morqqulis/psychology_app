const { withAndroidManifest, withGradleProperties } = require('expo/config-plugins');

module.exports = function withAndroidPatch(config) {
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    const app = androidManifest.application[0];
    
    // Ensure tools namespace exists
    androidManifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    
    // Add tools:replace
    if (app.$['tools:replace']) {
      if (!app.$['tools:replace'].includes('android:appComponentFactory')) {
        app.$['tools:replace'] += ',android:appComponentFactory';
      }
    } else {
      app.$['tools:replace'] = 'android:appComponentFactory';
    }

    // Set AndroidX appComponentFactory
    app.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';

    return config;
  });

  config = withGradleProperties(config, (config) => {
    // Enable Jetifier to resolve duplicate class errors for legacy Android Support libraries interacting with AndroidX
    const jetifierProp = config.modResults.find((prop) => prop.key === 'android.enableJetifier');
    if (jetifierProp) {
      jetifierProp.value = 'true';
    } else {
      config.modResults.push({
        type: 'property',
        key: 'android.enableJetifier',
        value: 'true',
      });
    }
    return config;
  });

  return config;
};
