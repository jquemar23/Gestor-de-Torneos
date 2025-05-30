import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME, ICONS } from '../../constants';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white text-xl font-bold">
              {APP_NAME}
            </Link>
          </div>
          <div className="hidden md:block">
            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/">Panel Principal</NavLink>
                <NavLink to="/tournaments">Torneos</NavLink>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            {isAuthenticated && (
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                className="text-primary-light hover:bg-primary-hover hover:text-white"
                leftIcon={<span className="text-primary-light">{ICONS.LOGOUT}</span>}
              >
                Cerrar Sesión
              </Button>
            )}
          </div>
          {/* Mobile menu button - can be implemented later */}
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="text-primary-light hover:bg-primary-hover hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);


export default Navbar;