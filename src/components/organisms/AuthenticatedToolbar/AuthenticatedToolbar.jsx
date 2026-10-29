import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AuthenticatedToolbar.css';

const AuthenticatedToolbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = user?.displayName || user?.email || 'Usuario';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="authenticated-toolbar">
      <button
        className="authenticated-toolbar__brand"
        onClick={() => navigate('/dashboard')}
        type="button"
      >
        <span aria-hidden="true">←</span> Tech Platform
      </button>
      <div className="authenticated-toolbar__account">
        <span className="authenticated-toolbar__name" title={displayName}>{displayName}</span>
        <button
          className="authenticated-toolbar__logout"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? 'Cerrando…' : 'Cerrar sesión'}
        </button>
      </div>
    </header>
  );
};

export default AuthenticatedToolbar;
