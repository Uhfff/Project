import React from 'react';
import { Recipe } from '../types';
import { RecipeCard } from '../components/Recipe/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

interface Props {
  onViewRecipe: (recipe: Recipe) => void;
}

export const MyRecipesPage: React.FC<Props> = ({ onViewRecipe }) => {
  const { user } = useAuth();
  const { recipes } = useRecipes();
  const { toggleFavorite, isFavorite } = useFavorites(user?.id);

  const myRecipes = recipes.filter(r => r.authorId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Мои рецепты</h1>
          <p className="text-gray-600">
            Всего создано рецептов: <span className="font-semibold">{myRecipes.length}</span>
          </p>
        </div>

        {myRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
                onClick={() => onViewRecipe(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              У вас пока нет рецептов
            </h3>
            <p className="text-gray-600 mb-6">
              Создайте свой первый рецепт и поделитесь им с другими!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
