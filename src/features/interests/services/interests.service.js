/**
 * Interests Service
 * Responsabilidad: orquestar operaciones de intereses.
 *   - Llama a la API layer.
 *   - Usa los mappers para transformar datos.
 *   - Contiene lógica de negocio (validaciones).
 *   - Devuelve Frontend Models, nunca DTOs de la API.
 *
 * TODO: Cuando el backend esté listo:
 *   1. Eliminar el bloque "MOCK" de cada método.
 *   2. Descomentar el bloque "REAL API" de cada método.
 *   3. Eliminar src/features/interests/mocks/interests.mock.js
 *   4. Eliminar el import de mocks de abajo.
 */

import * as interestsApi from '../api/interests.api';
import {
  fromInterestResponse,
  fromInterestsListResponse,
  toCreateRequest,
  toUpdateRequest,
  toBulkUpdateRequest,
} from '../mappers/interest.mapper';
import {
  mockDelay,
  getMockInterests,
  addMockInterest,
  updateMockInterest,
  deleteMockInterest,
  replaceMockInterests,
} from '../mocks/interests.mock';

class InterestsService {
  /**
   * Obtener todos los intereses del usuario
   * @returns {Promise<import('../models/interest.model').InterestsList>}
   */
  async getUserInterests() {
    // -------------------------------------------------------------------------
    // MOCK - Eliminar cuando el backend esté disponible
    await mockDelay();
    const data = getMockInterests().map(this._fromMockInterest);
    return { data, total: data.length };
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // REAL API - Descomentar cuando el backend esté disponible
    // try {
    //   const response = await interestsApi.getUserInterestsApi();
    //   return fromInterestsListResponse(response);
    // } catch (error) {
    //   throw this._handleError(error, 'Failed to fetch interests');
    // }
    // -------------------------------------------------------------------------
  }

  /**
   * Obtener un interés por ID
   * @param {string} id
   * @returns {Promise<import('../models/interest.model').TechInterest>}
   */
  async getInterestById(id) {
    // -------------------------------------------------------------------------
    // MOCK - Eliminar cuando el backend esté disponible
    await mockDelay();
    const found = getMockInterests().find((i) => i.id === id) || null;
    return found ? this._fromMockInterest(found) : null;
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // REAL API - Descomentar cuando el backend esté disponible
    // try {
    //   const response = await interestsApi.getInterestByIdApi(id);
    //   return fromInterestResponse(response);
    // } catch (error) {
    //   throw this._handleError(error, 'Failed to fetch interest');
    // }
    // -------------------------------------------------------------------------
  }

  /**
   * Crear nuevo interés
   * @param {import('../models/interest.model').CreateInterestInput} input
   * @returns {Promise<import('../models/interest.model').TechInterest>}
   */
  async createInterest(input) {
    // -------------------------------------------------------------------------
    // MOCK - Eliminar cuando el backend esté disponible
    await mockDelay();
    this._validateInterestRequest({ name: input.name, level: input.level });
    const newInterest = {
      id: String(Date.now()),
      technology: input.name,
      level: input.level,
      description: input.description ?? '',
    };
    addMockInterest(newInterest);
    return this._fromMockInterest(newInterest);
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // REAL API - Descomentar cuando el backend esté disponible
    // try {
    //   const requestDto = toCreateRequest(input);
    //   this._validateInterestRequest(requestDto);
    //   const response = await interestsApi.createInterestApi(requestDto);
    //   return fromInterestResponse(response?.data ?? response);
    // } catch (error) {
    //   throw this._handleError(error, 'Failed to create interest');
    // }
    // -------------------------------------------------------------------------
  }

  /**
   * Actualizar interés existente
   * @param {string} id
   * @param {import('../models/interest.model').UpdateInterestInput} input
   * @returns {Promise<import('../models/interest.model').TechInterest>}
   */
  async updateInterest(id, input) {
    // -------------------------------------------------------------------------
    // MOCK - Eliminar cuando el backend esté disponible
    await mockDelay();
    this._validateInterestRequest({ name: input.name, level: input.level });
    updateMockInterest(id, { technology: input.name, level: input.level, description: input.description ?? '' });
    const updated = getMockInterests().find((i) => i.id === id);
    return updated ? this._fromMockInterest(updated) : null;
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // REAL API - Descomentar cuando el backend esté disponible
    // try {
    //   const requestDto = toUpdateRequest(input);
    //   this._validateInterestRequest(requestDto);
    //   const response = await interestsApi.updateInterestApi(id, requestDto);
    //   return fromInterestResponse(response?.data ?? response);
    // } catch (error) {
    //   throw this._handleError(error, 'Failed to update interest');
    // }
    // -------------------------------------------------------------------------
  }

  /**
   * Eliminar interés
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteInterest(id) {
    // -------------------------------------------------------------------------
    // MOCK - Eliminar cuando el backend esté disponible
    await mockDelay();
    deleteMockInterest(id);
    return;
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // REAL API - Descomentar cuando el backend esté disponible
    // try {
    //   await interestsApi.deleteInterestApi(id);
    // } catch (error) {
    //   throw this._handleError(error, 'Failed to delete interest');
    // }
    // -------------------------------------------------------------------------
  }

  /**
   * Actualizar múltiples intereses (bulk update)
   * @param {import('../models/interest.model').TechInterest[]} interests
   * @returns {Promise<import('../models/interest.model').InterestsList>}
   */
  async bulkUpdateInterests(interests) {
    // -------------------------------------------------------------------------
    // MOCK - Eliminar cuando el backend esté disponible
    await mockDelay();
    if (!Array.isArray(interests)) throw new Error('Interests must be an array');
    interests.forEach((i) => this._validateInterestRequest({ name: i.name ?? i.technology, level: i.level }));
    replaceMockInterests(interests);
    const data = getMockInterests().map(this._fromMockInterest);
    return { data, total: data.length };
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // REAL API - Descomentar cuando el backend esté disponible
    // try {
    //   if (!Array.isArray(interests)) throw new Error('Interests must be an array');
    //   const requestDto = toBulkUpdateRequest(interests);
    //   requestDto.interests.forEach(this._validateInterestRequest);
    //   const response = await interestsApi.bulkUpdateInterestsApi(requestDto);
    //   return fromInterestsListResponse(response);
    // } catch (error) {
    //   throw this._handleError(error, 'Failed to update interests');
    // }
    // -------------------------------------------------------------------------
  }

  // ---------------------------------------------------------------------------
  // Private - lógica de negocio
  // ---------------------------------------------------------------------------

  _validateInterestRequest(interest) {
    if (!interest.name || interest.name.trim() === '') {
      throw new Error('Interest name is required');
    }
    if (typeof interest.level !== 'number' || interest.level < 1 || interest.level > 5) {
      throw new Error('Level must be between 1 and 5');
    }
  }

  _fromMockInterest(interest) {
    const { technology, ...rest } = interest;
    return { ...rest, name: technology ?? interest.name ?? '' };
  }

  _handleError(error, defaultMessage) {
    const message = error.details?.message || error.message || defaultMessage;
    const apiError = new Error(message);
    apiError.code = error.code || error.status;
    apiError.details = error.details;
    return apiError;
  }
}

export default new InterestsService();
