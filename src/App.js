import './App.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home, MealDetails, Error, Category } from "./pages/index";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FavoritesProvider } from './context/favoritesContext';
import FavoritesPage from './context/favoritesPage';
import Login from "./pages/Auth/Login";
import UserLogin from "./pages/Auth/UserLogin";
import UserSignup from "./pages/Auth/UserSignup";
import CommentsContext from './components/Comments/commentsContext';

// Admin pages
import Dashboard from "./pages/Admin/dashBoard";
import Settings from "./pages/Admin/settings";
import Users from "./pages/Admin/user/Users";
import UserAdd from "./pages/Admin/user/UserAdd";
import UserDetails from "./pages/Admin/user/UserDetails";
import CustomLayout from './components/AdminLayout/adminLayout';

export const UserContext = React.createContext();

const ProtectedAdminRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('is_login') === '1';
  const userRole = localStorage.getItem('user_role');
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (userRole !== 'admin') return <Navigate to="/" replace />;
  
  return children;
};

const ProtectedUserRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('is_login') === '1';
  const userRole = localStorage.getItem('user_role');
  
  if (!isLoggedIn) return <Navigate to="/user/login" replace />;
  if (userRole !== 'user' && userRole !== 'admin') return <Navigate to="/user/login" replace />;
  
  return children;
};

// Wrapper component to handle conditional rendering of Header and Sidebar
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/user/login', '/user/signup'].includes(location.pathname);

  return (
    <>
      {/* Render Header only if not on admin or auth routes */}
      {!isAdminRoute && !isAuthRoute && <Header />}
      {/* Render Sidebar only if not on admin routes */}
      {!isAdminRoute && <Sidebar />}
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

function App() {
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('is_login') === '1';
    if (!loggedIn) setUser(null);
  }, []);

  return (
    <FavoritesProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<ProtectedUserRoute><FavoritesPage /></ProtectedUserRoute>} />
              <Route path="/meal/:id" element={<ProtectedUserRoute><MealDetails /></ProtectedUserRoute>} />
              <Route path="/meal/category/:name" element={<ProtectedUserRoute><Category /></ProtectedUserRoute>} />
              
              <Route path="/admin" element={<ProtectedAdminRoute><CustomLayout /></ProtectedAdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users title="Users" />} />
                <Route path="user/create" element={<UserAdd />} />
                <Route path="user/edit/:userId" element={<UserAdd />} />
                <Route path="user/details/:userId" element={<UserDetails />} />
                <Route path="comments" element={<CommentsContext />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="/login" element={<Login />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </LayoutWrapper>
          <ToastContainer />
        </BrowserRouter>
      </UserContext.Provider>
    </FavoritesProvider>
  );
}

export default App;