# 👨‍💻 Guía de Desarrollo

Guía completa para desarrolladores que trabajen en el frontend de Tech Platform.

## 🔐 Autenticación con AWS Cognito

Este proyecto utiliza **AWS Cognito** para autenticación de usuarios.

### ¿Qué es Cognito?

Amazon Cognito es un servicio de AWS que proporciona:
- Registro e inicio de sesión de usuarios
- Verificación de email
- Gestión de tokens JWT
- Integración segura con APIs backend

### Arquitectura de Autenticación

```
Frontend (React)
    ↓ (email/password)
AWS Cognito (User Pool)
    ↓ (JWT token)
Backend API (API Gateway + Lambda)
    ↓ (valida JWT)
DynamoDB / Recursos
```

### Flujo de Login

1. Usuario ingresa email/password en `/login`
2. Frontend llama a Cognito con las credenciales
3. Cognito valida y devuelve JWT token
4. Token se guarda en el navegador (sessionStorage/localStorage)
5. Cada request al backend incluye el token
6. API Gateway valida el token con Cognito
7. Si es válido, se procesa la request

---

## 🎯 Estructura del Proyecto

```
tech-platform-frontend/
├── src/
│   ├── components/         # Átomos, moléculas, organismos y rutas protegidas
│   ├── config/             # Configuración de servicios (Amplify)
│   ├── context/            # Estado global de autenticación
│   ├── features/           # Módulos por dominio (API, servicio, mapper, mock)
│   ├── hooks/              # Estado y acciones reutilizables de React
│   ├── pages/               # Páginas/Vistas
│   ├── shared/api/          # Cliente HTTP común
│   ├── App.js               # Router principal
│   └── index.js
├── mock-server/             # Servidor local opcional para simular la API
├── public/                 # Activos estáticos
├── amplify/               # Configuración de Amplify (generada automáticamente)
├── .env.example           # Template de variables de entorno
├── .amplifyrc             # Configuración de build de Amplify
├── amplify.json           # Metadatos de Amplify
├── package.json           # Dependencias y scripts
└── README.md
```

## 🚀 Iniciando el Desarrollo Local

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd tech-platform-frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno (Cognito)

Las variables de entorno conectan tu frontend a AWS Cognito para autenticación.

**Paso 1: Crear archivo `.env.local`**

```bash
cp .env.example .env.local
```

**Paso 2: Completar con tus valores de Cognito**

Edita `.env.local` y reemplaza los placeholders con tus valores reales:

```env
REACT_APP_AWS_REGION=us-east-1

# Obtén estos valores después de desplegar AuthStack en la infra
# cd ../infra && cdk deploy AuthStack
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxx
REACT_APP_COGNITO_CLIENT_ID=xxxxx
REACT_APP_IDENTITY_POOL_ID=us-east-1:xxxxx
```

**¿Dónde obtener estos valores?**

1. Ve a AWS Console → **Cognito** → **User Pools**
2. Haz clic en tu pool (ej: "UserPool")
3. Copia los valores:
   - **User Pool ID**: En "General settings"
   - **App Client ID**: En "App integration" → "App client settings"
   - **Identity Pool ID**: En AWS Console → **Cognito** → **Identity Pools**

**⚠️ Importante:**
- `.env.local` NO debe ser commiteado (está en `.gitignore`)
- Es específico de tu máquina local
- Cada developer debe crear el suyo con sus propios valores
- En producción, las variables se configuran en Amplify Console

### 4. Iniciar Servidor de Desarrollo

```bash
npm start
```

La aplicación abrirá automáticamente en `http://localhost:3000`

## 📚 Conceptos Clave

### React Router

El enrutamiento se maneja con React Router v7 en `src/App.js`:

```javascript
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
```

### Context API para Autenticación

El contexto global de autenticación (`AuthContext`) proporciona:

```javascript
const { user, isAuthenticated, isLoading, error, login, logout, register } = useAuth();
```

**Uso en componentes:**

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <p>No autenticado</p>;
  return <p>Bienvenido {user.username}</p>;
}
```

### AWS Amplify

Amplify se configura en `src/config/amplify.js` y se importa en `src/App.js`:

```javascript
import './config/amplify';
```

Proporciona:
- Autenticación con Cognito
- Hosting en AWS
- Manejo de variables de entorno

### Rutas Protegidas

El componente `ProtectedRoute` verifica autenticación:

```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

Si el usuario no está autenticado, se redirige a `/login`.

### Arquitectura de intereses

La pantalla `/interests` separa la vista, el estado y el almacenamiento:

```text
UserInterests.jsx
  → TechInterestsForm / AddInterestForm / InterestItem
  → useInterests.js
  → features/interests/services/interests.service.js
  → features/interests/mocks/interests.mock.js
```

- `UserInterests.jsx` conecta la pantalla con las acciones del hook.
- `TechInterestsForm` administra la lista que se muestra y delega las altas y guardados.
- `useInterests.js` gestiona la carga, los estados de error/éxito y vuelve a leer la lista después de una operación.
- `interests.service.js` valida las operaciones y actualmente usa el mock en memoria. Las llamadas de la API real están preparadas, pero comentadas.
- `interests.mock.js` es el almacén temporal. Sus registros usan `{ id, technology, level, description }`. Los cambios existen mientras la aplicación sigue cargada; al reiniciarla, vuelve al conjunto inicial.

El modelo que consume la interfaz usa `name`. El servicio traduce entre `name` y `technology`, así la vista puede trabajar con su modelo y el mock conserva el campo `technology`.

#### Flujo para agregar un interés

1. `AddInterestForm` recoge el nombre y el nivel y notifica a `TechInterestsForm`.
2. `TechInterestsForm` llama a la propiedad `onAdd` recibida desde la página.
3. `UserInterests.jsx` llama a `addInterests` del hook.
4. El hook llama a `createInterest` del servicio, que agrega el registro al mock con `technology`.
5. El hook vuelve a cargar los intereses desde el servicio; esa respuesta actualiza la lista visible.

Para cambiar el almacenamiento por endpoints reales, activa las llamadas correspondientes en `interests.service.js`. Las funciones de endpoint están en `features/interests/api/interests.api.js`; usan `shared/api/http-client.js`, que define la URL base mediante `REACT_APP_API_URL`, adjunta el token si existe y normaliza errores HTTP.

Configura la URL local de API con `REACT_APP_API_URL` en `.env.local`. Su valor por defecto es `http://localhost:3001/api`.

## 🔄 Flujo de Autenticación

### Registro (Register)

1. Usuario llena formulario en `/register`
2. Se validan contraseña y coincidencia
3. Se llama a `register(email, password)` de `useAuth()`
4. Cognito crea el usuario
5. Se envía código de confirmación por email
6. Usuario es redirigido a `/confirm-signup`

### Confirmación de Email (ConfirmSignUp)

1. Usuario ingresa código de confirmación
2. Se llama a `confirmUserSignUp()`
3. Cognito verifica el código
4. Usuario es redirigido a `/login`

### Login

1. Usuario llena formulario en `/login`
2. Se llama a `login(email, password)` de `useAuth()`
3. Cognito genera JWT tokens
4. Usuario es guardado en contexto
5. Usuario es redirigido a `/dashboard`

### Logout

1. Se llama a `logout()` de `useAuth()`
2. Cognito borra tokens
3. Usuario es redirigido a `/login`

## 🛠️ Agregar Nuevos Componentes

### Crear un Componente

```bash
mkdir -p src/components/MyFeature
touch src/components/MyFeature/MyFeature.js
touch src/components/MyFeature/MyFeature.css
```

**Componente:**

```javascript
// src/components/MyFeature/MyFeature.js
import React from 'react';
import './MyFeature.css';

const MyFeature = () => {
  return (
    <div className="my-feature">
      <h2>Mi Funcionalidad</h2>
    </div>
  );
};

export default MyFeature;
```

### Usar el Componente

```javascript
import MyFeature from '../components/MyFeature/MyFeature';

function App() {
  return <MyFeature />;
}
```

## 🎨 Convenciones de Estilos

- Usar CSS modules o CSS tradicional
- Nombres de clase en kebab-case: `.my-component`
- Mobile-first: estilos base para mobile, media queries para desktop
- Variantes de color definidas en variables CSS (futuro)

### Ejemplo de Responsive

```css
.card {
  padding: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }
}
```

## 🧪 Testing

### Ejecutar Tests

```bash
npm test
```

### Escribir Tests

Crear archivo `.test.js` junto al componente:

```javascript
// src/components/Login.test.js
import { render, screen } from '@testing-library/react';
import Login from './Login';

test('muestra el formulario de login', () => {
  render(<Login />);
  expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
});
```

## 🐛 Debugging

### Console.log

```javascript
console.log('Variación de usuario:', user);
```

### React DevTools

Instala la extensión de Chrome:
[React Developer Tools](https://chrome.google.com/webstore)

### Debugger de Chrome

```javascript
debugger;  // La ejecución se pausa aquí
```

## 📦 Build para Producción

```bash
npm run build
```

Esto crea carpeta `build/` optimizada para producción.

## 🌐 Variables de Entorno

### Desarrollo

Usa `.env.local`:

```
REACT_APP_AWS_REGION=us-east-1
REACT_APP_DEBUG=true
```

### Producción (en Amplify)

Configura en Amplify Console → Environment variables

## 🔐 Consideraciones de Seguridad

- ❌ NUNCA hagas commit de `.env.local`
- ❌ NUNCA expongas secrets en el código
- ✅ Usa variables de entorno para todo sensible
- ✅ Valida datos en el frontend (y también en backend)
- ✅ Usa HTTPS en producción

## 📝 Manejo de Errores

### Usuarios

Mostrar mensajes amigables:

```javascript
try {
  await login(email, password);
} catch (err) {
  if (err.name === 'NotAuthorizedException') {
    setError('Correo o contraseña incorrectos');
  } else {
    setError('Error inesperado');
  }
}
```

### Errores de Cognito Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `UserNotConfirmedException` | Usuario no confirmó email | Enviar código de confirmación en `/confirm-signup` |
| `NotAuthorizedException` | Credenciales incorrectas | Verificar email y contraseña |
| `UsernameExistsException` | Email ya registrado | Ir a login o usar otro email |
| `InvalidPasswordException` | Contraseña no cumple requisitos | Usar al menos: 8 caracteres, mayúscula, número, símbolo |
| `InvalidClientTokenId` | Credenciales de AWS inválidas | Revisar `.env.local` con valores correctos |
| `ResourceNotFoundException` | User Pool no existe | Verificar que el User Pool fue deployado en AWS |

## 🚀 Próximas Características

Después de la autenticación básica, implementar:

1. **User Preferences**
   - Seleccionar intereses tecnológicos
   - Guardar preferencias en DynamoDB

2. **Source Management**
   - Buscar y seguir fuentes de contenido
   - Administrar suscripciones

3. **Feed**
   - Mostrar feed personalizado
   - Filtrar por intereses

4. **Perfil de Usuario**
   - Actualizar información personal
   - Cambiar contraseña
   - Eliminar cuenta

## 📖 Recursos Útiles

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 🤝 Estándares de Código

### Nombres

- **Variables/Funciones**: camelCase
- **Componentes**: PascalCase
- **CSS**: kebab-case
- **Archivos**: PascalCase para componentes, minúsculas para utils

### Estructura de Componentes

```javascript
import React, { useState } from 'react';
import './Component.css';

const Component = ({ prop1, prop2 }) => {
  const [state, setState] = useState('');

  const handleEvent = () => {
    // Lógica
  };

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### Comentarios

```javascript
// Comentario de línea única

/**
 * Comentario de múltiples líneas
 * Describe qué hace la función
 * @param {string} param - Descripción del parámetro
 * @returns {boolean} Descripción del retorno
 */
```

## 📞 Contacto

Para preguntas o problemas, contacta al equipo de desarrollo.
