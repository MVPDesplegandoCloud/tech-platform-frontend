import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/molecules/Card/Card';
import TechInterestsForm from '../components/organisms/TechInterestsForm/TechInterestsForm';
import { getUserInterests } from '../services/userPreferences';
import './UserInterests.css';

/**
 * UserInterests Page
 * Allows users to manage their technology interests and proficiency levels
 */
const UserInterests = () => {
  const [interests, setInterests] = useState([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    getUserInterests()
      .then((savedInterests) => {
        if (isActive) setInterests(savedInterests);
      })
      .catch((error) => {
        if (isActive) {
          setLoadError(error instanceof TypeError
            ? 'No se pudo conectar con User Preferences. Revisa CORS y que el endpoint GET /interests esté desplegado.'
            : error.message || 'No se pudieron cargar tus intereses.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingInterests(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="page-user-interests auth-container">
      <Card title="Mis Intereses Tecnológicos" elevation="lg">
        <div className="page-user-interests__content">
          {isLoadingInterests && <p role="status">Cargando tus intereses…</p>}
          {loadError && <p className="page-user-interests__load-error" role="alert">{loadError}</p>}
          {!isLoadingInterests && !loadError && interests.length === 0 && (
            <p role="status">Aún no tienes intereses guardados.</p>
          )}
          <TechInterestsForm
            initialInterests={interests}
            readOnly
            key={isLoadingInterests ? 'loading' : 'loaded'}
          />

          <div className="page-user-interests__footer">
            <button
              className="page-user-interests__back-link"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserInterests;
