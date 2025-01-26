import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cz.michalmarkus.photogalleryexam',
  appName: 'Photo Gallery Exam',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      laungShowDuration: 5000,
      launchAutoHide: true,
      backgroudColor: '#8EFFD5',
    }
  }
};

export default config;
