import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ng.com.avax.esc-pos',
  appName: 'ESC-POS Printer Tester',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
