import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                <span className="text-white text-xl">🍳</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RecipeHub</span>
            </button>

            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => onNavigate('home')}
                className={`font-medium transition ${
                  currentPage === 'home'
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Рецепты
              </button>
              <button
                onClick={() => onNavigate('meal-plan')}
                className={`font-medium transition ${
                  currentPage === 'meal-plan'
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                План питания
              </button>
              <button
                onClick={() => onNavigate('favorites')}
                className={`font-medium transition ${
                  currentPage === 'favorites'
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Избранное
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('create')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              + Создать рецепт
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => onNavigate('profile')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Профиль
                </button>
                <button
                  onClick={() => onNavigate('my-recipes')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Мои рецепты
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
