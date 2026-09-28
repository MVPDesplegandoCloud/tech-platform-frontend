/**
 * Interests API Layer
 * Llamadas HTTP directas a endpoints de intereses
 * Sin lógica de negocio, solo comunicación con servidor
 */

import httpClient from '../../../shared/api/http-client';

/**
 * Obtener todos los intereses del usuario
 * @returns {Promise<Object>}
 */
export const getUserInterestsApi = async () => {
  return httpClient.get('/interests');
};

/**
 * Obtener un interés específico por ID
 * @param {string} id - ID del interés
 * @returns {Promise<Object>}
 */
export const getInterestByIdApi = async (id) => {
  return httpClient.get(`/interests/${id}`);
};

/**
 * Crear nuevo interés
 * @param {Object} data - Datos del interés
 * @returns {Promise<Object>}
 */
export const createInterestApi = async (data) => {
  return httpClient.post('/interests', data);
};

/**
 * Actualizar interés existente
 * @param {string} id - ID del interés
 * @param {Object} data - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateInterestApi = async (id, data) => {
  return httpClient.put(`/interests/${id}`, data);
};

/**
 * Eliminar interés
 * @param {string} id - ID del interés
 * @returns {Promise<Object>}
 */
export const deleteInterestApi = async (id) => {
  return httpClient.delete(`/interests/${id}`);
};

/**
 * Actualizar múltiples intereses (bulk update)
 * @param {Object} data - Objeto con array de intereses
 * @returns {Promise<Object>}
 */
export const bulkUpdateInterestsApi = async (data) => {
  return httpClient.post('/interests/bulk-update', data);
};
