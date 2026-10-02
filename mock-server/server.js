/**
 * Mock Backend Server
 * 
 * Simula los endpoints de intereses mientras el backend real está en desarrollo.
 * Persiste datos en JSON files.
 * 
 * Endpoints:
 * - GET /interests
 * - POST /interests
 * - PUT /interests
 * - DELETE /interests/{technology}
 * 
 * Cómo ejecutar:
 * npm run mock-server
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path a archivo de datos
const dataDir = path.join(__dirname, 'data');
const interestsFile = path.join(dataDir, 'interests.json');

// Crear directorio si no existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Inicializar archivo de intereses si no existe
 */
function initializeDataFile() {
  if (!fs.existsSync(interestsFile)) {
    const defaultData = {
      users: {},
    };
    fs.writeFileSync(interestsFile, JSON.stringify(defaultData, null, 2));
  }
}

/**
 * Leer archivo de intereses
 */
function readInterests() {
  try {
    const data = fs.readFileSync(interestsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading interests file:', error);
    return { users: {} };
  }
}

/**
 * Escribir archivo de intereses
 */
function writeInterests(data) {
  try {
    fs.writeFileSync(interestsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing interests file:', error);
    throw new Error('Failed to save data');
  }
}

/**
 * Extraer userId del JWT (Bearer token)
 * Para desarrollo, usamos un ID fake basado en el token
 */
function getUserIdFromToken(authHeader) {
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    throw new Error('Invalid token');
  }

  // Para desarrollo, usamos un hash simple del token como userID
  // En producción, Cognito validaría y extraería el 'sub' claim
  const userId = Buffer.from(token).toString('base64').substring(0, 16);
  return userId;
}

/**
 * Middleware para autenticación
 */
function authMiddleware(req, res, next) {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: error.message });
  }
}

/**
 * GET /interests
 * Obtiene los intereses del usuario
 */
app.get('/interests', authMiddleware, (req, res) => {
  try {
    const data = readInterests();
    const userId = req.userId;

    // Obtener intereses del usuario (o array vacío si no existen)
    const interests = data.users[userId] || [];

    res.json({ interests });
  } catch (error) {
    console.error('Error in GET /interests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /interests
 * Agrega/actualiza intereses (merge)
 */
app.post('/interests', authMiddleware, (req, res) => {
  try {
    const { interests } = req.body;
    const userId = req.userId;

    // Validar
    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'interests must be a non-empty array',
      });
    }

    // Validar cada interés
    for (const interest of interests) {
      if (!interest.technology || interest.level === undefined) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Each interest must have technology and level',
        });
      }
      if (![1, 2, 3, 4, 5].includes(interest.level)) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Level must be between 1 and 5',
        });
      }
    }

    // Leer datos actuales
    const data = readInterests();
    const currentInterests = data.users[userId] || [];

    // Merge: actualizar o agregar intereses
    const updatedInterests = [...currentInterests];

    interests.forEach((newInterest) => {
      const existingIndex = updatedInterests.findIndex(
        (i) => i.technology.toLowerCase() === newInterest.technology.toLowerCase()
      );

      if (existingIndex >= 0) {
        // Actualizar existente
        updatedInterests[existingIndex] = newInterest;
      } else {
        // Agregar nuevo
        updatedInterests.push(newInterest);
      }
    });

    // Guardar
    data.users[userId] = updatedInterests;
    writeInterests(data);

    // Respuesta 201 sin contenido
    res.status(201).end();
  } catch (error) {
    console.error('Error in POST /interests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /interests
 * Reemplaza TODOS los intereses
 */
app.put('/interests', authMiddleware, (req, res) => {
  try {
    const { interests } = req.body;
    const userId = req.userId;

    // Validar
    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'interests must be a non-empty array',
      });
    }

    // Validar cada interés
    for (const interest of interests) {
      if (!interest.technology || interest.level === undefined) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Each interest must have technology and level',
        });
      }
      if (![1, 2, 3, 4, 5].includes(interest.level)) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Level must be between 1 and 5',
        });
      }
    }

    // Leer datos
    const data = readInterests();

    // Reemplazar todos los intereses
    data.users[userId] = interests;
    writeInterests(data);

    // Respuesta 204 sin contenido
    res.status(204).end();
  } catch (error) {
    console.error('Error in PUT /interests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /interests/{technology}
 * Elimina un interés específico
 */
app.delete('/interests/:technology', authMiddleware, (req, res) => {
  try {
    const { technology } = req.params;
    const userId = req.userId;

    if (!technology) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Technology name is required',
      });
    }

    // Leer datos
    const data = readInterests();
    const currentInterests = data.users[userId] || [];

    // Buscar y eliminar
    const foundIndex = currentInterests.findIndex(
      (i) => i.technology.toLowerCase() === technology.toLowerCase()
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: `Interest "${technology}" not found`,
      });
    }

    // Eliminar
    currentInterests.splice(foundIndex, 1);
    data.users[userId] = currentInterests;
    writeInterests(data);

    // Respuesta 204 sin contenido
    res.status(204).end();
  } catch (error) {
    console.error('Error in DELETE /interests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /health
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'mock-backend',
  });
});

/**
 * Inicializar y iniciar servidor
 */
initializeDataFile();

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Mock Backend Server - Intereses      ║
╠════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}        ║
║  📁 Data file: ${interestsFile}║
║  🔐 Auth: Bearer token required        ║
║  💾 Data persisted in JSON             ║
╚════════════════════════════════════════╝
  `);

  console.log('Endpoints:');
  console.log('  GET  /interests');
  console.log('  POST /interests');
  console.log('  PUT  /interests');
  console.log('  DELETE /interests/{technology}');
  console.log('  GET  /health');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
