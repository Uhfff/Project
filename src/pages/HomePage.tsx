import React, { useState } from 'react';
import { Recipe, FilterOptions, SortOption } from '../types';
import { RecipeCard } from '../components/Recipe/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

interface Props {
  onViewRecipe: (recipe: Recipe) => void;
}

const categories = ['Все', 'Основное блюдо', 'Салаты', 'Супы', 'Десерты', 'Закуски', 'Напитки'];

export const HomePage: React.FC<Props> = ({ onViewRecipe }) => {
  const { user } = useAuth();
  const { filterAndSortRecipes } = useRecipes();
  const { toggleFavorite, isFavorite } = useFavorites(user?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Все');
  const [maxTime, setMaxTime] = useState<number | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filters: FilterOptions = {
    searchQuery: searchQuery || undefined,
    category: selectedCategory !== 'Все' ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== 'Все' ? selectedDifficulty : undefined,
    maxTime,
  };

  const filteredRecipes = filterAndSortRecipes(filters, sortOption);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Добро пожаловать в RecipeHub! 👋</h1>
          <p className="text-lg opacity-90">
            Создавайте, находите и делитесь вкусными рецептами
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Поиск рецептов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="Все">Все уровни</option>
              <option value="easy">Легко</option>
              <option value="medium">Средне</option>
              <option value="hard">Сложно</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="newest">Новые</option>
              <option value="oldest">Старые</option>
              <option value="time-asc">По времени ↑</option>
              <option value="time-desc">По времени ↓</option>
              <option value="likes">По популярности</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={maxTime !== undefined}
                onChange={(e) => setMaxTime(e.target.checked ? 60 : undefined)}
                className="w-4 h-4 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Быстрые рецепты</span>
            </label>
            {maxTime !== undefined && (
              <input
                type="range"
                min="10"
                max="180"
                step="10"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="flex-1"
              />
            )}
            {maxTime !== undefined && (
              <span className="text-sm text-gray-600 min-w-[80px]">
                До {maxTime} мин
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Найдено рецептов: <span className="font-semibold">{filteredRecipes.length}</span>
          </p>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Рецепты не найдены
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить фильтры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
