import { useState, useEffect } from 'react';
import { MealPlan } from '../types';

const STORAGE_KEY = 'mealPlans';

export const useMealPlan = (userId: string | undefined) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    if (userId) {
      loadMealPlans();
    } else {
      setMealPlans([]);
    }
  }, [userId]);

  const loadMealPlans = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allPlans: MealPlan[] = JSON.parse(stored);
      const userPlans = allPlans.filter(p => p.userId === userId);
      setMealPlans(userPlans);
    }
  };

  const addMealPlan = (date: string, mealType: MealPlan['mealType'], recipeId: string) => {
    if (!userId) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const allPlans: MealPlan[] = stored ? JSON.parse(stored) : [];

    // Удаляем существующий план на эту дату и время приема пищи
    const filtered = allPlans.filter(
      p => !(p.userId === userId && p.date === date && p.mealType === mealType)
    );

    const newPlan: MealPlan = {
      id: Date.now().toString(),
      userId,
      date,
      mealType,
      recipeId,
    };

    filtered.push(newPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    const userPlans = filtered.filter(p => p.userId === userId);
    setMealPlans(userPlans);
  };

  const removeMealPlan = (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allPlans: MealPlan[] = stored ? JSON.parse(stored) : [];
    const filtered = allPlans.filter(p => p.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    const userPlans = filtered.filter(p => p.userId === userId);
    setMealPlans(userPlans);
  };

  const getMealPlan = (date: string, mealType: MealPlan['mealType']) => {
    return mealPlans.find(p => p.date === date && p.mealType === mealType);
  };

  return {
    mealPlans,
    addMealPlan,
    removeMealPlan,
    getMealPlan,
  };
};
