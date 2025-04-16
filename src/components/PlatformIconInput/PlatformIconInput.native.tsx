import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInputProps,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IconInputProps = TextInputProps & {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
};

const PlatformIconInput: React.FC<IconInputProps> = ({
  iconName,
  iconSize = 24,
  iconColor = '#999',
  onPress,
  value,
  placeholder,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}>
      <Ionicons
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
      />
      <View style={styles.textWrapper}>
        {value ? (
          <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">
            {value}
          </Text>
        ) : (
          <Text
            style={styles.placeholder}
            numberOfLines={1}
            ellipsizeMode="tail">
            {placeholder}
          </Text>
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
    height: 48,
    // ✅ 不加 flex: 1，讓父層控制欄位寬度
  },
  icon: {
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
    color: '#000',
    includeFontPadding: false,
    lineHeight: 20, // ✅ 加這行，避免行高壓縮
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    includeFontPadding: false,
    lineHeight: 20,
  },
});

export default PlatformIconInput;
