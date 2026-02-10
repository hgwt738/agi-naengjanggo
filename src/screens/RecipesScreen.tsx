import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {AgeGroup} from '../types';
import {getAllRecipes} from '../constants/recipeData';
import {matchRecipes, type MatchedRecipe} from '../utils/recipeMatching';
import {loadIngredients} from '../utils/ingredientStorage';

type RecipesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recipes'>;

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
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const ingredients = await loadIngredients();
        const userNames = ingredients.map(i => i.name);
        const allRecipes = getAllRecipes();
        const matched = matchRecipes(allRecipes, userNames);
        setMatchedRecipes(matched);
      })();
    }, []),
  );

  const filteredRecipes = matchedRecipes.filter(item => {
    const matchesStage = selectedStage === 'all' || item.recipe.ageGroup === selectedStage;
    const matchesSearch = item.recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getMatchColor = (percentage: number) => {
    if (percentage === 100) return '#22c55e';
    if (percentage >= 70) return '#FF6B35';
    return '#8d6a5e';
  };

  const getMatchText = (percentage: number) => {
    if (percentage === 100) return '100% 매칭: 바로 조리 가능!';
    if (percentage >= 70) return `${percentage}% 재료 매칭`;
    if (percentage > 0) return `${percentage}% 재료 매칭`;
    return '재료 없음';
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
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
      </View>

      {/* Recipe Cards */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {filteredRecipes.map(({recipe, matchPercentage, availableIngredients, missingIngredients}) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetail', {recipeId: recipe.id})}
            activeOpacity={0.9}>
            {/* Recipe Image */}
            <View style={styles.recipeImageContainer}>
              {recipe.image ? (
                <Image source={recipe.image} style={styles.recipeImage} />
              ) : (
                <View style={styles.recipeImagePlaceholder}>
                  <Text style={styles.recipeImageEmoji}>
                    {recipe.emoji}
                  </Text>
                </View>
              )}
            </View>

            {/* Recipe Info */}
            <View style={styles.recipeInfo}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
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
                {availableIngredients.map(ing => (
                  <View key={ing} style={styles.ingredientTagAvailable}>
                    <Text style={styles.ingredientTagAvailableText}>
                      ✅ {ing}
                    </Text>
                  </View>
                ))}
                {missingIngredients.map(ing => (
                  <View key={ing} style={styles.ingredientTagMissing}>
                    <Text style={styles.ingredientTagMissingText}>
                      ➕ {ing}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Match & Button */}
              <View style={styles.recipeFooter}>
                <Text style={[
                  styles.matchText,
                  {color: getMatchColor(matchPercentage)}
                ]}>
                  {getMatchText(matchPercentage)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.viewButton,
                    matchPercentage === 100 && styles.viewButtonHighlight,
                  ]}
                  onPress={() => navigation.navigate('RecipeDetail', {recipeId: recipe.id})}>
                  <Text style={styles.viewButtonText}>
                    레시피 보기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
    flexGrow: 0,
    marginTop: 4,
  },
  chipsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
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
    paddingBottom: 4,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8d6a5e',
  },
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
    gap: 12,
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
    aspectRatio: 2.2,
    backgroundColor: '#f5f1f0',
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E6',
  },
  recipeImageEmoji: {
    fontSize: 52,
  },
  recipeInfo: {
    padding: 12,
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
  bottomSpacer: {
    height: 80,
  },
});
