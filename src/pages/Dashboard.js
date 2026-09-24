import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Tech Platform</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>¡Bienvenido!</h2>
          <p>Usuario: <strong>{user?.username || 'usuario'}</strong></p>
          <p className="user-id">ID de usuario: {user?.userId}</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Gestionar Intereses</h3>
            <p>Configura tus intereses tecnológicos para personalizar tu experiencia.</p>
            <button disabled className="feature-button">Próximamente</button>
          </div>

          <div className="feature-card">
            <h3>Seguir Fuentes</h3>
            <p>Suscríbete a tus fuentes de contenido favoritas.</p>
            <button disabled className="feature-button">Próximamente</button>
          </div>

          <div className="feature-card">
            <h3>Mi Feed</h3>
            <p>Accede a tu feed personalizado con contenido relevante.</p>
            <button disabled className="feature-button">Próximamente</button>
          </div>

          <div className="feature-card">
            <h3>Perfil</h3>
            <p>Actualiza tu información personal y preferencias.</p>
            <button disabled className="feature-button">Próximamente</button>
          </div>
        </div>

        <div className="info-section">
          <h3>Próximos pasos</h3>
          <ul>
            <li>Configurar tus intereses tecnológicos</li>
            <li>Explorar y seguir fuentes de contenido</li>
            <li>Descubrir artículos en tu feed personalizado</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
