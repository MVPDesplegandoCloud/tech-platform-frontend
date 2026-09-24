import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ConfirmSignUp = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp } = useAuth();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await confirmSignUp(email, code);
      navigate('/login', { 
        state: { message: 'Correo confirmado exitosamente. Ahora puedes iniciar sesión.' } 
      });
    } catch (err) {
      if (err.name === 'InvalidParameterException') {
        setError('Código de confirmación inválido');
      } else {
        setError(err.message || 'Error al confirmar correo');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Confirmar Correo</h1>
        
        <div className="info-message-box">
          Hemos enviado un código de confirmación a <strong>{email}</strong>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="code">Código de Confirmación</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              maxLength="6"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Verificando...' : 'Confirmar'}
          </button>
        </form>

        <div className="auth-links">
          <p>¿No recibiste el código? Revisa tu carpeta de spam.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignUp;
