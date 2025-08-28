import React from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';
import * as IoIcons from 'react-icons/io5';

type PlatformTextInputProps = TextInputProps & {
  iconName: keyof typeof IoIcons;
  iconSize?: number;
  iconColor?: string;
};

const toIoIconName = (name: string): keyof typeof IoIcons => {
  const pascal = name
    .split(/[-_ ]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `Io${pascal}` as keyof typeof IoIcons;
};

const PlatformTextInput: React.FC<PlatformTextInputProps> = ({
  iconName,
  iconSize = 24,
  iconColor = '#999',
  style,
  ...props
}) => {
  const iconKey = toIoIconName(iconName);
  const IconComponent = IoIcons[iconKey];

  return (
    <View style={[styles.container, style]}>
      {IconComponent && (
        <IconComponent size={iconSize} color={iconColor} style={styles.icon} />
      )}
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
