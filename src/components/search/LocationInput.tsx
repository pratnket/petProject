import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from '../PlatformIcon';
import locationService from '../../utils/locationService';

interface LocationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onNearbyPress?: () => void;
  placeholder?: string;
  loading?: boolean;
  nearbyLoading?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  onNearbyPress,
  placeholder = '輸入地點',
  loading = false,
  nearbyLoading = false,
}) => {
  const inputRef = useRef<TextInput>(null);

  const handleNearbyPress = async () => {
    if (nearbyLoading) return;
    
    if (onNearbyPress) {
      onNearbyPress();
    } else {
      // 預設行為：獲取當前位置
      try {
        const result = await locationService.getNearbyLocation();
        if (result.success && result.coordinates) {
          const address = await locationService.reverseGeocode(result.coordinates);
          onChangeText(address);
        }
      } catch (error) {
        console.error('獲取附近位置失敗:', error);
      }
    }
  };

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color="#3b82f6"
            style={styles.loadingIcon}
          />
        )}

        {!loading && value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nearbyButton, nearbyLoading && styles.nearbyButtonDisabled]}
        onPress={handleNearbyPress}
        disabled={nearbyLoading}
        activeOpacity={0.7}>
        <View style={styles.nearbyButtonContent}>
          {nearbyLoading ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Icon name="location" size={18} color="#3b82f6" />
          )}
          <Text style={[styles.nearbyText, nearbyLoading && styles.nearbyTextDisabled]}>
            附近區域
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  loadingIcon: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0f0ff',
  },
  nearbyButtonDisabled: {
    opacity: 0.6,
  },
  nearbyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  nearbyTextDisabled: {
    color: '#999',
  },
});

export default LocationInput;
