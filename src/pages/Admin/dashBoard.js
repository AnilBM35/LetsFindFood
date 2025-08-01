import React from 'react';
import './admin.scss';

const Dashboard = () => {
  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Recipes</h3>
          <p className="stat-number">245</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">1,203</p>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <p className="stat-number">18</p>
        </div>
        <div className="stat-card">
          <h3>New Today</h3>
          <p className="stat-number">24</p>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <p><strong>User123</strong> added a new recipe: <span>Italian Pasta</span></p>
            <small>2 hours ago</small>
          </div>
          <div className="activity-item">
            <p><strong>Chef456</strong> updated recipe: <span>Chocolate Cake</span></p>
            <small>5 hours ago</small>
          </div>
          <div className="activity-item">
            <p><strong>FoodLover</strong> commented on: <span>Vegetable Curry</span></p>
            <small>Yesterday</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;