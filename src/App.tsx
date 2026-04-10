import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useRecipes } from './hooks/useRecipes';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { RecipeFormPage } from './pages/RecipeFormPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyRecipesPage } from './pages/MyRecipesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MealPlanPage } from './pages/MealPlanPage';
import { Recipe } from './types';

type Page = 'home' | 'recipe-detail' | 'create' | 'edit' | 'profile' | 'my-recipes' | 'favorites' | 'meal-plan';

function AppContent() {
  const { user } = useAuth();
  const { createRecipe, updateRecipe, deleteRecipe, getRecipeById, refreshRecipes } = useRecipes();
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage('recipe-detail');
  };

  const handleCreateRecipe = () => {
    setSelectedRecipe(null);
    setCurrentPage('create');
  };

  const handleEditRecipe = () => {
    setCurrentPage('edit');
  };

  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
    if (currentPage === 'edit' && selectedRecipe) {
      updateRecipe(selectedRecipe.id, recipeData);
      const updated = getRecipeById(selectedRecipe.id);
      if (updated) {
        setSelectedRecipe(updated);
        setCurrentPage('recipe-detail');
      }
    } else {
      const newRecipe = createRecipe(recipeData);
      setSelectedRecipe(newRecipe);
      setCurrentPage('recipe-detail');
    }
    refreshRecipes();
  };

  const handleDeleteRecipe = () => {
    if (selectedRecipe && window.confirm('Вы уверены, что хотите удалить этот рецепт?')) {
      deleteRecipe(selectedRecipe.id);
      setCurrentPage('home');
      setSelectedRecipe(null);
      refreshRecipes();
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page === 'create') {
      handleCreateRecipe();
    }
  };

  // Если пользователь не авторизован, показываем формы входа/регистрации
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        {showLogin ? (
          <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  // Рендер страниц
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onViewRecipe={handleViewRecipe} />;
      
      case 'recipe-detail':
        return selectedRecipe ? (
          <RecipeDetailPage
            recipe={selectedRecipe}
            onBack={() => setCurrentPage('home')}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />
        ) : null;
      
      case 'create':
      case 'edit':
        return (
          <RecipeFormPage
            recipe={currentPage === 'edit' ? selectedRecipe || undefined : undefined}
            onSave={handleSaveRecipe}
            onCancel={() => {
              if (currentPage === 'edit' && selectedRecipe) {
                setCurrentPage('recipe-detail');
              } else {
                setCurrentPage('home');
              }
            }}
          />
        );
      
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('home')} />;
      
      case 'my-recipes':
        return <MyRecipesPage onViewRecipe={handleViewRecipe} />;
      
      case 'favorites':
        return <FavoritesPage onViewRecipe={handleViewRecipe} />;
      
      case 'meal-plan':
        return <MealPlanPage />;
      
      default:
        return <HomePage onViewRecipe={handleViewRecipe} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
