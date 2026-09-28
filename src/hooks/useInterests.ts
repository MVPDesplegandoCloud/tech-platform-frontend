/**
 * useInterests Hook
 * 
 * Gestiona el estado de los intereses tecnológicos del usuario.
 * Proporciona:
 * - Carga inicial de intereses
 * - Agregar/actualizar intereses
 * - Eliminar intereses
 * - Guardar todos los intereses
 * - Manejo de estados: loading, error, success
 */

import { useState, useCallback, useEffect } from 'react';
import * as interestsApi from '../services/interestsApi';

export interface TechnologyInterest {
  technology: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface UseInterestsState {
  interests: TechnologyInterest[];
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export interface UseInterestsActions {
  fetchInterests: () => Promise<void>;
  addInterests: (interests: TechnologyInterest[]) => Promise<void>;
  saveAllInterests: (interests: TechnologyInterest[]) => Promise<void>;
  deleteInterest: (technology: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

export function useInterests(): UseInterestsState & UseInterestsActions {
  const [interests, setInterests] = useState<TechnologyInterest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Carga los intereses del usuario
   */
  const fetchInterests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await interestsApi.getInterests();
      setInterests(response.interests);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Failed to fetch interests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Agrega o actualiza intereses (merge)
   */
  const addNewInterests = useCallback(
    async (newInterests: TechnologyInterest[]) => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        await interestsApi.addInterests(newInterests);

        // Actualizar estado local: agregar/actualizar los nuevos intereses
        setInterests((prevInterests) => {
          const updated = [...prevInterests];

          newInterests.forEach((newInterest) => {
            const existingIndex = updated.findIndex(
              (i) => i.technology.toLowerCase() === newInterest.technology.toLowerCase()
            );

            if (existingIndex >= 0) {
              // Actualizar existente
              updated[existingIndex] = newInterest;
            } else {
              // Agregar nuevo
              updated.push(newInterest);
            }
          });

          return updated;
        });

        setIsSuccess(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Failed to add interests:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Guarda TODOS los intereses (replace)
   */
  const saveAll = useCallback(async (allInterests: TechnologyInterest[]) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await interestsApi.saveAllInterests(allInterests);
      setInterests(allInterests);
      setIsSuccess(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Failed to save interests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Elimina un interés específico
   */
  const deleteOne = useCallback(async (technology: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await interestsApi.deleteInterest(technology);

      // Actualizar estado local
      setInterests((prevInterests) =>
        prevInterests.filter(
          (i) => i.technology.toLowerCase() !== technology.toLowerCase()
        )
      );

      setIsSuccess(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Failed to delete interest:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpia el estado de éxito
   */
  const clearSuccess = useCallback(() => {
    setIsSuccess(false);
  }, []);

  /**
   * Carga los intereses al montar el componente
   */
  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  return {
    // Estado
    interests,
    isLoading,
    error,
    isSuccess,
    // Acciones
    fetchInterests,
    addInterests: addNewInterests,
    saveAllInterests: saveAll,
    deleteInterest: deleteOne,
    clearError,
    clearSuccess,
  };
}
