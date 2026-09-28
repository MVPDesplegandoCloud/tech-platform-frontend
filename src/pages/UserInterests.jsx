import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/molecules/Card/Card';
import TechInterestsForm from '../components/organisms/TechInterestsForm/TechInterestsForm';
import { useInterests } from '../hooks/useInterests';
import './UserInterests.css';

/**
 * UserInterests Page
 * Allows users to manage their technology interests and proficiency levels
 * 
 * Consumo de APIs:
 * - GET /interests: carga inicial
 * - POST /interests: agregar intereses individuales
 * - PUT /interests: guardar todos los intereses
 * - DELETE /interests/{technology}: eliminar interés
 */
const UserInterests = () => {
  const navigate = useNavigate();
  const {
    interests,
    isLoading,
    error,
    isSuccess,
    addInterests,
    saveAllInterests,
    deleteInterest,
    clearError,
    clearSuccess,
  } = useInterests();

  /**
   * Limpiar mensajes de error/éxito después de cierto tiempo
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(clearSuccess, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, clearSuccess]);

  /**
   * Convertir formato del componente al formato de la API
   * Componente usa: { id, name, level }
   * API usa: { technology, level }
   */
  const componentInterests = interests.map((interest, index) => ({
    id: String(index + 1),
    // El mock del servicio usa `name`; el contrato antiguo de la API usa
    // `technology`. Normalizamos ambos formatos para el componente visual.
    name: interest.name ?? interest.technology ?? '',
    level: interest.level,
  }));

  /**
   * Handle saving interests
   * Realiza PUT /interests con todos los intereses
   */
  const handleSaveInterests = async (updatedComponentInterests) => {
    try {
      // Convertir del formato del componente al formato de la API
      const apiInterests = updatedComponentInterests.map(item => ({
        name: item.name,
        level: item.level,
      }));

      // Llamar a PUT /interests para reemplazar todos
      await saveAllInterests(apiInterests);
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  /**
   * Handle delete interest
   */
  const handleDeleteInterest = async (technologyName) => {
    try {
      // Llamar a DELETE /interests/{technology}
      await deleteInterest(technologyName);
    } catch (error) {
      console.error('Error deleting interest:', error);
    }
  };

  /**
   * Handle add interest
   * Se ejecuta cuando se agrega un nuevo interés
   */
  const handleAddInterest = async (newInterest) => {
    try {
      // Convertir formato
      const apiInterest = {
        name: newInterest.name,
        level: newInterest.level,
      };

      // Llamar a POST /interests para agregar
      await addInterests([apiInterest]);
    } catch (error) {
      console.error('Error adding interest:', error);
    }
  };

  return (
    <div className="page-user-interests auth-container">
      <Card title="Mis Intereses Tecnológicos" elevation="lg">
        <div className="page-user-interests__content">
          {/* Mostrar mensaje de error */}
          {error && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              <strong>Error:</strong> {error.message}
              <button onClick={clearError} style={{ marginLeft: '0.5rem' }}>
                ✕
              </button>
            </div>
          )}

          {/* Mostrar mensaje de éxito */}
          {isSuccess && (
            <div className="success-message" style={{ marginBottom: '1rem' }}>
              ✓ Cambios guardados exitosamente
            </div>
          )}

          {/* Componente de formulario */}
          <TechInterestsForm
            initialInterests={componentInterests}
            onSave={handleSaveInterests}
            onDelete={handleDeleteInterest}
            onAdd={handleAddInterest}
            isLoading={isLoading}
          />

          {/* Debug: mostrar datos crudos (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', opacity: 0.5 }}>
              <summary>Debug: Datos de Intereses</summary>
              <pre>{JSON.stringify(interests, null, 2)}</pre>
            </details>
          )}

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
