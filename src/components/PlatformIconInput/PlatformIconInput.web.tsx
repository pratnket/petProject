import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import * as IoIcons from 'react-icons/io5';

type IconInputProps = TextInputProps & {
  iconName: keyof typeof IoIcons;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
};

const toFaIconName = (name: string): keyof typeof IoIcons => {
  const pascal = name
    .split(/[-_ ]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `Io${pascal}` as keyof typeof IoIcons;
};

const IconInput: React.FC<IconInputProps> = ({
  iconName,
  iconSize = 24,
  iconColor = '#999',
  onPress,
  value,
  placeholder,
}) => {
  const iconKey = toFaIconName(iconName);
  const IconComponent = IoIcons[iconKey];

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {IconComponent && (
        <IconComponent size={iconSize} color={iconColor} style={styles.icon} />
      )}
      <View style={styles.textWrapper}>
        {value ? (
          <Text style={styles.inputText}>{value}</Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
      </View>
    </TouchableOpacity>
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
  textWrapper: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 12,
    color: '#000',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
});

export default IconInput;
