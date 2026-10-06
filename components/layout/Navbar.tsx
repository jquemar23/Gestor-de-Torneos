import React from 'react';
import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
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
    <header className="site-header">
      <nav className="nav-inner" aria-label="Navegación principal">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">{ICONS.TROPHY}</span>
          <span>{APP_NAME}</span>
        </Link>
        {isAuthenticated && (
          <div className="nav-links">
            <NavLink to="/">Resumen</NavLink>
            <NavLink to="/tournaments">Torneos</NavLink>
          </div>
        )}
        {isAuthenticated && (
          <div className="nav-account">
            <span className="account-avatar" aria-hidden="true">{APP_NAME.slice(0, 2).toUpperCase()}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" leftIcon={ICONS.LOGOUT}>
              Salir
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <RouterNavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
  >
    {children}
  </RouterNavLink>
);


export default Navbar;