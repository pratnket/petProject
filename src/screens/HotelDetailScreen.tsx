import React from 'react';
import PageWrapper from '../components/common/PageWrapper';
import HotelDetail from '../components/common/HotelDetail';

const HotelDetailScreen = props => {
  return 
  <PageWrapper>
    <HotelDetail {...props} />
  </PageWrapper>;
};

export default HotelDetailScreen;
