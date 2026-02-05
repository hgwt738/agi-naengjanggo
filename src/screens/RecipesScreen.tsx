import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {Recipe, AgeGroup} from '../types';

type RecipesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Recipes'
>;

interface ExtendedRecipe extends Recipe {
  imageUrl?: string;
  cookingMethod?: string;
  matchPercentage?: number;
  availableIngredients?: string[];
  missingIngredients?: string[];
  isBookmarked?: boolean;
}

const SAMPLE_RECIPES: ExtendedRecipe[] = [
  {
    id: '1',
    name: '고구마 사과 매쉬',
    description: '베타카로틴이 풍부한 달콤하고 부드러운 퓨레',
    ingredients: ['고구마', '사과', '모유/분유'],
    ageGroup: '초기',
    cookingTime: 15,
    difficulty: 'easy',
    cookingMethod: '찌기',
    matchPercentage: 90,
    availableIngredients: ['고구마', '사과'],
    missingIngredients: ['모유/분유'],
    isBookmarked: true,
  },
  {
    id: '2',
    name: '브로콜리 배 퓨레',
    description: '영양이 가득한 초록 채소 퓨레',
    ingredients: ['브로콜리', '배'],
    ageGroup: '초기',
    cookingTime: 10,
    difficulty: 'easy',
    cookingMethod: '삶기',
    matchPercentage: 100,
    availableIngredients: ['브로콜리', '배'],
    missingIngredients: [],
    isBookmarked: false,
  },
  {
    id: '3',
    name: '아보카도 바나나 매쉬',
    description: '건강한 지방이 풍부한 무조리 레시피',
    ingredients: ['아보카도', '바나나'],
    ageGroup: '초기',
    cookingTime: 5,
    difficulty: 'easy',
    cookingMethod: '무조리',
    matchPercentage: 50,
    availableIngredients: ['바나나'],
    missingIngredients: ['아보카도'],
    isBookmarked: false,
  },
  {
    id: '4',
    name: '소고기 야채죽',
    description: '단백질과 야채가 듬뿍 들어간 영양죽',
    ingredients: ['소고기', '당근', '감자', '쌀'],
    ageGroup: '중기',
    cookingTime: 40,
    difficulty: 'medium',
    cookingMethod: '끓이기',
    matchPercentage: 75,
    availableIngredients: ['당근', '감자', '쌀'],
    missingIngredients: ['소고기'],
    isBookmarked: false,
  },
];

const AGE_STAGES: {key: AgeGroup | 'all'; label: string; subLabel?: string}[] = [
  {key: 'all', label: '전체'},
  {key: '초기', label: '초기', subLabel: '6개월+'},
  {key: '중기', label: '중기', subLabel: '8개월+'},
  {key: '후기', label: '후기', subLabel: '10개월+'},
  {key: '완료기', label: '완료기', subLabel: '12개월+'},
];

export default function RecipesScreen() {
  const navigation = useNavigation<RecipesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<AgeGroup | 'all'>('all');
  const [recipes] = useState<ExtendedRecipe[]>(SAMPLE_RECIPES);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesStage = selectedStage === 'all' || recipe.ageGroup === selectedStage;
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getMatchColor = (percentage?: number) => {
    if (!percentage) return '#8d6a5e';
    if (percentage === 100) return '#22c55e';
    if (percentage >= 70) return '#FF6B35';
    return '#8d6a5e';
  };

  const getMatchText = (percentage?: number) => {
    if (!percentage) return '';
    if (percentage === 100) return '100% 매칭: 바로 조리 가능!';
    if (percentage >= 70) return `${percentage}% 재료 매칭`;
    return '일부 재료 매칭';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🧊</Text>
        </View>
        <Text style={styles.headerTitle}>아기 냉장고</Text>
        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="레시피 검색..."
            placeholderTextColor="#8d6a5e"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Age Stage Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
        contentContainerStyle={styles.chipsContent}>
        {AGE_STAGES.map(stage => (
          <TouchableOpacity
            key={stage.key}
            style={[
              styles.chip,
              selectedStage === stage.key && styles.chipActive,
            ]}
            onPress={() => setSelectedStage(stage.key)}>
            <Text
              style={[
                styles.chipText,
                selectedStage === stage.key && styles.chipTextActive,
              ]}>
              {stage.label}
              {stage.subLabel && ` (${stage.subLabel})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Meta Text */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>
          {filteredRecipes.length}개의 레시피가 재료와 매칭됨
        </Text>
        <TouchableOpacity>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Cards */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {filteredRecipes.map(recipe => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetail', {recipeId: recipe.id})}
            activeOpacity={0.9}>
            {/* Recipe Image */}
            <View style={styles.recipeImageContainer}>
              <View style={styles.recipeImagePlaceholder}>
                <Text style={styles.recipeImageEmoji}>
                  {recipe.ageGroup === '초기' ? '🍠' : '🍲'}
                </Text>
              </View>
            </View>

            {/* Recipe Info */}
            <View style={styles.recipeInfo}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <TouchableOpacity>
                  <Text style={[
                    styles.bookmarkIcon,
                    recipe.isBookmarked && styles.bookmarkIconActive
                  ]}>
                    {recipe.isBookmarked ? '🔖' : '🏷️'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Cooking Info */}
              <View style={styles.cookingInfo}>
                <Text style={styles.cookingInfoText}>
                  ⏱️ {recipe.cookingTime}분
                </Text>
                <Text style={styles.cookingInfoText}>
                  🍳 {recipe.cookingMethod}
                </Text>
              </View>

              {/* Ingredient Tags */}
              <View style={styles.ingredientTags}>
                {recipe.availableIngredients?.map(ing => (
                  <View key={ing} style={styles.ingredientTagAvailable}>
                    <Text style={styles.ingredientTagAvailableText}>
                      ✅ {ing.toUpperCase()}
                    </Text>
                  </View>
                ))}
                {recipe.missingIngredients?.map(ing => (
                  <View key={ing} style={styles.ingredientTagMissing}>
                    <Text style={styles.ingredientTagMissingText}>
                      ➕ {ing.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Match & Button */}
              <View style={styles.recipeFooter}>
                <Text style={[
                  styles.matchText,
                  {color: getMatchColor(recipe.matchPercentage)}
                ]}>
                  {getMatchText(recipe.matchPercentage)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.viewButton,
                    recipe.matchPercentage === 100 && styles.viewButtonHighlight,
                  ]}
                  onPress={() => navigation.navigate('RecipeDetail', {recipeId: recipe.id})}>
                  <Text style={[
                    styles.viewButtonText,
                    recipe.matchPercentage !== 100 && styles.viewButtonTextMuted,
                  ]}>
                    레시피 보기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>🛒</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>📖</Text>
          <Text style={styles.navLabelActive}>레시피</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Ingredients')}>
          <Text style={styles.navIcon}>🧊</Text>
          <Text style={styles.navLabel}>냉장고</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>기록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>설정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
    borderBottomWidth: 1,
    borderBottomColor: '#f5f1f0',
  },
  headerLeft: {
    width: 48,
  },
  headerIcon: {
    fontSize: 28,
    color: '#FF6B35',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181210',
  },
  headerRight: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f1f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#181210',
  },
  // Chips
  chipsContainer: {
    marginTop: 8,
  },
  chipsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  chip: {
    height: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#f5f1f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chipActive: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181210',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Meta
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8d6a5e',
  },
  filterIcon: {
    fontSize: 18,
  },
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  // Recipe Card
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f5f1f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f5f1f0',
  },
  recipeImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E6',
  },
  recipeImageEmoji: {
    fontSize: 64,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181210',
    flex: 1,
    marginRight: 8,
  },
  bookmarkIcon: {
    fontSize: 20,
    opacity: 0.3,
  },
  bookmarkIconActive: {
    opacity: 1,
    color: '#FF6B35',
  },
  cookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  cookingInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8d6a5e',
  },
  ingredientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  ingredientTagAvailable: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ingredientTagAvailableText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22c55e',
  },
  ingredientTagMissing: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ingredientTagMissingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f97316',
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
  },
  viewButton: {
    minWidth: 100,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonHighlight: {
    backgroundColor: '#FF6B35',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewButtonTextMuted: {
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 160,
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
    fontSize: 24,
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
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6B35',
  },
});
