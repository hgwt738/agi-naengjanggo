import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>아기 냉장고</Text>
        <Text style={styles.subtitle}>
          우리 아기에게 맛있는 음식을 만들어주세요
        </Text>
      </View>

      <View style={styles.menuContainer}>
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
          style={styles.menuCard}
          onPress={() => navigation.navigate('Recipes')}>
          <Text style={styles.menuIcon}>🍳</Text>
          <Text style={styles.menuTitle}>레시피 찾기</Text>
          <Text style={styles.menuDescription}>
            식재료로 만들 수 있는 이유식을 찾아봐요
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, styles.menuCardDisabled]}
          disabled>
          <Text style={styles.menuIcon}>📅</Text>
          <Text style={styles.menuTitle}>식단 관리</Text>
          <Text style={styles.menuDescription}>준비 중이에요</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, styles.menuCardDisabled]}
          disabled>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuTitle}>설정</Text>
          <Text style={styles.menuDescription}>준비 중이에요</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    padding: 24,
    paddingTop: 40,
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
  menuContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
