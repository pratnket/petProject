import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'filled';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#8B4513', // 深棕色
  },
  secondary: {
    backgroundColor: '#D2B48C', // 淺棕色
  },
  outline: {
    backgroundColor: '#F7F2EF', // 與頁面背景同色
    borderWidth: 2,
    borderColor: '#A67458', // #A67458 線條
  },
  filled: {
    backgroundColor: '#A67458', // #A67458 底色
    borderWidth: 0, // 無線條
  },
  disabled: {
    backgroundColor: '#D3D3D3',
    opacity: 0.6,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#A67458', // #A67458 文字顏色
  },
  filledText: {
    color: '#FFFFFF', // 白色文字
  },
  disabledText: {
    color: '#666666',
  },
});

export default AuthButton;
