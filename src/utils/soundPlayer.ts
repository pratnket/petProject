import Sound from 'react-native-sound';

export const playClickSound = () => {
  const sound = new Sound('click.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('音效載入錯誤', error);
      return;
    }
    sound.play(() => {
      sound.release(); // 播放完釋放
    });
  });
};