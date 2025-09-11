import React from 'react';
import {ComponentType} from 'react';
import PageWrapper from './PageWrapper';

interface WithSafeAreaOptions {
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  showStatusBar?: boolean;
}

/**
 * HOC: 自動為組件添加安全區域處理
 * @param WrappedComponent 要包裝的組件
 * @param options 安全區域選項
 */
function withSafeArea<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithSafeAreaOptions = {},
) {
  const {
    backgroundColor = '#fff',
    statusBarStyle = 'dark-content',
    edges = ['top', 'bottom'],
    showStatusBar = true,
  } = options;

  const WithSafeAreaComponent = (props: P) => {
    return (
      <PageWrapper
        backgroundColor={backgroundColor}
        statusBarStyle={statusBarStyle}
        edges={edges}
        showStatusBar={showStatusBar}>
        <WrappedComponent {...props} />
      </PageWrapper>
    );
  };

  WithSafeAreaComponent.displayName = `withSafeArea(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithSafeAreaComponent;
}

export default withSafeArea;
