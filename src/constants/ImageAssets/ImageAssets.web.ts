import { Platform } from 'react-native';

const ImageAssets = {
  error: Platform.select({
    default: '/assets/error.png',           // Web → 靜態資源路徑（Next.js 或 public）
  }),
};

export default ImageAssets;