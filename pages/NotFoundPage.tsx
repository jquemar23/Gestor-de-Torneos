import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ICONS } from '../constants'; 

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <div className="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-32 h-32 text-primary mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <h1 className="text-5xl font-bold text-textPrimary mb-4">404 - Página No Encontrada</h1>
      <p className="text-xl text-textSecondary mb-8">
        ¡Vaya! La página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg" leftIcon={ICONS.ARROW_LEFT}>
          Ir a la Página Principal
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;