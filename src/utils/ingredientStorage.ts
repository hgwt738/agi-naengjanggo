import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Ingredient} from '../types';

const INGREDIENTS_KEY = '@ingredients';

const DAY = 24 * 60 * 60 * 1000;

const DEFAULT_INGREDIENTS: Ingredient[] = [
  {id: '1', name: '브로콜리', category: 'vegetable', addedAt: new Date(), expiresAt: new Date(Date.now() + 7 * DAY)},
  {id: '2', name: '고구마', category: 'vegetable', addedAt: new Date(), expiresAt: new Date(Date.now() + 21 * DAY)},
  {id: '3', name: '닭가슴살', category: 'meat', addedAt: new Date(), expiresAt: new Date(Date.now() + 2 * DAY)},
  {id: '4', name: '두부', category: 'other', addedAt: new Date(), expiresAt: new Date(Date.now() + 5 * DAY)},
  {id: '5', name: '쌀', category: 'grain', addedAt: new Date(), expiresAt: new Date(Date.now() + 90 * DAY)},
];

export async function saveIngredients(ingredients: Ingredient[]) {
  try {
    const serialized = ingredients.map(item => ({
      ...item,
      addedAt: item.addedAt instanceof Date ? item.addedAt.toISOString() : item.addedAt,
      expiresAt: item.expiresAt instanceof Date ? item.expiresAt.toISOString() : item.expiresAt,
    }));
    await AsyncStorage.setItem(INGREDIENTS_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save ingredients:', error);
  }
}

export async function loadIngredients(): Promise<Ingredient[]> {
  try {
    const stored = await AsyncStorage.getItem(INGREDIENTS_KEY);
    if (!stored) {
      await saveIngredients(DEFAULT_INGREDIENTS);
      return DEFAULT_INGREDIENTS;
    }
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt),
      expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load ingredients:', error);
    return [];
  }
}

export async function getIngredientCount(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(INGREDIENTS_KEY);
    if (!stored) {
      await saveIngredients(DEFAULT_INGREDIENTS);
      return DEFAULT_INGREDIENTS.length;
    }
    return JSON.parse(stored).length;
  } catch (error) {
    console.error('Failed to get ingredient count:', error);
    return 0;
  }
}
