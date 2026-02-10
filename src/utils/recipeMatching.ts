import type {RecipeData} from '../constants/recipeData';

export interface MatchedRecipe {
  recipe: RecipeData;
  matchPercentage: number;
  availableIngredients: string[];
  missingIngredients: string[];
}

export function matchRecipes(
  recipes: RecipeData[],
  userIngredients: string[],
): MatchedRecipe[] {
  const userSet = new Set(userIngredients);

  const matched: MatchedRecipe[] = recipes.map(recipe => {
    const available: string[] = [];
    const missing: string[] = [];

    for (const ing of recipe.ingredients) {
      if (userSet.has(ing)) {
        available.push(ing);
      } else {
        missing.push(ing);
      }
    }

    const total = recipe.ingredients.length;
    const percentage = total > 0 ? Math.round((available.length / total) * 100) : 0;

    return {
      recipe,
      matchPercentage: percentage,
      availableIngredients: available,
      missingIngredients: missing,
    };
  });

  matched.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.recipe.cookingTime - b.recipe.cookingTime;
  });

  return matched;
}
