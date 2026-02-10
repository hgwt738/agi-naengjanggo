import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {Ingredient, IngredientCategory} from '../types';
import {saveIngredients, loadIngredients} from '../utils/ingredientStorage';
import {getIngredientDetail} from '../constants/ingredientDetails';

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
    {name: '단호박', category: 'vegetable'},
    {name: '비트', category: 'vegetable'},
    {name: '무', category: 'vegetable'},
    {name: '토마토', category: 'vegetable'},
    {name: '완두콩', category: 'vegetable'},
    {name: '청경채', category: 'vegetable'},
    {name: '파프리카', category: 'vegetable'},
    {name: '옥수수', category: 'vegetable'},
    {name: '콜리플라워', category: 'vegetable'},
    {name: '오이', category: 'vegetable'},
  ],
  fruit: [
    {name: '사과', category: 'fruit'},
    {name: '바나나', category: 'fruit'},
    {name: '배', category: 'fruit'},
    {name: '아보카도', category: 'fruit'},
    {name: '딸기', category: 'fruit'},
    {name: '블루베리', category: 'fruit'},
    {name: '수박', category: 'fruit'},
    {name: '키위', category: 'fruit'},
    {name: '망고', category: 'fruit'},
    {name: '복숭아', category: 'fruit'},
    {name: '포도', category: 'fruit'},
    {name: '자두', category: 'fruit'},
  ],
  meat: [
    {name: '소고기', category: 'meat'},
    {name: '닭고기', category: 'meat'},
    {name: '돼지고기', category: 'meat'},
    {name: '닭가슴살', category: 'meat'},
    {name: '다진고기', category: 'meat'},
  ],
  fish: [
    {name: '흰살생선', category: 'fish'},
    {name: '연어', category: 'fish'},
    {name: '새우', category: 'fish'},
    {name: '대구', category: 'fish'},
    {name: '도미', category: 'fish'},
    {name: '가자미', category: 'fish'},
    {name: '멸치', category: 'fish'},
  ],
  dairy: [
    {name: '분유', category: 'dairy'},
    {name: '치즈', category: 'dairy'},
    {name: '요거트', category: 'dairy'},
    {name: '우유', category: 'dairy'},
    {name: '버터', category: 'dairy'},
  ],
  grain: [
    {name: '쌀', category: 'grain'},
    {name: '찹쌀', category: 'grain'},
    {name: '오트밀', category: 'grain'},
    {name: '현미', category: 'grain'},
    {name: '보리', category: 'grain'},
  ],
  other: [
    {name: '달걀', category: 'other'},
    {name: '두부', category: 'other'},
    {name: '참기름', category: 'other'},
    {name: '김', category: 'other'},
    {name: '미역', category: 'other'},
    {name: '버섯', category: 'other'},
    {name: '들기름', category: 'other'},
    {name: '참깨', category: 'other'},
    {name: '올리브오일', category: 'other'},
  ],
};

type FilterTab = 'all' | IngredientCategory;

const FILTER_TABS: {key: FilterTab; label: string}[] = [
  {key: 'all', label: '전체'},
  {key: 'vegetable', label: '채소'},
  {key: 'fruit', label: '과일'},
  {key: 'meat', label: '육류'},
  {key: 'fish', label: '생선'},
  {key: 'dairy', label: '유제품'},
  {key: 'grain', label: '곡류'},
  {key: 'other', label: '기타'},
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

const INGREDIENT_EMOJI: Record<string, string> = {
  // 채소
  당근: '🥕', 감자: '🥔', 고구마: '🍠', 브로콜리: '🥦',
  시금치: '🥬', 애호박: '🥒', 양배추: '🥗', 양파: '🧅',
  단호박: '🎃', 비트: '🫒', 무: '🥔', 토마토: '🍅',
  완두콩: '🫛', 청경채: '🥬', 파프리카: '🫑', 옥수수: '🌽',
  콜리플라워: '🥦', 오이: '🥒',
  // 과일
  사과: '🍎', 바나나: '🍌', 배: '🍐', 아보카도: '🥑',
  딸기: '🍓', 블루베리: '🫐', 수박: '🍉', 키위: '🥝',
  망고: '🥭', 복숭아: '🍑', 포도: '🍇', 자두: '🍑',
  // 육류
  소고기: '🥩', 닭고기: '🍗', 돼지고기: '🥓',
  닭가슴살: '🍗', 다진고기: '🥩',
  // 생선
  흰살생선: '🐟', 연어: '🍣', 새우: '🦐',
  대구: '🐟', 도미: '🐟', 가자미: '🐟', 멸치: '🐟',
  // 유제품
  분유: '🍼', 치즈: '🧀', 요거트: '🥛', 우유: '🥛', 버터: '🧈',
  // 곡류
  쌀: '🍚', 찹쌀: '🍚', 오트밀: '🌾', 현미: '🍚', 보리: '🌾',
  // 기타
  달걀: '🥚', 두부: '🧈', 참기름: '🫗', 김: '🍃',
  미역: '🍃', 버섯: '🍄', 들기름: '🫗', 참깨: '🥜', 올리브오일: '🫒',
};

const DEFAULT_EXPIRY_DAYS: Record<IngredientCategory, number> = {
  vegetable: 7, fruit: 7, meat: 3, fish: 2,
  dairy: 10, grain: 60, other: 14,
};

const INGREDIENT_EXPIRY_DAYS: Record<string, number> = {
  // 채소 - 잎채소 (짧음)
  시금치: 4, 청경채: 4, 양배추: 10,
  // 채소 - 뿌리/열매 (길음)
  감자: 21, 고구마: 21, 당근: 14, 무: 14,
  단호박: 14, 양파: 21, 옥수수: 5,
  비트: 14, 파프리카: 7, 오이: 5,
  // 과일 - 베리류 (짧음)
  딸기: 4, 블루베리: 5, 포도: 5,
  // 과일 - 일반
  바나나: 5, 복숭아: 5, 자두: 5, 수박: 5,
  사과: 21, 배: 14, 키위: 14, 망고: 5,
  아보카도: 5,
  // 육류
  소고기: 3, 닭고기: 2, 돼지고기: 3,
  닭가슴살: 2, 다진고기: 2,
  // 생선
  흰살생선: 2, 연어: 2, 새우: 2,
  대구: 2, 도미: 2, 가자미: 2, 멸치: 30,
  // 유제품
  분유: 30, 치즈: 21, 요거트: 10, 우유: 7, 버터: 30,
  // 곡류
  쌀: 90, 찹쌀: 90, 오트밀: 90, 현미: 60, 보리: 90,
  // 기타
  달걀: 21, 두부: 5, 참기름: 90, 김: 60,
  미역: 60, 버섯: 5, 들기름: 90, 참깨: 90, 올리브오일: 90,
};

function getExpiryDays(name: string, category: IngredientCategory): number {
  return INGREDIENT_EXPIRY_DAYS[name] ?? DEFAULT_EXPIRY_DAYS[category];
}

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
      setIngredients(stored);
    })();
  }, []);
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategory, setAddCategory] = useState<IngredientCategory>('vegetable');
  const [detailIngredient, setDetailIngredient] = useState<Ingredient | null>(null);
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);
  const [tempExpiryDate, setTempExpiryDate] = useState(new Date());
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  const openEditDatePicker = (ingredient: Ingredient) => {
    setEditingIngredientId(ingredient.id);
    setTempExpiryDate(ingredient.expiresAt ? new Date(ingredient.expiresAt) : new Date());
    setShowEditDatePicker(true);
  };

  const handleExpiryDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEditDatePicker(false);
      if (event.type === 'set' && selectedDate && editingIngredientId) {
        const updated = ingredients.map(item =>
          item.id === editingIngredientId
            ? {...item, expiresAt: selectedDate}
            : item,
        );
        setIngredients(updated);
        saveIngredients(updated);
      }
      setEditingIngredientId(null);
    } else {
      if (selectedDate) {
        setTempExpiryDate(selectedDate);
      }
    }
  };

  const confirmExpiryDate = () => {
    if (editingIngredientId) {
      const updated = ingredients.map(item =>
        item.id === editingIngredientId
          ? {...item, expiresAt: tempExpiryDate}
          : item,
      );
      setIngredients(updated);
      saveIngredients(updated);
    }
    setShowEditDatePicker(false);
    setEditingIngredientId(null);
  };

  const isIngredientAdded = (name: string) => {
    return ingredients.some(item => item.name === name);
  };

  const addQuickIngredient = (quick: QuickIngredient) => {
    if (isIngredientAdded(quick.name)) {
      return;
    }
    const days = getExpiryDays(quick.name, quick.category);
    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: quick.name,
      category: quick.category,
      addedAt: new Date(),
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
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
      filtered = filtered.filter(item => item.category === selectedFilter);
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
        <View style={styles.tabsContent}>
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
        </View>
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
                  <TouchableOpacity key={item.id} style={styles.ingredientCard} onPress={() => setDetailIngredient(item)} activeOpacity={0.7}>
                    <View style={styles.ingredientImage}>
                      <Text style={styles.ingredientEmoji}>
                        {INGREDIENT_EMOJI[item.name] || CATEGORY_EMOJI[item.category]}
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
                      <TouchableOpacity style={styles.actionButton} onPress={() => openEditDatePicker(item)}>
                        <Text style={styles.editIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => removeIngredient(item.id)}>
                        <Text style={styles.deleteIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
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

      {/* 식재료 상세 모달 */}
      <Modal
        visible={detailIngredient !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailIngredient(null)}>
        <TouchableOpacity
          style={styles.detailModalOverlay}
          activeOpacity={1}
          onPress={() => setDetailIngredient(null)}>
          <View style={styles.detailModalContent} onStartShouldSetResponder={() => true}>
            {detailIngredient && (() => {
              const detail = getIngredientDetail(detailIngredient.name);
              const expiry = getExpiryStatus(detailIngredient.expiresAt);
              return (
                <>
                  <View style={styles.detailHeader}>
                    <View style={styles.detailEmojiContainer}>
                      <Text style={styles.detailEmoji}>
                        {INGREDIENT_EMOJI[detailIngredient.name] || CATEGORY_EMOJI[detailIngredient.category]}
                      </Text>
                    </View>
                    <Text style={styles.detailName}>{detailIngredient.name}</Text>
                    <View style={[styles.detailExpiryBadge, {backgroundColor: expiry.color + '18'}]}>
                      <Text style={styles.detailExpiryIcon}>{expiry.icon}</Text>
                      <Text style={[styles.detailExpiryText, {color: expiry.color}]}>
                        {expiry.text}
                      </Text>
                    </View>
                  </View>

                  {detail ? (
                    <ScrollView style={styles.detailBody} showsVerticalScrollIndicator={false}>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>📦 보관 방법</Text>
                        <Text style={styles.detailSectionText}>{detail.storage}</Text>
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>🔪 손질 방법</Text>
                        <Text style={styles.detailSectionText}>{detail.preparation}</Text>
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>👶 이유식 팁</Text>
                        <Text style={styles.detailSectionText}>{detail.tip}</Text>
                      </View>
                      {detail.allergy && (
                        <View style={[styles.detailSection, styles.detailAllergySection]}>
                          <Text style={styles.detailSectionTitle}>⚠️ 알레르기 주의</Text>
                          <Text style={styles.detailAllergyText}>{detail.allergy}</Text>
                        </View>
                      )}
                    </ScrollView>
                  ) : (
                    <View style={styles.detailBody}>
                      <Text style={styles.detailNoInfo}>상세 정보가 아직 준비되지 않았어요</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.detailCloseButton}
                    onPress={() => setDetailIngredient(null)}>
                    <Text style={styles.detailCloseButtonText}>닫기</Text>
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* iOS 유효기한 수정 모달 */}
      {Platform.OS === 'ios' && (
        <Modal visible={showEditDatePicker} transparent animationType="slide">
          <View style={styles.editModalOverlay}>
            <View style={styles.editModalContent}>
              <View style={styles.editModalHeader}>
                <TouchableOpacity onPress={() => {
                  setShowEditDatePicker(false);
                  setEditingIngredientId(null);
                }}>
                  <Text style={styles.modalCancel}>취소</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>유효기한 수정</Text>
                <TouchableOpacity onPress={confirmExpiryDate}>
                  <Text style={styles.modalConfirm}>확인</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.editDatePickerContainer}>
                <DateTimePicker
                  value={tempExpiryDate}
                  mode="date"
                  display="spinner"
                  onChange={handleExpiryDateChange}
                  minimumDate={new Date()}
                  locale="ko-KR"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android 유효기한 수정 */}
      {Platform.OS === 'android' && showEditDatePicker && (
        <DateTimePicker
          value={tempExpiryDate}
          mode="date"
          display="default"
          onChange={handleExpiryDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Add Ingredient Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>식재료 추가</Text>
            </View>

            {/* 카테고리 탭 */}
            <View style={styles.modalCategoryTabs}>
              <View style={styles.modalCategoryTabsContent}>
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
              </View>
            </View>

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
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  // Edit Expiry Modal
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  editDatePickerContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalCategoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCategoryTabsContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  modalCategoryTab: {
    paddingHorizontal: 10,
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
    justifyContent: 'center',
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
  // Detail Modal
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  detailHeader: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailEmojiContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailEmoji: {
    fontSize: 36,
  },
  detailName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#181210',
    marginBottom: 8,
  },
  detailExpiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  detailExpiryIcon: {
    fontSize: 13,
  },
  detailExpiryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#181210',
    marginBottom: 6,
  },
  detailSectionText: {
    fontSize: 14,
    color: '#5a4a42',
    lineHeight: 22,
  },
  detailAllergySection: {
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 12,
  },
  detailAllergyText: {
    fontSize: 14,
    color: '#dc2626',
    lineHeight: 22,
  },
  detailNoInfo: {
    fontSize: 14,
    color: '#8d6a5e',
    textAlign: 'center',
    paddingVertical: 24,
  },
  detailCloseButton: {
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  detailCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
