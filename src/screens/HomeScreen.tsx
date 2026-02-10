import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  calculateMonthsOld,
  getAgeGroup,
  getAgeGroupDescription,
  formatMonthsOld,
} from '../utils/baby';
import {getIngredientCount} from '../utils/ingredientStorage';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const BABY_BIRTHDATE_KEY = '@baby_birthdate';
const BABY_PHOTO_KEY = '@baby_photo';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [babyBirthDate, setBabyBirthDate] = useState<Date | null>(null);
  const [babyPhoto, setBabyPhoto] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [ingredientCount, setIngredientCount] = useState(0);

  useEffect(() => {
    loadBabyBirthDate();
    loadBabyPhoto();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const count = await getIngredientCount();
        setIngredientCount(count);
      })();
    }, []),
  );

  const loadBabyBirthDate = async () => {
    try {
      const stored = await AsyncStorage.getItem(BABY_BIRTHDATE_KEY);
      if (stored) {
        setBabyBirthDate(new Date(stored));
      }
    } catch (error) {
      console.error('Failed to load baby birthdate:', error);
    }
  };

  const loadBabyPhoto = async () => {
    try {
      const stored = await AsyncStorage.getItem(BABY_PHOTO_KEY);
      if (stored) {
        setBabyPhoto(stored);
      }
    } catch (error) {
      console.error('Failed to load baby photo:', error);
    }
  };

  const selectBabyPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      async response => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          try {
            await AsyncStorage.setItem(BABY_PHOTO_KEY, uri);
            setBabyPhoto(uri);
          } catch (error) {
            console.error('Failed to save baby photo:', error);
          }
        }
      },
    );
  };

  const saveBabyBirthDate = async (date: Date) => {
    try {
      await AsyncStorage.setItem(BABY_BIRTHDATE_KEY, date.toISOString());
      setBabyBirthDate(date);
    } catch (error) {
      console.error('Failed to save baby birthdate:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selectedDate) {
        saveBabyBirthDate(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = () => {
    saveBabyBirthDate(tempDate);
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    setTempDate(babyBirthDate || new Date());
    setShowDatePicker(true);
  };

  const monthsOld = babyBirthDate ? calculateMonthsOld(babyBirthDate) : null;
  const ageGroup = monthsOld !== null ? getAgeGroup(monthsOld) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top App Bar */}
        <View style={styles.appBar}>
          <View style={styles.appBarLeft}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appBarTitle}>아기 냉장고</Text>
          <View style={styles.appBarRight} />
        </View>

        {/* Welcome Headline */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            오늘은 우리 아기에게{'\n'}무엇을 해줄까요?
          </Text>
          <Text style={styles.welcomeSubtitle}>
            <Text style={styles.ingredientCount}>{ingredientCount}개의 신선한 식재료</Text>가 준비되어 있어요.
          </Text>
        </View>

        {/* 아기 정보 배너 */}
        <TouchableOpacity style={styles.babyBanner} onPress={openDatePicker}>
          <TouchableOpacity onPress={selectBabyPhoto} style={styles.babyPhotoButton}>
            {babyPhoto ? (
              <Image source={{uri: babyPhoto}} style={styles.babyPhoto} />
            ) : (
              <Text style={styles.babyBannerEmoji}>👶</Text>
            )}
          </TouchableOpacity>
          <View style={styles.babyBannerContent}>
            {babyBirthDate && monthsOld !== null && ageGroup ? (
              <>
                <Text style={styles.babyBannerTitle}>
                  우리 아기 {formatMonthsOld(monthsOld)}
                </Text>
                <Text style={styles.babyBannerSubtitle}>
                  {ageGroup} 이유식 · {getAgeGroupDescription(ageGroup)}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.babyBannerTitle}>
                  아기 생년월일을 등록해주세요
                </Text>
                <Text style={styles.babyBannerSubtitle}>
                  월령에 맞는 이유식을 추천해드려요
                </Text>
              </>
            )}
          </View>
          <Text style={styles.babyBannerArrow}>›</Text>
        </TouchableOpacity>

        {/* Main Navigation Grid */}
        <View style={styles.menuGrid}>
          {/* 식재료 관리 */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Ingredients')}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🧊</Text>
            </View>
            <Text style={styles.menuTitle}>우리 집 냉장고</Text>
            <Text style={styles.menuDescription}>지금 뭐가 있지?</Text>
          </TouchableOpacity>

          {/* 레시피 찾기 */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Recipes')}>
            <View style={[styles.menuIconContainer, styles.menuIconOrange]}>
              <Text style={styles.menuIcon}>📖</Text>
            </View>
            <Text style={styles.menuTitle}>오늘의 이유식</Text>
            <Text style={styles.menuDescription}>뭘 해줄까?</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 여백 (Bottom Navigation 공간) */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* iOS 날짜 선택 모달 */}
      {Platform.OS === 'ios' && (
        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* 안내 영역 */}
              <View style={styles.modalGuide}>
                <TouchableOpacity onPress={selectBabyPhoto} style={styles.modalPhotoButton}>
                  {babyPhoto ? (
                    <Image source={{uri: babyPhoto}} style={styles.modalPhoto} />
                  ) : (
                    <Text style={styles.modalEmoji}>👶</Text>
                  )}
                  <View style={styles.modalPhotoHint}>
                    <Text style={styles.modalPhotoHintText}>+</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.modalGuideTitle}>
                  우리 아기의 생일을{'\n'}알려주세요!
                </Text>
                <Text style={styles.modalGuideSubtitle}>
                  월령에 맞는 건강한 이유식을{'\n'}똑똑하게 추천해 드릴게요.
                </Text>
              </View>

              {/* 날짜 선택기 */}
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  locale="ko-KR"
                />
              </View>

              {/* 버튼 영역 */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmDate}>
                  <Text style={styles.modalConfirmButtonText}>등록하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSkipButton}
                  onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalSkipButtonText}>나중에 등록할게요</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android 날짜 선택 */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  scrollView: {
    flex: 1,
  },
  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  appBarLeft: {
    width: 48,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181210',
  },
  appBarRight: {
    width: 48,
  },
  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#181210',
    lineHeight: 36,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#8d6a5e',
    marginTop: 8,
    textAlign: 'center',
  },
  ingredientCount: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  // Baby Banner
  babyBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  babyPhotoButton: {
    marginRight: 12,
  },
  babyPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  babyBannerEmoji: {
    fontSize: 32,
  },
  babyBannerContent: {
    flex: 1,
  },
  babyBannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#181210',
    marginBottom: 2,
  },
  babyBannerSubtitle: {
    fontSize: 13,
    color: '#FF6B35',
  },
  babyBannerArrow: {
    fontSize: 24,
    color: '#8d6a5e',
    marginLeft: 8,
  },
  // Menu Grid
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  menuCard: {
    width: '50%',
    padding: 4,
    alignItems: 'center',
  },
  menuIconContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuIconOrange: {
    backgroundColor: '#FFF0E6',
  },
  menuIcon: {
    fontSize: 48,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181210',
    marginBottom: 4,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: '#8d6a5e',
    paddingHorizontal: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  // Bottom Spacer
  bottomSpacer: {
    height: 80,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF9F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalGuide: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  modalPhotoButton: {
    position: 'relative',
    marginBottom: 16,
  },
  modalPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  modalEmoji: {
    fontSize: 48,
  },
  modalPhotoHint: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPhotoHintText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalGuideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181210',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  modalGuideSubtitle: {
    fontSize: 14,
    color: '#8d6a5e',
    textAlign: 'center',
    lineHeight: 20,
  },
  datePickerContainer: {
    alignItems: 'center',
  },
  modalButtons: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  modalConfirmButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalConfirmButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalSkipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalSkipButtonText: {
    fontSize: 14,
    color: '#8d6a5e',
  },
});
