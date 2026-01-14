export type IngredientCategory =
  | 'vegetable'
  | 'fruit'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'grain'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  addedAt: Date;
  expiresAt?: Date;
}

export type AgeGroup = '초기' | '중기' | '후기' | '완료기';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  ageGroup: AgeGroup;
  cookingTime: number;
  difficulty: Difficulty;
  steps?: string[];
  imageUrl?: string;
}

export interface Baby {
  id: string;
  name: string;
  birthDate: Date;
  allergies?: string[];
}
