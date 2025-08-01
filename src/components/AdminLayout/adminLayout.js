import React, { useContext } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { UserContext } from '../../App';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiMessageSquare
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.scss';

const AdminLayout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    localStorage.setItem('is_login', '0');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    setUser(null);
    toast.success('You have been logged out successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Admin Header */}
      <header className="admin-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <h1>Food Recipe Admin</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span>{user?.name || 'Admin'}</span>
          </div>
        </div>
      </header>

      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiHome /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiUsers /> <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/comments" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiMessageSquare /> <span>Comments</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiSettings /> <span>Settings</span>
              </NavLink>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="logout-button">
                <FiLogOut /> <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Admin Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;