import React from 'react';
import "./Meal.scss";
import { Link } from 'react-router-dom';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useFavorites } from '../../context/favoritesContext';
import { showSuccessToast } from '../../utils/toastify.util';

const MealList = ({ meals }) => {
  const { toggleFavoriteMeal, isMealFavorited } = useFavorites();

  const handleFavoriteClick = (mealItem, e) => {
    e.preventDefault();
    const isFavorited = isMealFavorited(mealItem.idMeal || mealItem.id);
    toggleFavoriteMeal(mealItem);
    showSuccessToast(
      isFavorited ? 'Removed from favorites' : 'Added to favorites!'
    );
  };

  return (
    <div className='section-wrapper'>
      <div className='container'>
        <div className='sc-title'>meals</div>
        <section className='sc-meal grid'>
          {meals?.map(mealItem => {
            const { 
              idMeal: id, 
              strArea: area, 
              strCategory: category, 
              strMeal: meal, 
              strMealThumb: thumbnail 
            } = mealItem;
            
            const isFavorited = isMealFavorited(id);

            return (
              <div className="meal-itm align-center justify-center" key={id}>
                <Link to={`/meal/${id}`} className="meal-link">
                  <div className='meal-itm-img'>
                    <img 
                      src={thumbnail} 
                      alt={meal} 
                      onError={(e) => {
                        e.target.src = '/default-meal.jpg';
                        e.target.alt = 'Default meal image';
                      }}
                    />
                    <div className='meal-itm-cat bg-orange text-orange fw-6'>
                      {category}
                    </div>
                  </div>
                  <div className='meal-itm-body'>
                    <div className='meal-itm-body-info flex flex-column'>
                      <div className='area fs-14 ls-1 fw-5'>{area}</div>
                      <div className='meal fw-15 fw-7 op-09'>{meal}</div>
                    </div>
                  </div>
                </Link>
                <Button
                  type="text"
                  icon={isFavorited ? (
                    <HeartFilled style={{ color: '#ff4d4f' }} />
                  ) : (
                    <HeartOutlined style={{ color: '#666' }} />
                  )}
                  onClick={(e) => handleFavoriteClick(mealItem, e)}
                  className="meal-fav-btn"
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                />
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default MealList;