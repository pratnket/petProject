import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  PanResponder,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useModal} from '../../context/ModalContext';
import Sound from 'react-native-sound';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const BUTTON_SIZE = 50;
const BUTTON_MARGIN = 20;
const MENU_WIDTH = 150;
const MENU_HEIGHT = 240; // 增加高度以容納音樂控制

interface FloatingTestButtonProps {
  visible?: boolean;
}

const FloatingTestButton: React.FC<FloatingTestButtonProps> = ({
  visible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});

  // 新增：修改AsyncStorage的Modal狀態
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [storageKey, setStorageKey] = useState('');
  const [storageValue, setStorageValue] = useState('');
  const [existingKeys, setExistingKeys] = useState<string[]>([]);

  // 新增：音樂播放狀態
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);

  // 新增：Keychain 狀態
  const [keychainStatus, setKeychainStatus] = useState<string>('未檢查');
  const [keychainData, setKeychainData] = useState<any>(null);

  const {openModal} = useModal();

  // 載入保存的位置
  useEffect(() => {
    loadPosition();
    loadStorageInfo();
    checkKeychainStatus(); // 重新啟用 Keychain 檢查

    // 初始化 Sound
    Sound.setCategory('Playback');
  }, []);

  // 組件卸載時清理音樂
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stop();
        currentSound.release();
      }
    };
  }, [currentSound]);

  const loadPosition = async () => {
    try {
      const savedX = await AsyncStorage.getItem('testButtonPositionX');
      const savedY = await AsyncStorage.getItem('testButtonPositionY');

      let initialX, initialY;

      if (savedX && savedY) {
        initialX = parseFloat(savedX);
        initialY = parseFloat(savedY);
      } else {
        // 預設位置
        initialX = SCREEN_WIDTH - BUTTON_SIZE - BUTTON_MARGIN;
        initialY = SCREEN_HEIGHT - BUTTON_SIZE - BUTTON_MARGIN - 100;
      }

      setPosition({x: initialX, y: initialY});
    } catch (error) {
      console.error('載入測試按鈕位置失敗:', error);
      // 預設位置
      const defaultX = SCREEN_WIDTH - BUTTON_SIZE - BUTTON_MARGIN;
      const defaultY = SCREEN_HEIGHT - BUTTON_SIZE - BUTTON_MARGIN - 100;
      setPosition({x: defaultX, y: defaultY});
    }
  };

  const savePosition = async (x: number, y: number) => {
    try {
      await AsyncStorage.setItem('testButtonPositionX', x.toString());
      await AsyncStorage.setItem('testButtonPositionY', y.toString());
    } catch (error) {
      console.error('保存測試按鈕位置失敗:', error);
    }
  };

  const loadStorageInfo = async () => {
    // 這個函數現在不需要了，因為我們直接使用 AsyncStorage.getAllKeys()
  };

  // 載入現有的存儲鍵
  const loadExistingKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setExistingKeys([...keys]);
    } catch (error) {
      console.error('載入現有鍵失敗:', error);
    }
  };

  // 檢查 Keychain 狀態和數據
  const checkKeychainStatus = async () => {
    try {
      setKeychainStatus('檢查中...');

      // 動態引入 Keychain
      const Keychain = require('react-native-keychain');

      // 檢查 Keychain 是否可用
      const supported = await Keychain.getSupportedBiometryType();
      setKeychainStatus(`支持生物識別: ${supported || '無'}`);

      // 嘗試讀取 Keychain 中的數據
      try {
        const tokenCredentials = await Keychain.getGenericPassword({
          service: 'auth_token',
        });
        const userInfoCredentials = await Keychain.getGenericPassword({
          service: 'user_info',
        });

        const keychainInfo = {
          auth_token: tokenCredentials ? '已存儲' : '未存儲',
          user_info: userInfoCredentials ? '已存儲' : '未存儲',
          token_data: tokenCredentials?.password || null,
          user_data: userInfoCredentials?.password || null,
        };

        setKeychainData(keychainInfo);
      } catch (readError) {
        setKeychainData({error: '讀取失敗', details: readError.message});
      }
    } catch (error) {
      setKeychainStatus(`Keychain 不可用: ${error.message}`);
      setKeychainData({error: 'Keychain 不可用'});
    }
  };

  // 計算選單位置，確保不超出螢幕
  const getMenuPosition = () => {
    let menuX = position.x + BUTTON_SIZE + 10; // 預設在按鈕右側
    let menuY = position.y - 20; // 預設在按鈕上方

    // 檢查右邊界
    if (menuX + MENU_WIDTH > SCREEN_WIDTH - BUTTON_MARGIN) {
      menuX = position.x - MENU_WIDTH - 10; // 改為在按鈕左側
    }

    // 檢查左邊界
    if (menuX < BUTTON_MARGIN) {
      menuX = BUTTON_MARGIN;
    }

    // 檢查上邊界
    if (menuY < BUTTON_MARGIN) {
      menuY = BUTTON_MARGIN;
    }

    // 檢查下邊界
    if (menuY + MENU_HEIGHT > SCREEN_HEIGHT - BUTTON_MARGIN) {
      menuY = SCREEN_HEIGHT - MENU_HEIGHT - BUTTON_MARGIN;
    }

    return {x: menuX, y: menuY};
  };

  // 創建 PanResponder - 修復點擊和拖曳問題
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true, // 立即響應觸摸
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // 降低移動閾值，讓拖曳更容易觸發
      const {dx, dy} = gestureState;
      const moveThreshold = 8; // 降低到 8px，讓拖曳更容易觸發
      return Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold;
    },
    onPanResponderGrant: evt => {
      // 記錄觸摸點相對於按鈕的偏移
      const {pageX, pageY} = evt.nativeEvent;
      setDragOffset({
        x: pageX - position.x,
        y: pageY - position.y,
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      const {dx, dy} = gestureState;
      const moveThreshold = 8;

      // 只有移動距離超過閾值時才開始拖曳
      if (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold) {
        setIsDragging(true);

        const {pageX, pageY} = evt.nativeEvent;

        // 計算新位置
        let newX = pageX - dragOffset.x;
        let newY = pageY - dragOffset.y;

        // 邊界限制
        const maxX = SCREEN_WIDTH - BUTTON_SIZE - BUTTON_MARGIN;
        const maxY = SCREEN_HEIGHT - BUTTON_SIZE - BUTTON_MARGIN;
        const minX = BUTTON_MARGIN;
        const minY = BUTTON_MARGIN;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        setPosition({x: newX, y: newY});
      }
    },
    onPanResponderRelease: () => {
      // 使用 isDragging 狀態來判斷是否為拖曳
      if (isDragging) {
        // 這是拖曳，保存位置
        console.log('🔄 檢測到拖曳，保存位置');
        savePosition(position.x, position.y);
      } else {
        // 這是點擊，打開選單
        console.log('🎯 檢測到點擊，切換選單狀態');
        setIsExpanded(!isExpanded);
      }

      setIsDragging(false);
    },
  });

  // 音樂播放功能
  const playMusic = () => {
    if (isPlaying) return;

    try {
      // 停止當前播放的音樂
      if (currentSound) {
        currentSound.stop();
        currentSound.release();
      }

      // 創建新的音樂實例
      // 嘗試多種載入方式
      let sound: Sound;

      // 方式1: 使用 MAIN_BUNDLE
      sound = new Sound('music.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.error('MAIN_BUNDLE 載入失敗:', error);

          // 方式2: 嘗試使用 DOCUMENT 目錄
          sound = new Sound('music.mp3', Sound.DOCUMENT, error2 => {
            if (error2) {
              console.error('DOCUMENT 載入也失敗:', error2);
              console.error('錯誤詳情:', JSON.stringify(error2, null, 2));
              Alert.alert(
                '錯誤',
                `音樂載入失敗: ${error2.message || '未知錯誤'}`,
              );
              return;
            }

            // 成功載入，設置循環播放
            sound.setNumberOfLoops(-1);
            sound.play(success => {
              if (success) {
                console.log('音樂播放成功 (DOCUMENT)');
              } else {
                console.log('音樂播放失敗 (DOCUMENT)');
              }
            });

            setCurrentSound(sound);
            setIsPlaying(true);
          });
          return;
        }

        // 設置循環播放
        sound.setNumberOfLoops(-1); // -1 表示無限循環

        // 播放音樂
        sound.play(success => {
          if (success) {
            console.log('音樂播放成功');
          } else {
            console.log('音樂播放失敗');
          }
        });

        setCurrentSound(sound);
        setIsPlaying(true);
      });
    } catch (error) {
      console.error('播放音樂錯誤:', error);
      Alert.alert('錯誤', '播放音樂失敗');
    }
  };

  const stopMusic = () => {
    if (!isPlaying || !currentSound) return;

    try {
      currentSound.stop();
      currentSound.release();
      setCurrentSound(null);
      setIsPlaying(false);
      console.log('音樂已停止');
    } catch (error) {
      console.error('停止音樂錯誤:', error);
    }
  };

  // 功能函數
  const openWelcomeModal = () => {
    setIsExpanded(false);
    openModal('welcome');
  };

  const openStorageModal = async () => {
    await loadExistingKeys();
    setShowStorageModal(true);
  };

  const selectExistingKey = (key: string) => {
    setStorageKey(key);
    // 載入該鍵的當前值
    AsyncStorage.getItem(key).then(value => {
      setStorageValue(value || '');
    });
  };

  const modifyStorageValue = async () => {
    if (!storageKey.trim()) {
      Alert.alert('錯誤', '請輸入存儲鍵名');
      return;
    }

    try {
      await AsyncStorage.setItem(storageKey.trim(), storageValue.trim());
      Alert.alert('成功', `已設定 ${storageKey}: ${storageValue}`);
      setStorageKey('');
      setStorageValue('');
      setShowStorageModal(false);
      loadStorageInfo(); // 重新載入存儲信息
    } catch (error) {
      Alert.alert('錯誤', '設定失敗');
    }
  };

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('成功', '已清除所有存儲');
      loadStorageInfo();
    } catch (error) {
      Alert.alert('錯誤', '清除失敗');
    }
  };

  const showStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let storageInfo = '';

      // AsyncStorage 信息
      storageInfo += '📱 AsyncStorage:\n';
      const pairs = await AsyncStorage.multiGet(keys);
      for (const [key, value] of pairs) {
        storageInfo += `${key}: ${value || 'null'}\n`;
      }

      // Keychain 信息
      storageInfo += '\n🔐 Keychain 狀態:\n';
      storageInfo += `${keychainStatus}\n`;

      if (keychainData && !keychainData.error) {
        storageInfo += '\n🔑 Keychain 數據:\n';
        storageInfo += `auth_token: ${keychainData.auth_token}\n`;
        storageInfo += `user_info: ${keychainData.user_info}\n`;
        if (keychainData.token_data) {
          storageInfo += `token: ${keychainData.token_data.substring(
            0,
            20,
          )}...\n`;
        }
        if (keychainData.user_data) {
          try {
            const userData = JSON.parse(keychainData.user_data);
            storageInfo += `user: ${
              userData.name || userData.account || '未知'
            }\n`;
          } catch (e) {
            storageInfo += `user: ${keychainData.user_data.substring(
              0,
              30,
            )}...\n`;
          }
        }
      } else if (keychainData?.error) {
        storageInfo += `\nKeychain 錯誤: ${keychainData.error}\n`;
        if (keychainData.details) {
          storageInfo += `詳情: ${keychainData.details}\n`;
        }
      }

      Alert.alert('存儲狀態', storageInfo || '無存儲數據');
    } catch (error) {
      Alert.alert('錯誤', '讀取存儲狀態失敗');
    }
  };

  if (!visible) return null;

  const menuPosition = getMenuPosition();

  return (
    <>
      {/* 主按鈕 */}
      <View
        style={[
          styles.floatingButton,
          {
            left: position.x,
            top: position.y,
            transform: [{scale: isDragging ? 1.1 : 1}],
          },
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.mainButton}>
          <Text style={styles.buttonText}>🧪</Text>
        </View>
      </View>

      {/* 展開的測試選單 */}
      {isExpanded && (
        <View
          style={[
            styles.expandedMenu,
            {
              left: menuPosition.x,
              top: menuPosition.y,
            },
          ]}>
          <TouchableOpacity style={styles.menuItem} onPress={openWelcomeModal}>
            <Text style={styles.menuText}>🎭 打開歡迎Modal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={openStorageModal}>
            <Text style={styles.menuText}>✏️ 修改存儲數值</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={clearAllStorage}>
            <Text style={styles.menuText}>🗑️ 清除所有存儲</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={showStorageInfo}>
            <Text style={styles.menuText}>📊 顯示存儲狀態</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={checkKeychainStatus}>
            <Text style={styles.menuText}>🔐 檢查 Keychain 狀態</Text>
          </TouchableOpacity>

          {/* 音樂控制 */}
          <View style={styles.musicSection}>
            <Text style={styles.musicLabel}>🎵 音樂控制</Text>
            <View style={styles.musicButtons}>
              <TouchableOpacity
                style={[styles.musicButton, styles.playButton]}
                onPress={playMusic}
                disabled={isPlaying}>
                <Text style={styles.musicButtonText}>
                  {isPlaying ? '🔴 播放中' : '▶️ 播放'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.musicButton, styles.stopButton]}
                onPress={stopMusic}
                disabled={!isPlaying}>
                <Text style={styles.musicButtonText}>⏹️ 停止</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsExpanded(false)}>
            <Text style={styles.menuText}>❌ 關閉</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 修改AsyncStorage的Modal */}
      <Modal
        visible={showStorageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStorageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>修改AsyncStorage數值</Text>

            {/* 鍵名選擇 */}
            <View style={styles.keySelectorContainer}>
              <Text style={styles.label}>選擇現有鍵名：</Text>
              <ScrollView
                style={styles.keyList}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {existingKeys.map((key, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.keyChip}
                    onPress={() => selectExistingKey(key)}>
                    <Text style={styles.keyChipText}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={styles.input}
              placeholder="存儲鍵名 (例如: hasSeenWelcome)"
              value={storageKey}
              onChangeText={setStorageKey}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="存儲數值 (例如: false)"
              value={storageValue}
              onChangeText={setStorageValue}
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStorageModal(false)}>
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={modifyStorageValue}>
                <Text style={styles.modalButtonText}>確認</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    zIndex: 9999,
  },
  mainButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // 增加觸摸區域
    padding: 10,
    minWidth: BUTTON_SIZE + 20,
    minHeight: BUTTON_SIZE + 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  expandedMenu: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    padding: 8,
    minWidth: MENU_WIDTH,
    zIndex: 9998,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
  },
  musicSection: {
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  musicLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  musicButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  musicButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  musicButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  keySelectorContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  keyList: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  keyChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  keyChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FloatingTestButton;
