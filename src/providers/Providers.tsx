import React, {ReactNode} from 'react';
import {ModalProvider} from '../context/ModalContext';
import {AuthProvider} from '../context/AuthContext';
import {SearchConditionProvider} from '../context/SearchConditionContext';
import {SearchHistoryProvider} from '../context/SearchHistoryContext';

type ProvidersProps = {
  children: ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({children}) => (
  <ModalProvider>
    <AuthProvider>
      <SearchConditionProvider>
        <SearchHistoryProvider>{children}</SearchHistoryProvider>
      </SearchConditionProvider>
    </AuthProvider>
  </ModalProvider>
);

export default Providers;
