import React from 'react';

interface Props {
  src: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  height?: number | string;
  absolute?: boolean;
}

const PlatformImageBackground: React.FC<Props> = ({
  src,
  children,
  style,
  height = 150,
  absolute = false,
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        position: absolute ? 'absolute' : 'relative',
        top: absolute ? 0 : undefined,
        left: absolute ? 0 : undefined,
        zIndex: absolute ? -1 : undefined,
        ...style,
      }}>
      {children}
    </div>
  );
};

export default PlatformImageBackground;
