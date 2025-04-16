import React from 'react';
import * as IoIcons from 'react-icons/io5';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
};

const toFaIconName = (name: string): keyof typeof IoIcons => {
  const pascal = name
    .split(/[-_ ]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `Io${pascal}` as keyof typeof IoIcons;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#999',
  style,
}) => {
  const IconComponent = IoIcons[toFaIconName(name)];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} style={style} />;
};

export default Icon;
