import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {Ingredient, IngredientCategory} from '../types';
import type {RootStackParamList} from '../types/navigation';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  {id: '1', name: '당근', category: 'vegetable', addedAt: new Date()},
  {id: '2', name: '감자', category: 'vegetable', addedAt: new Date()},
  {id: '3', name: '소고기', category: 'meat', addedAt: new Date()},
  {id: '4', name: '쌀', category: 'grain', addedAt: new Date()},
];

type QuickIngredient = {
  name: string;
  category: IngredientCategory;
};

const QUICK_INGREDIENTS: Record<IngredientCategory, QuickIngredient[]> = {
  vegetable: [
    {name: '당근', category: 'vegetable'},
    {name: '감자', category: 'vegetable'},
    {name: '고구마', category: 'vegetable'},
    {name: '브로콜리', category: 'vegetable'},
    {name: '시금치', category: 'vegetable'},
    {name: '애호박', category: 'vegetable'},
    {name: '양배추', category: 'vegetable'},
    {name: '양파', category: 'vegetable'},
  ],
  fruit: [
    {name: '사과', category: 'fruit'},
    {name: '바나나', category: 'fruit'},
    {name: '배', category: 'fruit'},
    {name: '아보카도', category: 'fruit'},
  ],
  meat: [
    {name: '소고기', category: 'meat'},
    {name: '닭고기', category: 'meat'},
    {name: '돼지고기', category: 'meat'},
  ],
  fish: [
    {name: '흰살생선', category: 'fish'},
    {name: '연어', category: 'fish'},
    {name: '새우', category: 'fish'},
  ],
  dairy: [
    {name: '분유', category: 'dairy'},
    {name: '치즈', category: 'dairy'},
    {name: '요거트', category: 'dairy'},
  ],
  grain: [
    {name: '쌀', category: 'grain'},
    {name: '찹쌀', category: 'grain'},
    {name: '오트밀', category: 'grain'},
  ],
  other: [
    {name: '달걀', category: 'other'},
    {name: '두부', category: 'other'},
    {name: '참기름', category: 'other'},
  ],
};

const CATEGORY_TABS: {key: IngredientCategory; label: string}[] = [
  {key: 'vegetable', label: '채소'},
  {key: 'fruit', label: '과일'},
  {key: 'meat', label: '육류'},
  {key: 'fish', label: '생선'},
  {key: 'dairy', label: '유제품'},
  {key: 'grain', label: '곡류'},
  {key: 'other', label: '기타'},
];

export default function IngredientsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(SAMPLE_INGREDIENTS);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<IngredientCategory>('vegetable');

  const isIngredientAdded = (name: string) => {
    return ingredients.some(item => item.name === name);
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.trim(),
        category: 'other',
        addedAt: new Date(),
      };
      setIngredients([...ingredients, ingredient]);
      setNewIngredient('');
    }
  };

  const addQuickIngredient = (quick: QuickIngredient) => {
    if (isIngredientAdded(quick.name)) {
      return;
    }
    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: quick.name,
      category: quick.category,
      addedAt: new Date(),
    };
    setIngredients([...ingredients, ingredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const renderItem = ({item}: {item: Ingredient}) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientCategory}>
          {getCategoryLabel(item.category)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeIngredient(item.id)}>
        <Text style={styles.removeButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 자주 쓰는 재료 섹션 */}
      <View style={styles.quickSection}>
        <Text style={styles.quickSectionTitle}>자주 쓰는 재료</Text>

        {/* 카테고리 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}>
          {CATEGORY_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.categoryTab,
                selectedCategory === tab.key && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(tab.key)}>
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === tab.key && styles.categoryTabTextActive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 퀵 선택 버튼들 */}
        <View style={styles.quickButtons}>
          {QUICK_INGREDIENTS[selectedCategory].map(item => {
            const added = isIngredientAdded(item.name);
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.quickButton, added && styles.quickButtonAdded]}
                onPress={() => addQuickIngredient(item)}
                disabled={added}>
                <Text
                  style={[
                    styles.quickButtonText,
                    added && styles.quickButtonTextAdded,
                  ]}>
                  {item.name}
                </Text>
                {added && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 직접 입력 섹션 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newIngredient}
          onChangeText={setNewIngredient}
          placeholder="직접 입력하기"
          placeholderTextColor="#999"
          onSubmitEditing={addIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      {/* 내 식재료 목록 */}
      <Text style={styles.myIngredientsTitle}>
        내 식재료 ({ingredients.length})
      </Text>

      <FlatList
        data={ingredients}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 식재료가 없어요</Text>
            <Text style={styles.emptySubtext}>
              위에서 식재료를 추가해보세요!
            </Text>
          </View>
        }
      />

      {/* 레시피 생성 버튼 */}
      <View style={styles.generateButtonContainer}>
        <TouchableOpacity
          style={[
            styles.generateButton,
            ingredients.length === 0 && styles.generateButtonDisabled,
          ]}
          disabled={ingredients.length === 0}
          onPress={() => navigation.navigate('Recipes')}>
          <Text style={styles.generateButtonText}>
            🍳 레시피 생성 ({ingredients.length}개 재료)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getCategoryLabel(category: Ingredient['category']): string {
  const labels: Record<Ingredient['category'], string> = {
    vegetable: '채소',
    fruit: '과일',
    meat: '육류',
    fish: '생선',
    dairy: '유제품',
    grain: '곡류',
    other: '기타',
  };
  return labels[category];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  quickSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D8',
  },
  quickSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTabs: {
    marginBottom: 12,
  },
  categoryTabsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryTabActive: {
    backgroundColor: '#FF6B35',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFE4D6',
    gap: 4,
  },
  quickButtonAdded: {
    backgroundColor: '#E8E8E8',
  },
  quickButtonText: {
    fontSize: 14,
    color: '#FF6B35',
  },
  quickButtonTextAdded: {
    color: '#999',
  },
  checkMark: {
    fontSize: 12,
    color: '#999',
  },
  myIngredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  ingredientItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  ingredientCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#FF4444',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  generateButtonContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#FFF9F0',
  },
  generateButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
