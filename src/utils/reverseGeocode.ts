export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh-TW`,
      {
        headers: {
          'User-Agent': 'ReactApp/1.0',
        },
      }
    );

    const data = await response.json();

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county;

    return city || null;
  } catch (error) {
    console.error('🔴 反查地址失敗:', error);
    return null;
  }
};