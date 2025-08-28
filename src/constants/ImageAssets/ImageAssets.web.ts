import { Platform } from 'react-native';

const ImageAssets = {
  error: Platform.select({
    default: '/assets/error.png',           // Web → 靜態資源路徑（Next.js 或 public）
  }),
  marker: Platform.select({
    default: '/assets/marker.png',          // Web → 靜態資源路徑（Next.js 或 public）
  }),
  mpa: Platform.select({
    default: '/assets/map.png',          // Web → 靜態資源路徑（Next.js 或 public）
  }),
  Logo: Platform.select({
    default: '/assets/logo.png',          // Web → 靜態資源路徑（Next.js 或 public）
  }),
};

export default ImageAssets;