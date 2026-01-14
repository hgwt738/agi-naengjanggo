import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {Recipe} from '../types';

type RecipesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Recipes'
>;

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: '당근 미음',
    description: '부드러운 당근 미음으로 이유식을 시작해보세요',
    ingredients: ['당근', '쌀'],
    ageGroup: '초기',
    cookingTime: 30,
    difficulty: 'easy',
  },
  {
    id: '2',
    name: '감자 으깸',
    description: '포슬포슬한 감자로 만드는 영양 가득 으깸',
    ingredients: ['감자'],
    ageGroup: '초기',
    cookingTime: 20,
    difficulty: 'easy',
  },
  {
    id: '3',
    name: '소고기 야채죽',
    description: '단백질과 야채가 듬뿍 들어간 영양죽',
    ingredients: ['소고기', '당근', '감자', '쌀'],
    ageGroup: '중기',
    cookingTime: 40,
    difficulty: 'medium',
  },
];

export default function RecipesScreen() {
  const navigation = useNavigation<RecipesScreenNavigationProp>();

  const renderItem = ({item}: {item: Recipe}) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', {recipeId: item.id})}>
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <View style={styles.ageTag}>
          <Text style={styles.ageTagText}>{item.ageGroup}</Text>
        </View>
      </View>
      <Text style={styles.recipeDescription}>{item.description}</Text>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeInfoText}>⏱️ {item.cookingTime}분</Text>
        <Text style={styles.recipeInfoText}>
          📝 {item.ingredients.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_RECIPES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>추천 레시피</Text>
            <Text style={styles.headerSubtitle}>
              냉장고 식재료로 만들 수 있는 이유식이에요
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  ageTag: {
    backgroundColor: '#FFE4D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageTagText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeInfo: {
    gap: 4,
  },
  recipeInfoText: {
    fontSize: 12,
    color: '#888',
  },
});
