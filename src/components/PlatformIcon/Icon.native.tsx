import React from 'react';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: object;
};

const DEFAULT_ICON_NAME = 'alert-circle-outline'; // Ionicons 預設 icon
const DEFAULT_FEATHER_ICON = 'alert-circle'; // Feather 預設 icon

const normalizeIconName = (name: string) => name.replace(/ /g, '-');

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#999',
  style = {},
}) => {
  try {
    let iconName = normalizeIconName(name);

    // 安全地檢查 Ionicons
    try {
      const ioniconsMap = Ionicons.getRawGlyphMap?.() || {};
      if (ioniconsMap[iconName]) {
        return <Ionicons name={iconName} size={size} color={color} style={style} />;
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(`[Icon] Ionicons 檢查失敗:`, error);
      }
    }

    // 安全地檢查 Feather
    try {
      const featherMap = Feather.getRawGlyphMap?.() || {};
      if (featherMap[iconName]) {
        if (__DEV__) {
          console.warn(
            `[Icon] "${iconName}" 不存在於 Ionicons，已 fallback 到 Feather`,
          );
        }
        return <Feather name={iconName} size={size} color={color} style={style} />;
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(`[Icon] Feather 檢查失敗:`, error);
      }
    }

    // 預設 icon
    if (__DEV__) {
      console.warn(
        `[Icon] "${iconName}" 不存在於 Ionicons/Feather，將顯示預設 icon "${DEFAULT_ICON_NAME}"`,
      );
    }
    return (
      <Ionicons
        name={DEFAULT_ICON_NAME}
        size={size}
        color={color}
        style={style}
      />
    );
  } catch (error) {
    if (__DEV__) {
      console.error(`[Icon] 圖標載入失敗:`, error);
    }
    // 最後的 fallback - 返回一個簡單的 View
    return <View style={[{width: size, height: size, backgroundColor: color}, style]} />;
  }
};

export default Icon;
