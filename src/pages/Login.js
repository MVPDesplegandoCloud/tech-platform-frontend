import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.isSignedIn) {
        navigate('/dashboard');
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        navigate('/confirm-signup', { state: { email } });
      }
    } catch (err) {
      if (err.name === 'UserNotConfirmedException') {
        setError('Usuario no confirmado. Por favor revisa tu correo.');
      } else if (err.name === 'NotAuthorizedException') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>

        {location.state?.message && <div className="info-message" role="status">{location.state.message}</div>}
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="auth-links auth-links--forgot-password">
            <Link to="/forgot-password" state={{ email }}>¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>

          <button 
            type="button" 
            className="secondary-button"
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            No tengo cuenta
          </button>
        </form>

        <div className="auth-links">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
