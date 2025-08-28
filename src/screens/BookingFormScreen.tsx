import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Icon from '../components/PlatformIcon';
import {getImageSource} from '../utils/getImageSource';
import ImageAssets from '../constants/ImageAssets';

const BookingFormScreen = ({route, navigation}) => {
  const {hotel, plan, selectedSlot} = route.params;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  // 假資料
  const pets = [
    {
      id: 1,
      name: 'Lucas 1號',
      breed: '英國短毛貓',
      age: 3,
      city: '台中',
      avatar: 'https://www.placecats.com/neo/300/200',
    },
    // 可再加更多
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 方案資訊 */}
      <View style={styles.planCard}>
        <Image
          source={
            hotel.coverImage
              ? getImageSource(hotel.coverImage)
              : getImageSource(ImageAssets.error)
          }
          style={styles.image}
        />
        <View style={styles.planText}>
          <Text style={styles.planLabel}>{plan?.label || '預約方案'}</Text>
          <Text style={styles.time}>
            開始 {selectedSlot ? selectedSlot.selltime : '—'}
          </Text>
          <Text style={styles.time}>
            結束 {selectedSlot ? selectedSlot.endtime || '—' : '—'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        請協助填寫以下欄位，以方便店家提供服務。所有資訊將以嚴格機密保護
      </Text>

      <Text style={styles.label}>預定姓名</Text>
      <TextInput
        style={styles.input}
        placeholder="請輸入姓名"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>聯絡電話</Text>
      <TextInput
        style={styles.input}
        placeholder="請輸入電話"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>添加寵物</Text>
      <TouchableOpacity style={styles.addPetBtn}>
        <Icon name="add-circle-outline" size={24} color="#aaa" />
        <Text style={{marginLeft: 8, color: '#888'}}>
          添加寵物 / 成為寵物保姆 / 寵物服務提供者
        </Text>
      </TouchableOpacity>

      {pets.map(pet => (
        <TouchableOpacity
          key={pet.id}
          style={[
            styles.petCard,
            selectedPet === pet.id && styles.petCardSelected,
          ]}
          onPress={() => setSelectedPet(pet.id)}>
          {/* 左側 radio button */}
          <View style={{marginRight: 12}}>
            {selectedPet === pet.id ? (
              <Icon name="radio-button-on" size={24} color="#4f8cff" />
            ) : (
              <Icon name="radio-button-off" size={24} color="#bbb" />
            )}
          </View>
          <Image source={{uri: pet.avatar}} style={styles.petAvatar} />
          <View style={{flex: 1}}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petInfo}>
              {pet.breed} {pet.age}歲・{pet.city}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => {
          /* TODO: 下一步 */
        }}>
        <Text style={styles.nextBtnText}>下一步</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff', flexGrow: 1},
  planCard: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  image: {width: 64, height: 64, borderRadius: 8, marginRight: 12},
  planText: {flex: 1},
  planLabel: {fontSize: 16, fontWeight: 'bold', marginBottom: 4},
  time: {fontSize: 14, color: '#444'},
  sectionTitle: {marginVertical: 12, color: '#888', fontSize: 13},
  label: {fontWeight: 'bold', marginTop: 12, marginBottom: 4, fontSize: 15},
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  addPetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  petCardSelected: {borderColor: '#4f8cff', backgroundColor: '#eaf3ff'},
  petAvatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
  petName: {fontWeight: 'bold', fontSize: 16},
  petInfo: {color: '#888', fontSize: 13},
  nextBtn: {
    backgroundColor: '#a4c8ff',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  nextBtnText: {color: '#fff', fontWeight: 'bold', fontSize: 18},
});

export default BookingFormScreen;
