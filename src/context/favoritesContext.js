import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Initialize state from localStorage or with empty arrays
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : { meals: [], categories: [] };
    }
    return { meals: [], categories: [] };
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle meal favorite status
  const toggleFavoriteMeal = (meal) => {
    setFavorites(prev => ({
      ...prev,
      meals: prev.meals.some(item => item.idMeal === meal.idMeal)
        ? prev.meals.filter(item => item.idMeal !== meal.idMeal)
        : [...prev.meals, meal]
    }));
  };

  // Toggle category favorite status
  const toggleFavoriteCategory = (category) => {
    setFavorites(prev => ({
      ...prev,
      categories: prev.categories.some(item => item.strCategory === category.strCategory)
        ? prev.categories.filter(item => item.strCategory !== category.strCategory)
        : [...prev.categories, category]
    }));
  };

  // Check if a meal is favorited
  const isMealFavorited = (mealId) => {
    return favorites.meals.some(meal => meal.idMeal === mealId);
  };

  // Check if a category is favorited
  const isCategoryFavorited = (categoryName) => {
    return favorites.categories.some(cat => cat.strCategory === categoryName);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites,
      toggleFavoriteMeal,
      toggleFavoriteCategory,
      isMealFavorited,
      isCategoryFavorited,
      favoriteMeals: favorites.meals,
      favoriteCategories: favorites.categories
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};