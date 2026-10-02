/**
 * Interests Mock Data
 * Estado en memoria para simular un backend mientras no está disponible.
 * Eliminar este archivo cuando el backend esté listo.
 */

// Estado mutable en memoria — se actualiza con cada operación CRUD
let mockStore = [
  { id: '1', technology: 'Spring AI', level: 4, description: '' },
  { id: '2', technology: 'Java', level: 3, description: '' },
  { id: '3', technology: 'AWS', level: 4, description: '' },
  { id: '4', technology: 'Docker', level: 5, description: '' },
  { id: '5', technology: 'React', level: 4, description: '' },
];

/** Simula latencia de red */
export const mockDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Devuelve copia del estado actual */
export const getMockInterests = () => [...mockStore];

/** Agrega un nuevo interés al store */
export const addMockInterest = (interest) => {
  mockStore = [...mockStore, interest];
};

/** Actualiza un interés existente */
export const updateMockInterest = (id, data) => {
  mockStore = mockStore.map((i) => (i.id === id ? { ...i, ...data } : i));
};

/** Elimina un interés del store */
export const deleteMockInterest = (id) => {
  mockStore = mockStore.filter((i) => i.id !== id);
};

/** Reemplaza todo el store */
export const replaceMockInterests = (interests) => {
  mockStore = interests.map(({ name, ...interest }) => ({
    ...interest,
    technology: interest.technology ?? name,
  }));
};
