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

    // Strip foreground-service permissions auto-merged by expo-audio.
    // The app records/plays audio only while the chat UI is open;
    // no background playback or background recording is performed.
    // Declaring these to Google Play would be a false use-case declaration.
    const permissionsToRemove = [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
      'android.permission.FOREGROUND_SERVICE_MICROPHONE',
    ];

    androidManifest['uses-permission'] = (androidManifest['uses-permission'] || []).filter(
      (perm) => !permissionsToRemove.includes(perm.$['android:name'])
    );

    for (const name of permissionsToRemove) {
      androidManifest['uses-permission'].push({
        $: {
          'android:name': name,
          'tools:node': 'remove',
        },
      });
    }

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
