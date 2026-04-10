import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import { useMealPlan } from '../hooks/useMealPlan';
import { MealPlan } from '../types';

export const MealPlanPage: React.FC = () => {
  const { user } = useAuth();
  const { recipes } = useRecipes();
  const { mealPlans, addMealPlan, removeMealPlan, getMealPlan } = useMealPlan(user?.id);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealPlan['mealType']>('lunch');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Генерируем даты на следующие 7 дней
  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getNextWeekDates();
  const mealTypes: MealPlan['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const getMealTypeName = (type: MealPlan['mealType']) => {
    const names = {
      breakfast: 'Завтрак',
      lunch: 'Обед',
      dinner: 'Ужин',
      snack: 'Перекус'
    };
    return names[type];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === today) return 'Сегодня';
    if (dateStr === tomorrowStr) return 'Завтра';
    
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleAddMeal = () => {
    if (selectedDate && selectedRecipeId) {
      addMealPlan(selectedDate, selectedMealType, selectedRecipeId);
      setShowAddModal(false);
      setSelectedRecipeId('');
    }
  };

  const openAddModal = (date: string, mealType: MealPlan['mealType']) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">План питания 📅</h1>
          <p className="text-gray-600">
            Спланируйте свое питание на неделю вперед
          </p>
        </div>

        {/* Meal Plan Grid */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                    Прием пищи
                  </th>
                  {weekDates.map(date => (
                    <th key={date} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 min-w-[150px]">
                      {formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mealTypes.map(mealType => (
                  <tr key={mealType}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                      {getMealTypeName(mealType)}
                    </td>
                    {weekDates.map(date => {
                      const meal = getMealPlan(date, mealType);
                      const recipe = meal ? recipes.find(r => r.id === meal.recipeId) : null;

                      return (
                        <td key={date} className="px-4 py-4">
                          {meal && recipe ? (
                            <div className="bg-orange-50 rounded-lg p-3 relative group">
                              <button
                                onClick={() => removeMealPlan(meal.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                              >
                                ✕
                              </button>
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {recipe.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ⏱️ {recipe.cookingTime} мин
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => openAddModal(date, mealType)}
                              className="w-full h-full min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition flex items-center justify-center text-gray-400 hover:text-orange-500"
                            >
                              <span className="text-2xl">+</span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shopping List Preview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Список покупок 🛒</h2>
          {mealPlans.length > 0 ? (
            <div className="space-y-2">
              {(() => {
                const ingredients = new Map<string, { amount: number; unit: string; recipes: string[] }>();
                
                mealPlans.forEach(plan => {
                  const recipe = recipes.find(r => r.id === plan.recipeId);
                  if (recipe) {
                    recipe.ingredients.forEach(ing => {
                      const key = ing.name.toLowerCase();
                      if (ingredients.has(key)) {
                        const existing = ingredients.get(key)!;
                        existing.recipes.push(recipe.title);
                      } else {
                        ingredients.set(key, {
                          amount: parseFloat(ing.amount) || 0,
                          unit: ing.unit,
                          recipes: [recipe.title]
                        });
                      }
                    });
                  }
                });

                return Array.from(ingredients.entries()).map(([name, data]) => (
                  <div key={name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-orange-500 rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{name}</p>
                      <p className="text-sm text-gray-500">
                        Для рецептов: {data.recipes.join(', ')}
                      </p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Добавьте рецепты в план питания, чтобы увидеть список покупок
            </p>
          )}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Добавить рецепт
            </h3>
            <p className="text-gray-600 mb-4">
              {formatDate(selectedDate)} • {getMealTypeName(selectedMealType)}
            </p>

            <div className="space-y-3 mb-6">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedRecipeId === recipe.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{recipe.title}</p>
                  <p className="text-sm text-gray-500">
                    ⏱️ {recipe.cookingTime} мин • 🍽️ {recipe.servings} порц.
                  </p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddMeal}
                disabled={!selectedRecipeId}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedRecipeId('');
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
