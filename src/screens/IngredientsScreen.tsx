import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import type {Ingredient} from '../types';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  {id: '1', name: '당근', category: 'vegetable', addedAt: new Date()},
  {id: '2', name: '감자', category: 'vegetable', addedAt: new Date()},
  {id: '3', name: '소고기', category: 'meat', addedAt: new Date()},
  {id: '4', name: '쌀', category: 'grain', addedAt: new Date()},
];

export default function IngredientsScreen() {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(SAMPLE_INGREDIENTS);
  const [newIngredient, setNewIngredient] = useState('');

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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newIngredient}
          onChangeText={setNewIngredient}
          placeholder="식재료 이름을 입력하세요"
          placeholderTextColor="#999"
          onSubmitEditing={addIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

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
});
