import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Icon from '../PlatformIcon';
import Colors from '../../constants/Colors';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onBack?: () => void;
  showClearIcon?: boolean;
  showSearchIcon?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onBack,
  showClearIcon = true,
  showSearchIcon = true,
  ...props
}) => {
  return (
    <View style={styles.wrapper}>
      {onBack && (
        <TouchableOpacity style={styles.iconLeft} onPress={onBack}>
          <Icon name="arrow-back" size={24} color={Colors.icon.default} />
        </TouchableOpacity>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="輸入地點"
          placeholderTextColor={Colors.input.placeholder}
          onSubmitEditing={onSubmit}
          {...props}
        />
        {value.length > 0 && (showClearIcon || showSearchIcon) && (
          <View style={styles.iconWrapper}>
            {showClearIcon && (
              <TouchableOpacity style={styles.iconButton} onPress={onClear}>
                <Icon
                  name="close-circle"
                  size={20}
                  color={Colors.icon.default}
                />
              </TouchableOpacity>
            )}
            {showSearchIcon && (
              <TouchableOpacity
                style={[styles.iconButton, styles.searchIcon]}
                onPress={onSubmit}>
                <Icon name="search" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  iconLeft: {
    padding: 10,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 80,
    fontSize: 16,
  },
  iconWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 0,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    minWidth: 40,
    minHeight: 40,
  },
  searchIcon: {
    backgroundColor: '#FF8C00',
    borderRadius: 5,
  },
});

export default SearchBar;
