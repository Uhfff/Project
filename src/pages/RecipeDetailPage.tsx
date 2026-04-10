import React from 'react';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';

interface Props {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const RecipeDetailPage: React.FC<Props> = ({ recipe, onBack, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites(user?.id);
  const isOwner = user?.id === recipe.authorId;

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <span>←</span>
          <span>Назад к рецептам</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Image */}
          <div className="h-80 bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 relative flex items-center justify-center">
            <span className="text-9xl opacity-50">🍽️</span>
          </div>

          <div className="p-8">
            {/* Title and Actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                <p className="text-gray-600 text-lg">{recipe.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Автор: {recipe.authorName} • {new Date(recipe.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
                >
                  <span className={`text-2xl ${isFavorite(recipe.id) ? 'text-red-500' : 'text-gray-400'}`}>
                    {isFavorite(recipe.id) ? '❤️' : '🤍'}
                  </span>
                </button>

                {isOwner && (
                  <>
                    <button
                      onClick={onEdit}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={onDelete}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      Удалить
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-sm text-gray-600">Время</div>
                <div className="text-lg font-semibold">{recipe.cookingTime} мин</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🍽️</div>
                <div className="text-sm text-gray-600">Порций</div>
                <div className="text-lg font-semibold">{recipe.servings}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm text-gray-600">Сложность</div>
                <div className="text-lg font-semibold">{getDifficultyText(recipe.difficulty)}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">❤️</div>
                <div className="text-sm text-gray-600">Нравится</div>
                <div className="text-lg font-semibold">{recipe.likes}</div>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ингредиенты</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-gray-900">
                        {ingredient.name} — {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Приготовление</h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
