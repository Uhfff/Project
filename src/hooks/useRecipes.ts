import { useState, useEffect } from 'react';
import { Recipe, FilterOptions, SortOption } from '../types';

const STORAGE_KEY = 'recipes';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecipes(JSON.parse(stored));
    } else {
      // Инициализируем демо-данными
      const demoRecipes = getDemoRecipes();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoRecipes));
      setRecipes(demoRecipes);
    }
  };

  const createRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };

    const updated = [...recipes, newRecipe];
    setRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecipe;
  };

  const updateRecipe = (id: string, data: Partial<Recipe>) => {
    const updated = recipes.map(r => 
      r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
    );
    setRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(r => r.id !== id);
    setRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getRecipeById = (id: string) => {
    return recipes.find(r => r.id === id);
  };

  const filterAndSortRecipes = (filters: FilterOptions, sort: SortOption) => {
    let filtered = [...recipes];

    // Фильтрация по поиску
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(query))
      );
    }

    // Фильтрация по категории
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    // Фильтрация по сложности
    if (filters.difficulty) {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }

    // Фильтрация по максимальному времени
    if (filters.maxTime) {
      filtered = filtered.filter(r => r.cookingTime <= filters.maxTime!);
    }

    // Фильтрация по тегам
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(r => 
        filters.tags!.some(tag => r.tags.includes(tag))
      );
    }

    // Сортировка
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'time-asc':
        filtered.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      case 'time-desc':
        filtered.sort((a, b) => b.cookingTime - a.cookingTime);
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    return filtered;
  };

  return {
    recipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    filterAndSortRecipes,
    refreshRecipes: loadRecipes,
  };
};

// Демо рецепты для начальной загрузки
const getDemoRecipes = (): Recipe[] => [
  {
    id: '1',
    title: 'Паста Карбонара',
    description: 'Классическая итальянская паста с беконом и сливочным соусом',
    category: 'Основное блюдо',
    cookingTime: 30,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Спагетти', amount: '400', unit: 'г' },
      { name: 'Бекон', amount: '200', unit: 'г' },
      { name: 'Яйца', amount: '3', unit: 'шт' },
      { name: 'Пармезан', amount: '100', unit: 'г' },
      { name: 'Чеснок', amount: '2', unit: 'зубчика' },
    ],
    instructions: [
      'Отварите спагетти в подсоленной воде до состояния аль денте',
      'Обжарьте нарезанный бекон с чесноком до золотистого цвета',
      'Взбейте яйца с тертым пармезаном',
      'Смешайте горячую пасту с беконом и яичной смесью',
      'Подавайте немедленно с дополнительным пармезаном',
    ],
    authorId: 'demo',
    authorName: 'RecipeHub',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    likes: 42,
    tags: ['итальянская кухня', 'паста', 'быстро'],
  },
  {
    id: '2',
    title: 'Греческий салат',
    description: 'Свежий и легкий средиземноморский салат',
    category: 'Салаты',
    cookingTime: 15,
    servings: 2,
    difficulty: 'easy',
    ingredients: [
      { name: 'Помидоры', amount: '3', unit: 'шт' },
      { name: 'Огурцы', amount: '2', unit: 'шт' },
      { name: 'Фета', amount: '150', unit: 'г' },
      { name: 'Оливки', amount: '100', unit: 'г' },
      { name: 'Красный лук', amount: '1', unit: 'шт' },
      { name: 'Оливковое масло', amount: '3', unit: 'ст.л.' },
    ],
    instructions: [
      'Нарежьте помидоры и огурцы крупными кусками',
      'Нарежьте лук тонкими полукольцами',
      'Добавьте фету кубиками и оливки',
      'Заправьте оливковым маслом и приправьте орегано',
      'Перемешайте и подавайте охлажденным',
    ],
    authorId: 'demo',
    authorName: 'RecipeHub',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    likes: 28,
    tags: ['салаты', 'здоровое питание', 'вегетарианское'],
  },
  {
    id: '3',
    title: 'Шоколадный брауни',
    description: 'Насыщенный шоколадный десерт с хрустящей корочкой',
    category: 'Десерты',
    cookingTime: 45,
    servings: 8,
    difficulty: 'medium',
    ingredients: [
      { name: 'Темный шоколад', amount: '200', unit: 'г' },
      { name: 'Сливочное масло', amount: '150', unit: 'г' },
      { name: 'Сахар', amount: '200', unit: 'г' },
      { name: 'Яйца', amount: '3', unit: 'шт' },
      { name: 'Мука', amount: '100', unit: 'г' },
      { name: 'Какао-порошок', amount: '50', unit: 'г' },
    ],
    instructions: [
      'Растопите шоколад и масло на водяной бане',
      'Взбейте яйца с сахаром до пышной массы',
      'Смешайте шоколадную массу с яйцами',
      'Добавьте муку и какао, аккуратно перемешайте',
      'Выпекайте 25-30 минут при 180°C',
    ],
    authorId: 'demo',
    authorName: 'RecipeHub',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
    likes: 56,
    tags: ['десерты', 'шоколад', 'выпечка'],
  },
];
