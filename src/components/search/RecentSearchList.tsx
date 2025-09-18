import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from '../PlatformIcon';
import {useSearchHistory} from '../../context/SearchHistoryContext';

interface LocationHistoryItem {
  id: string;
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

interface RecentSearchListProps {
  onLocationSelect: (location: LocationHistoryItem) => void;
  onClearHistory?: () => void;
  maxItems?: number;
}

const RecentSearchList: React.FC<RecentSearchListProps> = ({
  onLocationSelect,
  onClearHistory,
  maxItems = 10,
}) => {
  const {locationHistory, removeLocationHistoryItem, clearLocationHistory} = useSearchHistory();

  const displayItems = locationHistory.slice(0, maxItems);

  const handleClearAll = () => {
    clearLocationHistory();
    onClearHistory?.();
  };

  const handleRemoveItem = (id: string, event: any) => {
    event.stopPropagation();
    removeLocationHistoryItem(id);
  };

  const renderHistoryItem = ({item}: {item: LocationHistoryItem}) => {
    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => onLocationSelect(item)}
        activeOpacity={0.7}>
        <Icon name="time-outline" size={18} color="#666" />
        <Text style={styles.locationName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={(event) => handleRemoveItem(item.id, event)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="close" size={14} color="#ccc" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="time-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>暫無搜尋記錄</Text>
      <Text style={styles.emptySubText}>您的搜尋記錄會出現在這裡</Text>
    </View>
  );

  if (displayItems.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>最近搜尋</Text>
        {displayItems.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>清除全部</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// 格式化時間顯示
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return '剛剛';
  } else if (minutes < 60) {
    return `${minutes}分鐘前`;
  } else if (hours < 24) {
    return `${hours}小時前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return new Date(timestamp).toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
    });
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  locationName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default RecentSearchList;
