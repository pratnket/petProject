import React from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {FaCheckCircle, FaTimesCircle} from 'react-icons/fa'; // 正確的導入方式

type ModalWrapperProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
  success: boolean; // 新增的成功與否判斷
};

const ModalWrapper = ({
  visible,
  message,
  onClose,
  success,
}: ModalWrapperProps) => {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {success ? (
            <FaCheckCircle size={50} color="green" />
          ) : (
            <FaTimesCircle size={50} color="red" />
          )}
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.close} onClick={onClose}>
            Close
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  close: {
    color: 'blue',
    marginTop: 10,
  },
});

export default ModalWrapper;
