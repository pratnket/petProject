import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from '../PlatformIcon';

import {useModal} from '../../context/ModalContext';

// modals
import SelectPlanModal from '../../modals/SelectPlanModal';

const screenWidth = Dimensions.get('window').width;

const HotelDetail = ({route, navigation}) => {
  const {hotel, plans} = route.params;

  const {openModal, closeModal, activeModal} = useModal();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const getImageSource = img => {
    return typeof img === 'number' ? img : {uri: img};
  };

  const images = hotel.images ?? (hotel.image ? [hotel.image] : []);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  const handlePlanSelected = plan => {
    setSelectedPlan(plan);
    closeModal();
    navigation.navigate('BookingScreen', {
      hotel,
      plan,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <FlatList
          horizontal
          pagingEnabled
          data={images}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <Image source={getImageSource(item)} style={styles.image} />
          )}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* Indicator dots */}
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        {/* Top bar with back, heart, share */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', gap: 12}}>
            <TouchableOpacity>
              <Icon name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="share-social-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{hotel.name}</Text>

        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <Icon key={i} name="star" size={18} color="#facc15" />
          ))}
          <Text style={styles.ratingText}>5.0</Text>
        </View>

        <View style={styles.addressRow}>
          <Icon name="location" size={16} color="#6b7280" />
          <Text style={styles.addressText}>{hotel.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>商品內容</Text>
        {hotel.description.map((item, idx) => (
          <Text key={idx} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>設施</Text>
        <View style={styles.facilities}>
          <Facility icon="restaurant" label="餐廳" />
          <Facility icon="tv" label="Netflix" />
          <Facility icon="snow" label="冷氣" />
          <Facility icon="washer" label="洗衣機" />
          <Facility icon="sunny" label="陽台" />
          <Facility icon="wifi" label="免費網路" />
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {hotel.price} <Text style={styles.sub}>含稅</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => openModal('selectPlan')}>
          <Text style={styles.buttonText}>選擇方案</Text>
        </TouchableOpacity>

        {activeModal === 'selectPlan' && (
          <SelectPlanModal onSelect={handlePlanSelected} plans={plans} />
        )}
      </View>
    </ScrollView>
  );
};

const Facility = ({icon, label}) => (
  <View style={styles.facilityItem}>
    <Icon name={icon} size={18} />
    <Text style={styles.facilityText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  image: {width: screenWidth, height: 200},
  topBar: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -16,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3b82f6',
  },
  content: {padding: 16},
  title: {fontSize: 20, fontWeight: 'bold', color: '#1d4ed8'},
  ratingRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  ratingText: {marginLeft: 8, color: '#6b7280'},
  addressRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  addressText: {marginLeft: 4, color: '#4b5563'},
  sectionTitle: {marginTop: 16, fontSize: 16, fontWeight: '600'},
  bullet: {color: '#374151', marginTop: 4},
  ratingScore: {marginTop: 8, color: '#1e40af', fontWeight: 'bold'},
  reviewCard: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  reviewer: {fontWeight: '600', marginBottom: 4},
  facilities: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8},
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 8,
  },
  facilityText: {marginLeft: 4, fontSize: 13},
  priceRow: {marginTop: 24},
  priceText: {fontSize: 20, fontWeight: 'bold', color: '#1f2937'},
  sub: {fontSize: 14, color: '#6b7280'},
  button: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default HotelDetail;
