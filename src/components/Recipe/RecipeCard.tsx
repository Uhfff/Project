import React from 'react';
import { Recipe } from '../../types';

interface Props {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick: () => void;
}

export const RecipeCard: React.FC<Props> = ({ 
  recipe, 
  isFavorite = false, 
  onToggleFavorite,
  onClick 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      default: return difficulty;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      <div onClick={onClick}>
        <div className="h-48 bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
            🍽️
          </div>
          <div className="absolute top-3 right-3">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                <span className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
                  {isFavorite ? '❤️' : '🤍'}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
              {recipe.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {recipe.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {getDifficultyText(recipe.difficulty)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{recipe.cookingTime} мин</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🍽️</span>
              <span>{recipe.servings} порц.</span>
            </div>
            <div className="flex items-center gap-1">
              <span>❤️</span>
              <span>{recipe.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
