import { useState, useCallback, useEffect } from 'react';
import interestsService from '../features/interests/services/interests.service';

/**
 * useInterests Hook
 * Responsabilidad: integración con React.
 *   - Gestiona estado local (interests, isLoading, error, isSuccess).
 *   - Consume el service para operaciones CRUD.
 *   - No conoce detalles del contrato de la API ni hace mapping de datos.
 */
export const useInterests = () => {
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // -------------------------------------------------------------------------
  // Carga inicial
  // -------------------------------------------------------------------------

  useEffect(() => {
    const fetchInterests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await interestsService.getUserInterests();
        setInterests(result.data);
      } catch (err) {
        setError({ message: err.message || 'Failed to load interests', code: err.code });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterests();
  }, []);

  // -------------------------------------------------------------------------
  // Helpers internos
  // -------------------------------------------------------------------------

  /**
   * Refresca la lista de intereses desde el servidor.
   * @returns {Promise<TechInterest[]>}
   */
  const _refreshInterests = useCallback(async () => {
    const result = await interestsService.getUserInterests();
    setInterests(result.data);
    return result.data;
  }, []);

  // -------------------------------------------------------------------------
  // Acciones expuestas al componente
  // -------------------------------------------------------------------------

  /**
   * Agregar uno o varios intereses.
   * Recibe un array de CreateInterestInput (Frontend Model).
   * @param {import('../features/interests/models/interest.model').CreateInterestInput[]} newInterests
   */
  const addInterests = useCallback(async (newInterests) => {
    setIsLoading(true);
    setError(null);
    try {
      for (const interest of newInterests) {
        await interestsService.createInterest(interest);
      }
      const updated = await _refreshInterests();
      setIsSuccess(true);
      return updated;
    } catch (err) {
      setError({ message: err.message || 'Failed to add interests', code: err.code });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [_refreshInterests]);

  /**
   * Actualizar un interés.
   * @param {string} id
   * @param {import('../features/interests/models/interest.model').UpdateInterestInput} data
   */
  const updateInterest = useCallback(async (id, data) => {
    setIsLoading(true);
    setError(null);
    try {
      await interestsService.updateInterest(id, data);
      const updated = await _refreshInterests();
      setIsSuccess(true);
      return updated;
    } catch (err) {
      setError({ message: err.message || 'Failed to update interest', code: err.code });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [_refreshInterests]);

  /**
   * Eliminar un interés.
   * @param {string} id
   */
  const deleteInterest = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await interestsService.deleteInterest(id);
      const updated = await _refreshInterests();
      setIsSuccess(true);
      return updated;
    } catch (err) {
      setError({ message: err.message || 'Failed to delete interest', code: err.code });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [_refreshInterests]);

  /**
   * Reemplazar todos los intereses (bulk update).
   * @param {import('../features/interests/models/interest.model').TechInterest[]} interestsToSave
   */
  const saveAllInterests = useCallback(async (interestsToSave) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await interestsService.bulkUpdateInterests(interestsToSave);
      setInterests(result.data);
      setIsSuccess(true);
      return result.data;
    } catch (err) {
      setError({ message: err.message || 'Failed to save interests', code: err.code });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setIsSuccess(false), []);

  return {
    interests,
    isLoading,
    error,
    isSuccess,
    addInterests,
    updateInterest,
    deleteInterest,
    saveAllInterests,
    clearError,
    clearSuccess,
  };
};

export default useInterests;
