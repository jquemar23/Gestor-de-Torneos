import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { APP_NAME } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (email && password) {
        // In a real app, check if email is already taken
        try {
          register(email, password); // register will also log in
          navigate('/');
        } catch (err: any) {
          setError(err.message || 'Error al registrar la cuenta.');
        }
      } else {
        setError('Por favor, completa todos los campos.');
      }
    } else {
      // Login mode
      if (email && password) {
        try {
            login(email, password); // Keep password field for login logic, though current mock doesn't use it
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
      } else {
        setError('Por favor, introduce email y contraseña.');
      }
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{APP_NAME}</h1>
          <p className="text-textSecondary">
            {isRegisterMode ? 'Crea una nueva cuenta para empezar.' : '¡Bienvenido de nuevo! Por favor, inicia sesión.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
            required
          />
          <Input
            label="Contraseña"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {isRegisterMode && (
            <Input
              label="Confirmar Contraseña"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full" variant="primary" size="lg">
            {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={toggleMode} className="text-sm text-primary hover:underline">
            {isRegisterMode ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿No tienes cuenta? Crear una cuenta'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;