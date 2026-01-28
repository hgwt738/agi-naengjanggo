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
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
        <Text style={styles.title}>아기 냉장고</Text>
        <Text style={styles.subtitle}>
          우리 아기에게 맛있는 음식을 만들어주세요
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

      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Ingredients')}>
            <Text style={styles.menuIcon}>🥬</Text>
            <Text style={styles.menuTitle}>식재료 관리</Text>
            <Text style={styles.menuDescription}>
              냉장고 속 식재료를 등록하고 관리해요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardDisabled]}
            disabled>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuTitle}>설정</Text>
            <Text style={styles.menuDescription}>준비 중이에요</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
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
  header: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  babyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333',
    marginBottom: 4,
  },
  babyAgeGroup: {
    fontSize: 13,
    color: '#FF6B35',
  },
  editHint: {
    fontSize: 12,
    color: '#999',
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
    color: '#333',
    marginTop: 8,
  },
  babyCardEmptyHint: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
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
    color: '#333',
  },
  modalCancel: {
    fontSize: 16,
    color: '#888',
  },
  modalConfirm: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  menuContainer: {
    padding: 16,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuCardFull: {
    width: '100%',
  },
  menuCardDisabled: {
    opacity: 0.5,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#888',
  },
});
