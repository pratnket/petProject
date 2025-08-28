import React from 'react';
import * as IoIcons from 'react-icons/io5';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
};

const DEFAULT_ICON_NAME = 'IoAlertCircleOutline'; // 預設 icon

const toPascalCase = (name: string) =>
  name
    .split(/[-_ ]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

const iconSets = [
  {prefix: 'Io', icons: IoIcons},
  {prefix: 'Md', icons: MdIcons},
  {prefix: 'Fa', icons: FaIcons},
];

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#999',
  style,
}) => {
  const pascal = toPascalCase(name);

  let IconComponent: React.ComponentType<any> | undefined;
  let iconName: string | undefined;

  for (const set of iconSets) {
    const tryName = `${set.prefix}${pascal}`;
    if (set.icons[tryName]) {
      IconComponent = set.icons[tryName];
      iconName = tryName;
      break;
    }
  }

  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Icon] "${name}" 不存在於所有 icon set，將顯示預設 icon "${DEFAULT_ICON_NAME}"`,
      );
    }
    IconComponent = IoIcons[DEFAULT_ICON_NAME];
  }

  return <IconComponent size={size} color={color} style={style} />;
};

export default Icon;
