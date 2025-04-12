import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUserCircle, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
      {/* Left side - Brand & Mobile Menu */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-square btn-ghost sm:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
          <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
            EPLQ
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex flex-none gap-4">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin-home" className="btn btn-ghost">
                Admin Dashboard
              </Link>
            )}
            <Link to="/search" className="btn btn-ghost">
              Search
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost gap-2">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-8">
                    <span>{user.name[0].toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-medium">{user.name}</span>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/profile" className="flex items-center gap-2">
                    <HiOutlineUserCircle className="text-lg" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="text-error flex items-center gap-2"
                  >
                    <HiOutlineUserCircle className="text-lg" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-base-100 shadow-lg z-50">
          <ul className="menu p-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin-home" className="text-lg">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/search" className="text-lg">
                    Search
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-lg">
                    Profile
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="text-error text-lg"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-lg">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-lg btn btn-primary mt-4">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;