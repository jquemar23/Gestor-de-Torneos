import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { APP_NAME, ICONS } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (email && password) {
        try {
          await register(email, password);
          navigate('/');
        } catch (err: any) {
          setError(err.message || 'Error al registrar la cuenta.');
        }
      } else {
        setError('Por favor, completa todos los campos.');
      }
      return;
    }

    if (email && password) {
      try {
        await login(email, password);
        navigate('/');
      } catch (err: any) {
        setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } else {
      setError('Por favor, introduce email y contraseña.');
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
    <div className="login-screen">
      <Card className="w-full max-w-md">
        <div className="login-brand" aria-hidden="true">{ICONS.TROPHY}</div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{APP_NAME}</h1>
          <p className="text-textSecondary mt-2">
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
          <button onClick={toggleMode} className="login-toggle text-sm text-primary hover:underline">
            {isRegisterMode ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿No tienes cuenta? Crear una cuenta'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;