# Mock Server Setup Guide

Mock backend para desarrollo local que persiste datos en JSON.

## 📋 Requisitos

- Node.js 16+ y npm
- Terminal

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias del mock server

```bash
cd mock-server
npm install
```

### 2. Iniciar el mock server

```bash
npm start
```

O para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### 3. Configurar el frontend

En el frontend, asegúrate de que `.env.local` tenga:

```env
REACT_APP_API_URL=http://localhost:3001
```

### 4. Iniciar el frontend

En otra terminal:

```bash
cd ..  # volver a raíz del frontend
npm start
```

---

## 📡 Endpoints Disponibles

### GET /interests
Obtiene los intereses del usuario autenticado.

```bash
curl -X GET http://localhost:3001/interests \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "interests": [
    {
      "technology": "Spring AI",
      "level": 5
    },
    {
      "technology": "Java",
      "level": 4
    }
  ]
}
```

---

### POST /interests
Agrega o actualiza intereses (merge con existentes).

```bash
curl -X POST http://localhost:3001/interests \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "interests": [
      {
        "technology": "Kubernetes",
        "level": 3
      }
    ]
  }'
```

**Response (201):** Sin contenido

---

### PUT /interests
Reemplaza TODOS los intereses.

```bash
curl -X PUT http://localhost:3001/interests \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "interests": [
      {
        "technology": "Spring AI",
        "level": 5
      },
      {
        "technology": "Java",
        "level": 4
      },
      {
        "technology": "Docker",
        "level": 3
      }
    ]
  }'
```

**Response (204):** Sin contenido

---

### DELETE /interests/{technology}
Elimina un interés específico.

```bash
curl -X DELETE http://localhost:3001/interests/spring%20ai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (204):** Sin contenido

---

### GET /health
Health check (sin autenticación).

```bash
curl http://localhost:3001/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-09-26T20:00:00.000Z",
  "environment": "mock-backend"
}
```

---

## 📁 Estructura de Archivos

```
mock-server/
├── server.js           # Servidor Express
├── package.json        # Dependencias
├── package-lock.json
└── data/
    └── interests.json  # Almacenamiento persistente
```

### Archivo `interests.json`

```json
{
  "users": {
    "user_id_123": [
      {
        "technology": "Spring AI",
        "level": 5
      },
      {
        "technology": "Java",
        "level": 4
      }
    ]
  }
}
```

Cada usuario tiene su array de intereses. El ID del usuario se deriva del token Bearer.

---

## 🔐 Autenticación

El mock server **requiere un Bearer token** en el header `Authorization`:

```
Authorization: Bearer <token>
```

**Para desarrollo**, cualquier string puede servir como token. Por ejemplo:

```bash
Authorization: Bearer test-token-123
```

El servidor extraerá un userID del token (usando base64 encoding) para segregar datos por usuario.

---

## 🧪 Testing Manual

### 1. Abrir DevTools en el navegador

En `/interests`, abre la consola y verifica que:

```javascript
// La petición GET /interests se completa exitosamente
// Verás los datos en la consola
```

### 2. Agregar un interés

Usa el formulario en la página `/interests`:
- Ingresa "Kubernetes" con nivel 3
- Haz clic en agregar
- Verifica que POST se ejecute correctamente

### 3. Eliminar un interés

Haz clic en el ícono "X" al lado de un interés:
- Verifica que DELETE se ejecute
- Verifica que el interés desaparezca

### 4. Guardar cambios

Haz clic en "Guardar cambios":
- Verifica que PUT se ejecute
- Verifica que todos los intereses se actualicen

---

## 🐛 Troubleshooting

### Error: EADDRINUSE (port 3001 en uso)

```bash
# Encuentra el proceso usando el puerto
lsof -i :3001

# Mata el proceso
kill -9 <PID>
```

O cambia el puerto:

```bash
PORT=3002 npm start
```

### Error: fetch failed / CORS

Asegúrate de que:
1. El mock server está corriendo en `http://localhost:3001`
2. CORS está habilitado en `server.js` (línea `app.use(cors())`)
3. `.env.local` tiene `REACT_APP_API_URL=http://localhost:3001`

### Error: Authorization required (401)

El frontend debe enviar un Bearer token válido. Verifica que:
1. Cognito está correctamente configurado
2. El token de Cognito se obtiene con `fetchAuthSession()`
3. En `interestsApi.ts`, la función `getAuthToken()` funciona correctamente

---

## 🔄 Flujo Completo de Desarrollo

### Terminal 1: Mock Server

```bash
cd /Users/bereniceherrera/tech-platform-frontend/mock-server
npm install  # primera vez
npm start
```

Output esperado:
```
╔════════════════════════════════════════╗
║   Mock Backend Server - Intereses      ║
╠════════════════════════════════════════╣
║  🚀 Server running on port 3001        ║
│  📁 Data file: .../mock-server/data/interests.json
║  🔐 Auth: Bearer token required        ║
║  💾 Data persisted in JSON             ║
╚════════════════════════════════════════╝
```

### Terminal 2: Frontend

```bash
cd /Users/bereniceherrera/tech-platform-frontend
npm start
```

Abre `http://localhost:3000` en el navegador.

### Terminal 3: (Opcional) Monitorear cambios JSON

```bash
watch -n 1 'cat /Users/bereniceherrera/tech-platform-frontend/mock-server/data/interests.json'
```

---

## 📊 Estructura de Datos

Cada interés tiene:

| Campo | Tipo | Rango | Requerido |
|-------|------|-------|-----------|
| `technology` | string | - | ✅ |
| `level` | number | 1-5 | ✅ |

Ejemplo completo:

```json
{
  "technology": "Spring AI",
  "level": 5
}
```

---

## 🚀 Próximos Pasos

Cuando el backend real esté listo:

1. Cambiar `REACT_APP_API_URL` en `.env.local` a la URL del backend real
2. Cambiar autenticación de mock a autenticación real con Cognito
3. Verificar que los tipos de datos sean compatibles
4. Desactivar/eliminar el mock server

---

## 📝 Notas Importantes

- ⚠️ **Mock Only**: Este servidor es SOLO para desarrollo local
- 💾 **Datos en JSON**: Los datos no persisten entre reinicios de máquina (son locales)
- 🔐 **Sin validación real**: La autenticación es simulada (solo Bearer token como string)
- 🚀 **Production-ready**: El backend real (Lambda + DynamoDB) será completamente diferente
