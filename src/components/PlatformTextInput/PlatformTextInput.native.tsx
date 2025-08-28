import React from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type PlatformTextInputProps = TextInputProps & {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
};

const PlatformTextInput: React.FC<PlatformTextInputProps> = ({
  iconName,
  iconSize = 24,
  iconColor = '#999',
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
      />
      <RNTextInput
        style={styles.input}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: 48,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000',
  },
});

export default PlatformTextInput;
