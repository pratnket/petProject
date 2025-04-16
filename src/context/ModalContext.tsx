import React, {createContext, useContext, useState} from 'react';

type ModalKeys = 'location' | 'date' | 'animal';

type ModalContextType = {
  activeModal: ModalKeys | null;
  openModal: (key: ModalKeys) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [activeModal, setActiveModal] = useState<ModalKeys | null>(null);

  const openModal = (key: ModalKeys) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{activeModal, openModal, closeModal}}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal 必須在 ModalProvider 裡使用');
  return context;
};
