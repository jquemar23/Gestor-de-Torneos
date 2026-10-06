import React from 'react';
import Navbar from './Navbar';
// Fix: Import APP_NAME
import { APP_NAME } from '../../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="page-content">
        {children}
      </main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;