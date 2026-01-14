import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import {
  HomeScreen,
  IngredientsScreen,
  RecipesScreen,
  RecipeDetailScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B35',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#FFF9F0',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Ingredients"
          component={IngredientsScreen}
          options={{title: '식재료 관리'}}
        />
        <Stack.Screen
          name="Recipes"
          component={RecipesScreen}
          options={{title: '레시피'}}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{title: '레시피 상세'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
