export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  cookingTime: number; // в минутах
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  image?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  tags: string[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string; // ISO date string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  checked: boolean;
  recipeId?: string;
}

export interface UserFavorite {
  userId: string;
  recipeId: string;
  addedAt: string;
}

export type SortOption = 'newest' | 'oldest' | 'time-asc' | 'time-desc' | 'likes';

export interface FilterOptions {
  category?: string;
  difficulty?: string;
  maxTime?: number;
  searchQuery?: string;
  tags?: string[];
}
