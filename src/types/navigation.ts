export type RootStackParamList = {
  Home: undefined;
  Ingredients: undefined;
  Recipes: undefined;
  RecipeDetail: {recipeId: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
