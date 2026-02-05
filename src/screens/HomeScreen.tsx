import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateMonthsOld,
  getAgeGroup,
  getAgeGroupDescription,
  formatMonthsOld,
} from '../utils/baby';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const BABY_BIRTHDATE_KEY = '@baby_birthdate';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [babyBirthDate, setBabyBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [ingredientCount] = useState(12); // TODO: 실제 식재료 개수와 연동

  useEffect(() => {
    loadBabyBirthDate();
  }, []);

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
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>👶</Text>
            </View>
          </View>
          <Text style={styles.appBarTitle}>아기 냉장고</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationEmoji}>🔔</Text>
          </TouchableOpacity>
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

        {/* 아기 정보 카드 */}
        <TouchableOpacity style={styles.babyCard} onPress={openDatePicker}>
          {babyBirthDate && monthsOld !== null && ageGroup ? (
            <>
              <View style={styles.babyCardHeader}>
                <Text style={styles.babyEmoji}>👶</Text>
                <View style={styles.babyInfo}>
                  <Text style={styles.babyAge}>
                    우리 아기 {formatMonthsOld(monthsOld)}
                  </Text>
                  <Text style={styles.babyAgeGroup}>
                    {ageGroup} 이유식 · {getAgeGroupDescription(ageGroup)}
                  </Text>
                </View>
              </View>
              <Text style={styles.editHint}>탭하여 수정</Text>
            </>
          ) : (
            <View style={styles.babyCardEmpty}>
              <Text style={styles.babyEmoji}>👶</Text>
              <Text style={styles.babyCardEmptyText}>
                아기 생년월일을 등록해주세요
              </Text>
              <Text style={styles.babyCardEmptyHint}>
                월령에 맞는 이유식을 추천해드려요
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Quick Tip Panel */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipLabel}>오늘의 팁</Text>
          </View>
          <Text style={styles.tipTitle}>찌기는 영양소를 가장 잘 보존해요.</Text>
          <Text style={styles.tipDescription}>브로콜리와 고구마에 딱이에요.</Text>
          <TouchableOpacity style={styles.tipLink}>
            <Text style={styles.tipLinkText}>더 알아보기</Text>
            <Text style={styles.tipLinkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Main Navigation Grid */}
        <View style={styles.menuGrid}>
          {/* 식재료 관리 */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Ingredients')}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🧊</Text>
            </View>
            <Text style={styles.menuTitle}>식재료 관리</Text>
            <Text style={styles.menuDescription}>냉장고 속 재료 확인</Text>
          </TouchableOpacity>

          {/* 레시피 찾기 */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Recipes')}>
            <View style={[styles.menuIconContainer, styles.menuIconOrange]}>
              <Text style={styles.menuIcon}>📖</Text>
            </View>
            <Text style={styles.menuTitle}>레시피 찾기</Text>
            <Text style={styles.menuDescription}>재료로 만들기</Text>
          </TouchableOpacity>

          {/* 식단 관리 */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardDisabled]}
            disabled>
            <View style={[styles.menuIconContainer, styles.menuIconOrange]}>
              <Text style={styles.menuIcon}>📅</Text>
            </View>
            <Text style={styles.menuTitle}>식단 관리</Text>
            <Text style={styles.menuDescription}>주간 스케줄</Text>
          </TouchableOpacity>

          {/* 설정 */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardDisabled]}
            disabled>
            <View style={[styles.menuIconContainer, styles.menuIconOrange]}>
              <Text style={styles.menuIcon}>⚙️</Text>
            </View>
            <Text style={styles.menuTitle}>설정</Text>
            <Text style={styles.menuDescription}>앱 설정</Text>
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
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalCancel}>취소</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>생년월일 선택</Text>
                <TouchableOpacity onPress={handleConfirmDate}>
                  <Text style={styles.modalConfirm}>확인</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                locale="ko-KR"
              />
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

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={styles.navLabel}>즐겨찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navLabel}>장보기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>프로필</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181210',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationEmoji: {
    fontSize: 20,
  },
  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#181210',
    lineHeight: 36,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#8d6a5e',
    marginTop: 8,
  },
  ingredientCount: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  // Baby Card
  babyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  babyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babyEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  babyInfo: {
    flex: 1,
  },
  babyAge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181210',
    marginBottom: 4,
  },
  babyAgeGroup: {
    fontSize: 13,
    color: '#FF6B35',
  },
  editHint: {
    fontSize: 12,
    color: '#8d6a5e',
    textAlign: 'right',
    marginTop: 8,
  },
  babyCardEmpty: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  babyCardEmptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181210',
    marginTop: 8,
  },
  babyCardEmptyHint: {
    fontSize: 13,
    color: '#8d6a5e',
    marginTop: 4,
  },
  // Tip Card
  tipCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.1)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181210',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#8d6a5e',
  },
  tipLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  tipLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  tipLinkArrow: {
    fontSize: 14,
    color: '#FF6B35',
    marginLeft: 4,
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
  },
  menuCardDisabled: {
    opacity: 0.5,
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
  },
  menuDescription: {
    fontSize: 12,
    color: '#8d6a5e',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  // Bottom Spacer
  bottomSpacer: {
    height: 100,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#181210',
  },
  modalCancel: {
    fontSize: 16,
    color: '#8d6a5e',
  },
  modalConfirm: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#f5f1f0',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8d6a5e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6B35',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
