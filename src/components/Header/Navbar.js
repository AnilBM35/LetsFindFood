import React, { useState, useEffect } from 'react'; // Added useState and useEffect imports
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { UserContext } from '../../App';
import { useFavorites } from '../../context/favoritesContext';
import './Header.scss';
import { MdFoodBank } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { FiLogIn } from "react-icons/fi";
import { BiLogOut, BiHeart } from "react-icons/bi";
import { useSidebarContext } from '../../context/sidebarContext';
import { Badge } from 'antd';

const Navbar = () => {
  const { user, setUser } = React.useContext(UserContext);
  const { openSidebar } = useSidebarContext();
  const { favoriteCategories } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 60) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    localStorage.setItem('is_login', '0');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    setUser(null);
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar bg-orange flex align-center ${scrolled ? 'scrolled' : ""}`}>
      <div className='container w-100'>
        <div className='navbar-content text-white'>
          <div className='brand-and-toggler flex align-center justify-between'>
            <Link to="/" className='navbar-brand fw-3 fs-22 flex align-center'>
              <MdFoodBank />
              <span className='navbar-brand-text fw-7'>Letsfindfood.</span>
            </Link>
            <div className='navbar-btns flex align-center'>
              {user ? (
                <>
                  <Link 
                    to="/favorites" 
                    className='navbar-auth-btn text-white flex align-center'
                    title="Favorites"
                  >
                    <Badge count={favoriteCategories.length} style={{ backgroundColor: '#fff', color: '#ff8c42' }}>
                      <BiHeart size={20} />
                    </Badge>
                  </Link>
                  <button
                    type="button"
                    className='navbar-auth-btn'
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <BiLogOut />
                  </button>
                </>
              ) : (
                <Link to="/user/login" className='navbar-auth-btn text-white' title="Login">
                  <FiLogIn />
                </Link>
              )}
              <button
                type="button"
                className='navbar-show-btn text-white'
                onClick={() => openSidebar()}
              >
                <IoMdMenu size={27} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;