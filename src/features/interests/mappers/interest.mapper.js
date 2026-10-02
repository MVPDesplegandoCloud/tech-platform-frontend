/**
 * Interests Mapper
 * ÚNICO lugar donde ocurren las transformaciones entre Frontend Models y API DTOs.
 *
 * Convenciones:
 *   toXxxRequest()    → Frontend Model  →  API Request DTO
 *   fromXxxResponse() → API Response DTO →  Frontend Model
 */

// ---------------------------------------------------------------------------
// RESPONSE MAPPERS: API Response DTO → Frontend Model
// ---------------------------------------------------------------------------

/**
 * fromInterestResponse
 * Mapea un único interés recibido de la API al modelo del Frontend.
 * Absorbe variaciones de nombres de campo que pueda devolver el backend.
 *
 * @param {Object} dto - InterestApiDTO
 * @returns {import('../models/interest.model').TechInterest | null}
 */
export const fromInterestResponse = (dto) => {
  if (!dto) return null;

  return {
    id: dto.id,
    name: dto.name ?? dto.technology ?? '',
    level: dto.level ?? dto.proficiency_level ?? 0,
    description: dto.description ?? '',
    userId: dto.userId ?? dto.user_id ?? null,
    createdAt: dto.createdAt ?? dto.created_at ?? null,
    updatedAt: dto.updatedAt ?? dto.updated_at ?? null,
  };
};

/**
 * fromInterestsListResponse
 * Mapea la respuesta de GET /interests al modelo del Frontend.
 * Acepta tanto un array plano como { data: [...], total: N }.
 *
 * @param {Object|Array} dto - InterestsListResponseDTO
 * @returns {import('../models/interest.model').InterestsList}
 */
export const fromInterestsListResponse = (dto) => {
  if (!dto) return { data: [], total: 0 };

  const items = Array.isArray(dto) ? dto : (dto.data ?? []);

  return {
    data: items.map(fromInterestResponse),
    total: dto.total ?? items.length,
  };
};

// ---------------------------------------------------------------------------
// REQUEST MAPPERS: Frontend Model → API Request DTO
// ---------------------------------------------------------------------------

/**
 * toCreateRequest
 * Mapea los datos de entrada del Frontend al DTO que espera POST /interests.
 *
 * @param {import('../models/interest.model').CreateInterestInput} input
 * @returns {import('../models/interest.model').CreateInterestRequestDTO}
 */
export const toCreateRequest = (input) => {
  return {
    name: input.name,
    level: parseInt(input.level, 10),
    description: input.description ?? '',
  };
};

/**
 * toUpdateRequest
 * Mapea los datos de entrada del Frontend al DTO que espera PUT /interests/:id.
 *
 * @param {import('../models/interest.model').UpdateInterestInput} input
 * @returns {import('../models/interest.model').UpdateInterestRequestDTO}
 */
export const toUpdateRequest = (input) => {
  return {
    name: input.name,
    level: parseInt(input.level, 10),
    description: input.description ?? '',
  };
};

/**
 * toBulkUpdateRequest
 * Mapea un array de Frontend Models al DTO que espera POST /interests/bulk-update.
 *
 * @param {import('../models/interest.model').TechInterest[]} interests
 * @returns {import('../models/interest.model').BulkUpdateRequestDTO}
 */
export const toBulkUpdateRequest = (interests) => {
  return {
    interests: interests.map((item) => ({
      id: item.id,
      name: item.name,
      level: parseInt(item.level, 10),
      description: item.description ?? '',
    })),
  };
};
