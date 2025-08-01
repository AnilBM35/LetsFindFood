import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './admin.scss';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Food Recipe App',
    siteDescription: 'Discover delicious recipes from around the world',
    enableComments: true,
    enableUserRegistration: true,
    recipesPerPage: 12,
    featuredCategories: 'Breakfast, Lunch, Dinner, Dessert',
    mainColor: '#ff8c42',
    darkMode: false
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Apply dark mode if it was previously saved
    if (savedSettings && JSON.parse(savedSettings).darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Apply dark mode immediately
    if (settings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Apply main color as CSS variable
    document.documentElement.style.setProperty('--clr-orange', settings.mainColor);
    
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="admin-page">
      <h1>Settings</h1>
      
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-section">
          <h2>General Settings</h2>
          
          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="enableComments"
              name="enableComments"
              checked={settings.enableComments}
              onChange={handleChange}
            />
            <label htmlFor="enableComments">Enable Comments</label>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="enableUserRegistration"
              name="enableUserRegistration"
              checked={settings.enableUserRegistration}
              onChange={handleChange}
            />
            <label htmlFor="enableUserRegistration">Enable User Registration</label>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Content Settings</h2>
          
          <div className="form-group">
            <label htmlFor="recipesPerPage">Recipes Per Page</label>
            <input
              type="number"
              id="recipesPerPage"
              name="recipesPerPage"
              value={settings.recipesPerPage}
              onChange={handleChange}
              min="4"
              max="50"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="featuredCategories">Featured Categories (comma separated)</label>
            <input
              type="text"
              id="featuredCategories"
              name="featuredCategories"
              value={settings.featuredCategories}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Appearance</h2>
          
          <div className="form-group">
            <label htmlFor="mainColor">Main Color</label>
            <input
              type="color"
              id="mainColor"
              name="mainColor"
              value={settings.mainColor}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
            />
            <label htmlFor="darkMode">Dark Mode</label>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button">Save Settings</button>
          <button type="button" className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;