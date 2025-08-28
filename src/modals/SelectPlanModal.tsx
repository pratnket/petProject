import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from '../components/PlatformIcon';
import {useModal} from '../context/ModalContext';

const PlanSelectorModal = ({
  onSelect,
  plans,
}: {
  onSelect: (plan: {label: string; price: number}) => void;
  plans: {label: string; price: number}[];
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {closeModal} = useModal();

  return (
    <Modal animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>選擇方案</Text>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>描述</Text>
          <FlatList
            data={plans}
            keyExtractor={item => item.label}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => setSelectedIndex(index)}>
                <Icon
                  name={
                    selectedIndex === index
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={20}
                  color={selectedIndex === index ? '#3777f0' : '#aaa'}
                  style={{marginRight: 12}}
                />
                <Text style={styles.optionText}>{item.label}</Text>
                <Text style={styles.priceText}>
                  TWD {item.price.toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              onSelect(plans[selectedIndex]);
              closeModal();
            }}>
            <Text style={styles.confirmText}>選擇方案</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlanSelectorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#3777f0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
