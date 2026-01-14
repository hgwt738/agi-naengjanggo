import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {Recipe} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

const RECIPES: Record<string, Recipe> = {
  '1': {
    id: '1',
    name: '당근 미음',
    description: '부드러운 당근 미음으로 이유식을 시작해보세요',
    ingredients: ['당근', '쌀'],
    ageGroup: '초기',
    cookingTime: 30,
    difficulty: 'easy',
    steps: [
      '쌀을 30분 정도 물에 불려주세요.',
      '당근은 깨끗이 씻어 껍질을 벗기고 잘게 다져주세요.',
      '냄비에 불린 쌀과 물 5컵을 넣고 센 불에서 끓여주세요.',
      '끓기 시작하면 약한 불로 줄이고 다진 당근을 넣어주세요.',
      '20분 정도 저어가며 끓여주세요.',
      '부드럽게 익으면 핸드블렌더로 곱게 갈아주세요.',
      '체에 한 번 걸러 더 부드럽게 만들어주세요.',
    ],
  },
  '2': {
    id: '2',
    name: '감자 으깸',
    description: '포슬포슬한 감자로 만드는 영양 가득 으깸',
    ingredients: ['감자'],
    ageGroup: '초기',
    cookingTime: 20,
    difficulty: 'easy',
    steps: [
      '감자를 깨끗이 씻어 껍질을 벗겨주세요.',
      '적당한 크기로 잘라주세요.',
      '냄비에 감자와 물을 넣고 푹 삶아주세요.',
      '부드럽게 익으면 물을 따라내고 으깨주세요.',
      '아기가 먹기 좋은 농도로 모유나 분유를 넣어 섞어주세요.',
    ],
  },
  '3': {
    id: '3',
    name: '소고기 야채죽',
    description: '단백질과 야채가 듬뿍 들어간 영양죽',
    ingredients: ['소고기', '당근', '감자', '쌀'],
    ageGroup: '중기',
    cookingTime: 40,
    difficulty: 'medium',
    steps: [
      '쌀을 30분 정도 물에 불려주세요.',
      '소고기는 핏물을 빼고 잘게 다져주세요.',
      '당근과 감자는 깨끗이 씻어 잘게 다져주세요.',
      '냄비에 참기름을 두르고 소고기를 볶아주세요.',
      '불린 쌀과 물 5컵을 넣고 끓여주세요.',
      '끓기 시작하면 약한 불로 줄이고 야채를 넣어주세요.',
      '30분 정도 저어가며 끓여주세요.',
      '농도를 확인하고 필요하면 물을 더 넣어주세요.',
    ],
  },
};

export default function RecipeDetailScreen({route}: Props) {
  const {recipeId} = route.params;
  const recipe = RECIPES[recipeId];

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>레시피를 찾을 수 없어요</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ageTag}>
          <Text style={styles.ageTagText}>{recipe.ageGroup} 이유식</Text>
        </View>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>조리시간</Text>
            <Text style={styles.infoValue}>{recipe.cookingTime}분</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>난이도</Text>
            <Text style={styles.infoValue}>
              {getDifficultyLabel(recipe.difficulty)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>필요한 재료</Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>

      {recipe.steps && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>만드는 방법</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function getDifficultyLabel(difficulty: Recipe['difficulty']): string {
  const labels: Record<Recipe['difficulty'], string> = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };
  return labels[difficulty];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ageTag: {
    backgroundColor: '#FFE4D6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  ageTagText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
  },
  infoItem: {},
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});
