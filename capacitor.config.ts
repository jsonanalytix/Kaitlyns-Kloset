import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaitlynskloset.app',
  appName: "Kaitlyn's Kloset",
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#FAF7F4',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FAF7F4',
    },
    Keyboard: {
      resize: 'body',
      scrollAssist: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  server: {
    // Uncomment for live-reload during development:
    // url: 'http://localhost:3000',
    // cleartext: true,
    androidScheme: 'https',
  },
};

export default config;
