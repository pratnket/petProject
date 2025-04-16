import React, {useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {DUMMY_USERS} from '../constants/credentials';
import ModalWrapper from '../components/ModalWrapper';

const MemberScreen = () => {
  const {isSignedIn, signIn, signOut} = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSignIn = () => {
    const matchedUser = DUMMY_USERS.find(
      user => user.username === username && user.password === password,
    );

    if (matchedUser) {
      signIn();
      setModalMessage('登入成功');
      setIsModalOpen(true);
    } else {
      setModalMessage('帳號或密碼錯誤');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <>
          <Text>歡迎來到會員中心！</Text>
          <Button title="登出" onPress={signOut} />
        </>
      ) : (
        <>
          <Text>請先登入</Text>
          <TextInput
            style={styles.input}
            placeholder="帳號"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="密碼"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="登入" onPress={handleSignIn} />
        </>
      )}

      {/* 平台自動選擇正確 Modal */}
      <ModalWrapper
        visible={isModalOpen}
        message={modalMessage}
        onClose={closeModal}
        success={username === 'user' && password === 'password'} // 根據登入結果判斷顏色
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default MemberScreen;
