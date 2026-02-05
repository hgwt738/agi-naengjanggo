import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {Recipe} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

interface ExtendedRecipe extends Recipe {
  stepTitles?: string[];
  ingredientAmounts?: string[];
}

const RECIPES: Record<string, ExtendedRecipe> = {
  '1': {
    id: '1',
    name: '고구마 당근 매쉬',
    description: '베타카로틴이 풍부한 달콤하고 부드러운 퓨레',
    ingredients: ['고구마 1개 (큰것)', '당근 2개 (중간 크기)', '모유 또는 분유 1/2컵'],
    ingredientAmounts: ['고구마 1개 (큰것)', '당근 2개 (중간 크기)', '모유 또는 분유 1/2컵'],
    ageGroup: '초기',
    cookingTime: 15,
    difficulty: 'easy',
    stepTitles: ['재료 준비하기', '부드럽게 찌기', '곱게 갈기'],
    steps: [
      '고구마와 당근의 껍질을 벗기고 작고 균일한 크기의 큐브 모양으로 잘라주세요.',
      '끓는 물 위에 찜기를 올리고 재료를 넣어주세요. 뚜껑을 덮고 10-12분간 포크로 찔렀을 때 부드러워질 때까지 쪄주세요.',
      '블렌더에 옮겨 담고, 원하는 농도가 될 때까지 모유나 분유를 조금씩 넣으며 갈아주세요.',
    ],
  },
  '2': {
    id: '2',
    name: '브로콜리 배 퓨레',
    description: '영양이 가득한 초록 채소 퓨레',
    ingredients: ['브로콜리 1컵', '배 1/2개'],
    ingredientAmounts: ['브로콜리 1컵', '배 1/2개'],
    ageGroup: '초기',
    cookingTime: 10,
    difficulty: 'easy',
    stepTitles: ['재료 준비하기', '삶기', '갈기'],
    steps: [
      '브로콜리를 작은 송이로 나누고, 배는 껍질을 벗겨 잘게 썰어주세요.',
      '끓는 물에 브로콜리와 배를 8-10분간 부드러워질 때까지 삶아주세요.',
      '물기를 빼고 블렌더에 넣어 부드럽게 갈아주세요.',
    ],
  },
  '3': {
    id: '3',
    name: '아보카도 바나나 매쉬',
    description: '건강한 지방이 풍부한 무조리 레시피',
    ingredients: ['아보카도 1/2개', '바나나 1개'],
    ingredientAmounts: ['잘 익은 아보카도 1/2개', '잘 익은 바나나 1개'],
    ageGroup: '초기',
    cookingTime: 5,
    difficulty: 'easy',
    stepTitles: ['재료 준비하기', '으깨기'],
    steps: [
      '아보카도와 바나나의 껍질을 벗겨주세요.',
      '포크로 함께 으깨어 부드러운 매쉬를 만들어주세요.',
    ],
  },
  '4': {
    id: '4',
    name: '소고기 야채죽',
    description: '단백질과 야채가 듬뿍 들어간 영양죽',
    ingredients: ['소고기 50g', '당근 1/4개', '감자 1/4개', '쌀 1/4컵'],
    ingredientAmounts: ['다진 소고기 50g', '당근 1/4개', '감자 1/4개', '불린 쌀 1/4컵'],
    ageGroup: '중기',
    cookingTime: 40,
    difficulty: 'medium',
    stepTitles: ['재료 준비하기', '소고기 볶기', '죽 끓이기', '마무리'],
    steps: [
      '쌀을 30분간 물에 불리고, 소고기는 핏물을 빼고 잘게 다져주세요. 당근과 감자도 잘게 다져주세요.',
      '냄비에 참기름을 두르고 소고기를 볶아주세요.',
      '불린 쌀과 물 2컵을 넣고 끓기 시작하면 약한 불로 줄여주세요.',
      '야채를 넣고 30분간 저어가며 끓여주세요.',
    ],
  },
};

export default function RecipeDetailScreen({route, navigation}: Props) {
  const {recipeId} = route.params;
  const recipe = RECIPES[recipeId];
  const [isFavorite, setIsFavorite] = useState(false);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>🍽️</Text>
          <Text style={styles.errorText}>레시피를 찾을 수 없어요</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getAgeRange = (ageGroup: string) => {
    switch (ageGroup) {
      case '초기': return '6-9개월';
      case '중기': return '9-12개월';
      case '후기': return '12-15개월';
      case '완료기': return '15-24개월';
      default: return '6개월+';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>레시피 상세</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageEmoji}>
              {recipe.ageGroup === '초기' ? '🍠' : '🍲'}
            </Text>
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineContainer}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoValue}>{recipe.cookingTime}분</Text>
            <Text style={styles.infoLabel}>조리시간</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📊</Text>
            <Text style={styles.infoValue}>
              {getDifficultyLabel(recipe.difficulty)}
            </Text>
            <Text style={styles.infoLabel}>난이도</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>👶</Text>
            <Text style={styles.infoValue}>{getAgeRange(recipe.ageGroup)}</Text>
            <Text style={styles.infoLabel}>적정 월령</Text>
          </View>
        </View>

        {/* Required Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>필요한 재료</Text>
          <View style={styles.ingredientsList}>
            {(recipe.ingredientAmounts || recipe.ingredients).map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkEmoji}>✓</Text>
                </View>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step-by-Step Guide */}
        {recipe.steps && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>단계별 조리법</Text>
            <View style={styles.stepsList}>
              {recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    {recipe.stepTitles && recipe.stepTitles[index] && (
                      <Text style={styles.stepTitle}>
                        {recipe.stepTitles[index]}
                      </Text>
                    )}
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonIcon}>▶️</Text>
          <Text style={styles.startButtonText}>조리 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#181210',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181210',
  },
  favoriteButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  // Image
  imageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imagePlaceholder: {
    width: '100%',
    minHeight: 240,
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageEmoji: {
    fontSize: 80,
  },
  // Headline
  headlineContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  recipeName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#181210',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#8d6a5e',
    lineHeight: 20,
  },
  // Info Cards
  infoCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e7deda',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#181210',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8d6a5e',
  },
  // Section
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#181210',
    marginBottom: 16,
  },
  // Ingredients
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f6f5',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkEmoji: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '700',
  },
  ingredientText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#181210',
  },
  // Steps
  stepsList: {
    gap: 24,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181210',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#8d6a5e',
    lineHeight: 22,
  },
  // Bottom
  bottomSpacer: {
    height: 120,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 24,
    paddingVertical: 18,
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonIcon: {
    fontSize: 18,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#8d6a5e',
  },
});
