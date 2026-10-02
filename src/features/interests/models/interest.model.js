/**
 * Interests - Frontend Models
 * Representan las estructuras de datos que usa el Frontend.
 * No están acoplados al formato del backend.
 */

/**
 * TechInterest - Modelo de interés tecnológico (Frontend)
 * @typedef {Object} TechInterest
 * @property {string} id - ID único del interés
 * @property {string} name - Nombre de la tecnología
 * @property {number} level - Nivel de proficiencia (1-5)
 * @property {string} [description] - Descripción opcional
 * @property {string} [userId] - ID del usuario propietario
 * @property {string} [createdAt] - Fecha de creación (ISO string)
 * @property {string} [updatedAt] - Fecha de última actualización (ISO string)
 */

/**
 * CreateInterestInput - Datos que el Frontend envía para crear un interés
 * @typedef {Object} CreateInterestInput
 * @property {string} name - Nombre de la tecnología
 * @property {number} level - Nivel de proficiencia (1-5)
 * @property {string} [description] - Descripción opcional
 */

/**
 * UpdateInterestInput - Datos que el Frontend envía para actualizar un interés
 * @typedef {Object} UpdateInterestInput
 * @property {string} name - Nombre de la tecnología
 * @property {number} level - Nivel de proficiencia (1-5)
 * @property {string} [description] - Descripción opcional
 */

/**
 * InterestsList - Modelo de lista de intereses (Frontend)
 * @typedef {Object} InterestsList
 * @property {TechInterest[]} data - Array de intereses
 * @property {number} total - Total de intereses
 */

// --- API DTOs (contrato con el backend) ---

/**
 * InterestApiDTO - Estructura que devuelve la API
 * @typedef {Object} InterestApiDTO
 * @property {string} id
 * @property {string} name
 * @property {number} level
 * @property {string} [description]
 * @property {string} [userId]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * CreateInterestRequestDTO - Cuerpo del POST /interests
 * @typedef {Object} CreateInterestRequestDTO
 * @property {string} name
 * @property {number} level
 * @property {string} description
 */

/**
 * UpdateInterestRequestDTO - Cuerpo del PUT /interests/:id
 * @typedef {Object} UpdateInterestRequestDTO
 * @property {string} name
 * @property {number} level
 * @property {string} description
 */

/**
 * BulkUpdateRequestDTO - Cuerpo del POST /interests/bulk-update
 * @typedef {Object} BulkUpdateRequestDTO
 * @property {Array<{id: string, name: string, level: number, description: string}>} interests
 */

/**
 * InterestsListResponseDTO - Respuesta del GET /interests
 * @typedef {Object} InterestsListResponseDTO
 * @property {InterestApiDTO[]} [data]
 * @property {number} [total]
 */

export {};
