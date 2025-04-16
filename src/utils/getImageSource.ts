// src/utils/getImageSource.ts
import { Platform } from 'react-native';

export function getImageSource(source: string | number) {
  return Platform.OS === 'web'
    ? { uri: source as string }
    : (source as number);
}