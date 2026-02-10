import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {Difficulty} from '../types';
import {getRecipeById} from '../constants/recipeData';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({route}: Props) {
  const {recipeId} = route.params;
  const recipe = getRecipeById(recipeId);

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
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          {recipe.image ? (
            <Image source={recipe.image} style={styles.recipeImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageEmoji}>
                {recipe.emoji}
              </Text>
            </View>
          )}
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
            {recipe.ingredientAmounts.map((ingredient, index) => (
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>단계별 조리법</Text>
          <View style={styles.stepsList}>
            {recipe.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  {recipe.stepTitles[index] && (
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

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
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
  // Image
  imageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recipeImage: {
    width: '100%',
    minHeight: 240,
    borderRadius: 16,
    resizeMode: 'cover',
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
    height: 40,
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
