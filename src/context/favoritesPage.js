import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/favoritesContext';
import './favoritesPage.scss';

const FavoritesPage = () => {
  const { favoriteMeals, favoriteCategories } = useFavorites();

  // Normalize meals data and ensure keys
  const normalizedMeals = favoriteMeals?.map(meal => ({
    id: meal.idMeal || meal.id,
    title: meal.strMeal || meal.title,
    category: meal.strCategory || meal.category,
    area: meal.strArea || meal.area,
    thumbnail: meal.strMealThumb || meal.thumbnail,
    ...meal
  })) || [];

  // Normalize categories data and ensure keys
  const normalizedCategories = favoriteCategories?.map(category => ({
    id: category.idCategory || category.id,
    name: category.strCategory || category.name,
    thumbnail: category.strCategoryThumb || category.thumbnail,
    ...category
  })) || [];

  return (
    <div className='section-wrapper'>
      <div className='container'>
        {/* Favorite Meals Section */}
        <div className='sc-title'>Favorite Meals</div>
        {normalizedMeals.length === 0 ? (
          <div className='no-favorites'>
            <p>You haven't favorited any meals yet.</p>
          </div>
        ) : (
          <section className='sc-meal grid'>
            {normalizedMeals.map(meal => (
              <div className="meal-itm align-center justify-center" key={`meal-${meal.id}`}>
                <Link to={`/meal/${meal.id}`} className="meal-link">
                  <div className='meal-itm-img'>
                    <img 
                      src={meal.thumbnail} 
                      alt={meal.title}
                      onError={(e) => {
                        e.target.src = '/default-meal.jpg';
                        e.target.alt = 'Default meal image';
                      }}
                    />
                    <div className='meal-itm-cat bg-orange text-orange fw-6'>
                      {meal.category}
                    </div>
                  </div>
                  <div className='meal-itm-body'>
                    <div className='meal-itm-body-info flex flex-column'>
                      <div className='area fs-14 ls-1 fw-5'>
                        {meal.area}
                      </div>
                      <div className='meal fw-15 fw-7 op-09'>
                        {meal.title}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </section>
        )}

        {/* Favorite Categories Section */}
        <div className='sc-title' style={{ marginTop: '3rem' }}>Favorite Categories</div>
        {normalizedCategories.length === 0 ? (
          <div className='no-favorites'>
            <p>You haven't favorited any categories yet.</p>
          </div>
        ) : (
          <section className='sc-category grid'>
            {normalizedCategories.map(category => (
              <div className="category-itm align-center justify-center" key={`category-${category.id}`}>
                <Link to={`/category/${category.name}`} className="category-link">
                  <div className='category-itm-img'>
                    <img 
                      src={category.thumbnail} 
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = '/default-category.jpg';
                        e.target.alt = 'Default category image';
                      }}
                    />
                  </div>
                  <div className='category-itm-body'>
                    <div className='category-itm-body-info flex flex-column'>
                      <div className='category fw-15 fw-7 op-09'>
                        {category.name}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </section>
        )}

        {/* Combined empty state */}
        {normalizedMeals.length === 0 && normalizedCategories.length === 0 && (
          <div className='no-favorites'>
            <p>Your favorites list is empty.</p>
            <Link to="/" className='browse-link'>
              Browse Meals and Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;