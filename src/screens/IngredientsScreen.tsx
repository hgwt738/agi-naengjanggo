import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {Ingredient, IngredientCategory} from '../types';
import {saveIngredients, loadIngredients} from '../utils/ingredientStorage';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  {id: '1', name: '브로콜리', category: 'vegetable', addedAt: new Date(), expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)},
  {id: '2', name: '고구마', category: 'vegetable', addedAt: new Date(), expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)},
  {id: '3', name: '닭가슴살', category: 'meat', addedAt: new Date(), expiresAt: new Date()},
  {id: '4', name: '두부', category: 'other', addedAt: new Date(), expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)},
  {id: '5', name: '퀴노아', category: 'grain', addedAt: new Date(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)},
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

type FilterTab = 'all' | IngredientCategory;

const FILTER_TABS: {key: FilterTab; label: string}[] = [
  {key: 'all', label: '전체'},
  {key: 'vegetable', label: '채소'},
  {key: 'meat', label: '단백질'},
  {key: 'grain', label: '곡류'},
  {key: 'fruit', label: '과일'},
];

const CATEGORY_EMOJI: Record<IngredientCategory, string> = {
  vegetable: '🥬',
  fruit: '🍎',
  meat: '🍖',
  fish: '🐟',
  dairy: '🥛',
  grain: '🌾',
  other: '🥄',
};

const ADD_CATEGORY_TABS: {key: IngredientCategory; label: string}[] = [
  {key: 'vegetable', label: '채소'},
  {key: 'fruit', label: '과일'},
  {key: 'meat', label: '육류'},
  {key: 'fish', label: '생선'},
  {key: 'dairy', label: '유제품'},
  {key: 'grain', label: '곡류'},
  {key: 'other', label: '기타'},
];

export default function IngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await loadIngredients();
      if (stored) {
        setIngredients(stored);
      } else {
        setIngredients(SAMPLE_INGREDIENTS);
        saveIngredients(SAMPLE_INGREDIENTS);
      }
    })();
  }, []);
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [addCategory, setAddCategory] = useState<IngredientCategory>('vegetable');

  const isIngredientAdded = (name: string) => {
    return ingredients.some(item => item.name === name);
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.trim(),
        category: addCategory,
        addedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      const updated = [...ingredients, ingredient];
      setIngredients(updated);
      saveIngredients(updated);
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    const updated = [...ingredients, ingredient];
    setIngredients(updated);
    saveIngredients(updated);
  };

  const removeIngredient = (id: string) => {
    const updated = ingredients.filter(item => item.id !== id);
    setIngredients(updated);
    saveIngredients(updated);
  };

  const getExpiryStatus = (expiresAt?: Date) => {
    if (!expiresAt) return {text: '유통기한 없음', color: '#8d6a5e', icon: '📅'};

    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {text: '오늘 만료', color: '#ef4444', icon: '⚠️'};
    } else if (diffDays <= 3) {
      return {text: `${diffDays}일 남음`, color: '#f97316', icon: '⏰'};
    } else if (diffDays > 30) {
      return {text: '30일+ 남음', color: '#22c55e', icon: '✓'};
    } else {
      return {text: `${diffDays}일 남음`, color: '#22c55e', icon: '✓'};
    }
  };

  // 필터링된 식재료
  const filteredIngredients = useMemo(() => {
    let filtered = ingredients;

    // 카테고리 필터
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'meat') {
        // 단백질 = meat + fish + other(두부 등)
        filtered = filtered.filter(item =>
          item.category === 'meat' || item.category === 'fish' || item.category === 'other'
        );
      } else {
        filtered = filtered.filter(item => item.category === selectedFilter);
      }
    }

    // 검색 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [ingredients, selectedFilter, searchQuery]);

  // 카테고리별로 그룹화
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {};

    filteredIngredients.forEach(item => {
      const category = getCategoryLabel(item.category);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return groups;
  }, [filteredIngredients]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="식재료 검색..."
            placeholderTextColor="#8d6a5e"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}>
          {FILTER_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedFilter === tab.key && styles.tabActive,
              ]}
              onPress={() => setSelectedFilter(tab.key)}>
              <Text
                style={[
                  styles.tabText,
                  selectedFilter === tab.key && styles.tabTextActive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedIngredients).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{items.length}개</Text>
              </View>
            </View>

            <View style={styles.ingredientList}>
              {items.map(item => {
                const expiry = getExpiryStatus(item.expiresAt);
                return (
                  <View key={item.id} style={styles.ingredientCard}>
                    <View style={styles.ingredientImage}>
                      <Text style={styles.ingredientEmoji}>
                        {CATEGORY_EMOJI[item.category]}
                      </Text>
                    </View>
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName}>{item.name}</Text>
                      <View style={styles.expiryRow}>
                        <Text style={styles.expiryIcon}>{expiry.icon}</Text>
                        <Text style={[styles.expiryText, {color: expiry.color}]}>
                          {expiry.text}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ingredientActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.editIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => removeIngredient(item.id)}>
                        <Text style={styles.deleteIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {filteredIngredients.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🧊</Text>
            <Text style={styles.emptyText}>등록된 식재료가 없어요</Text>
            <Text style={styles.emptySubtext}>
              + 버튼을 눌러 식재료를 추가해보세요
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add Ingredient Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancel}>취소</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>식재료 추가</Text>
              <TouchableOpacity onPress={() => {
                addIngredient();
                setShowAddModal(false);
              }}>
                <Text style={styles.modalConfirm}>완료</Text>
              </TouchableOpacity>
            </View>

            {/* 직접 입력 */}
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                value={newIngredient}
                onChangeText={setNewIngredient}
                placeholder="직접 입력하기"
                placeholderTextColor="#999"
              />
            </View>

            {/* 카테고리 탭 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.modalCategoryTabs}
              contentContainerStyle={styles.modalCategoryTabsContent}>
              {ADD_CATEGORY_TABS.map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.modalCategoryTab,
                    addCategory === tab.key && styles.modalCategoryTabActive,
                  ]}
                  onPress={() => setAddCategory(tab.key)}>
                  <Text
                    style={[
                      styles.modalCategoryTabText,
                      addCategory === tab.key && styles.modalCategoryTabTextActive,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 퀵 선택 버튼들 */}
            <ScrollView style={styles.quickScrollView}>
              <View style={styles.quickButtons}>
                {QUICK_INGREDIENTS[addCategory].map(item => {
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    backgroundColor: '#f8f6f5',
  },
  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 228, 214, 0.3)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#181210',
  },
  // Tabs
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 228, 214, 0.2)',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8d6a5e',
  },
  tabTextActive: {
    color: '#FF6B35',
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categorySection: {
    marginTop: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#181210',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  ingredientList: {
    gap: 12,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 228, 214, 0.4)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 228, 214, 0.2)',
  },
  ingredientImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientEmoji: {
    fontSize: 28,
  },
  ingredientInfo: {
    flex: 1,
    marginLeft: 16,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181210',
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  expiryIcon: {
    fontSize: 12,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ingredientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 14,
  },
  deleteIcon: {
    fontSize: 14,
    color: '#f87171',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181210',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8d6a5e',
  },
  bottomSpacer: {
    height: 80,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
    color: '#181210',
  },
  modalCancel: {
    fontSize: 16,
    color: '#8d6a5e',
  },
  modalConfirm: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  modalInputContainer: {
    padding: 16,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  modalCategoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCategoryTabsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  modalCategoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  modalCategoryTabActive: {
    backgroundColor: '#FF6B35',
  },
  modalCategoryTabText: {
    fontSize: 14,
    color: '#666',
  },
  modalCategoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickScrollView: {
    maxHeight: 300,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    fontWeight: '500',
  },
  quickButtonTextAdded: {
    color: '#999',
  },
  checkMark: {
    fontSize: 12,
    color: '#999',
  },
});
