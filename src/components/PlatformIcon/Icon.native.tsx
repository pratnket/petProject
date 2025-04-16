// src/components/common/Icon.native.tsx

import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: object;
};

// 將 kebab-case 或 snake_case 轉成符合 Ionicons 命名的格式（例如：arrow-back -> arrow-back）
const normalizeIconName = (name: string) => {
  return name.replace(/ /g, '-'); // 保留 kebab-case
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#999',
  style = {},
}) => {
  return (
    <Ionicons
      name={normalizeIconName(name)}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default Icon;
