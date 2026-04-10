import { useState, useEffect } from 'react';
import { UserFavorite } from '../types';

const STORAGE_KEY = 'favorites';

export const useFavorites = (userId: string | undefined) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [userId]);

  const loadFavorites = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allFavorites: UserFavorite[] = JSON.parse(stored);
      const userFavorites = allFavorites
        .filter(f => f.userId === userId)
        .map(f => f.recipeId);
      setFavorites(userFavorites);
    }
  };

  const toggleFavorite = (recipeId: string) => {
    if (!userId) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const allFavorites: UserFavorite[] = stored ? JSON.parse(stored) : [];

    const existingIndex = allFavorites.findIndex(
      f => f.userId === userId && f.recipeId === recipeId
    );

    if (existingIndex !== -1) {
      // Удаляем из избранного
      allFavorites.splice(existingIndex, 1);
      setFavorites(favorites.filter(id => id !== recipeId));
    } else {
      // Добавляем в избранное
      allFavorites.push({
        userId,
        recipeId,
        addedAt: new Date().toISOString(),
      });
      setFavorites([...favorites, recipeId]);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFavorites));
  };

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
