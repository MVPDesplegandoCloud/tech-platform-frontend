import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validatePassword = (pwd) => {
    // Al menos 8 caracteres, 1 mayúscula, 1 número, 1 carácter especial
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial'
      );
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      navigate('/confirm-signup', { state: { email } });
    } catch (err) {
      if (err.name === 'UsernameExistsException') {
        setError('El correo ya está registrado');
      } else if (err.name === 'InvalidPasswordException') {
        setError('La contraseña no cumple con los requisitos de seguridad');
      } else {
        setError(err.message || 'Error al registrarse');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        
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
            <small>
              Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          <button 
            type="button" 
            className="secondary-button"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Ya tengo cuenta
          </button>
        </form>

        <div className="auth-links">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
