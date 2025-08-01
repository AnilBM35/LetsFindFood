import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useFavorites } from '../../context/favoritesContext';
import './Category.scss';

const CategoryList = ({ categories }) => {
  const { favoriteCategories, toggleFavoriteCategory } = useFavorites();

  return (
    <div className='section-wrapper'>
      <div className='container'>
        <div className='sc-title'>categories</div>
        <section className='sc-category grid'>
          {categories?.map(categoryItem => {
            const { strCategory: category, strCategoryThumb: thumbnail } = categoryItem;
            const isFavorited = favoriteCategories.some(fav => fav.strCategory === category);

            return (
              <div className="category-itm align-center justify-center" key={category}>
                <Link to={`/meal/category/${category}`} className="category-link">
                  <div className='category-itm-img'>
                    <img src={thumbnail} alt={category} />
                  </div>
                  <div className='category-itm-body'>
                    <div className='category-itm-body-info flex flex-column'>
                      <div className='category fw-15 fw-7 op-09'>{category}</div>
                    </div>
                  </div>
                </Link>
                <Button
                  type="text"
                  icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavoriteCategory(categoryItem);
                  }}
                  className="category-fav-btn"
                />
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default CategoryList;