import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Ingredient} from '../types';

const INGREDIENTS_KEY = '@ingredients';

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

export async function loadIngredients(): Promise<Ingredient[] | null> {
  try {
    const stored = await AsyncStorage.getItem(INGREDIENTS_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt),
      expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load ingredients:', error);
    return null;
  }
}

export async function getIngredientCount(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(INGREDIENTS_KEY);
    if (!stored) {
      return 0;
    }
    return JSON.parse(stored).length;
  } catch (error) {
    console.error('Failed to get ingredient count:', error);
    return 0;
  }
}
