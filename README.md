# Tech Platform - Frontend

Aplicación React moderna para la plataforma de gestión de contenido tecnológico con autenticación integrada.

**Independiente de proveedor**: Funciona con cualquier backend de autenticación REST.

## 📋 Requisitos

- Node.js 16+ y npm

## 🚀 Inicio Rápido

### 1. Instalación

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Variables disponibles:
- `REACT_APP_API_URL` - URL base del backend (default: `http://localhost:3001`)

### 3. Ejecutar en Desarrollo

```bash
npm start
```

La aplicación abrirá en `http://localhost:3000`

### 4. Build para Producción

```bash
npm run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   └── ProtectedRoute.js      # Componente para proteger rutas
├── context/
│   └── AuthContext.js         # Context de autenticación (REST API)
├── pages/
│   ├── Auth.css               # Estilos de autenticación
│   ├── ConfirmSignUp.js       # Página de confirmación de email
│   ├── Dashboard.css          # Estilos del dashboard
│   ├── Dashboard.js           # Página principal (protegida)
│   ├── Login.js               # Página de login
│   └── Register.js            # Página de registro
├── App.js                     # Router principal
└── App.css                    # Estilos globales
```

## 🔐 Funcionalidades Implementadas

### ✅ Autenticación

- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nuevas cuentas de usuario
- **Confirmación de Email**: Flujo de verificación de correo
- **Logout**: Cierre de sesión seguro

### ✅ Gestión de Sesión

- Protección de rutas que requieren autenticación
- Redirección automática a login si no está autenticado
- Redirección automática a dashboard si ya está autenticado
- Mantenimiento de sesión al recargar

### ✅ Dashboard

- Página de bienvenida para usuarios autenticados
- Muestra información del usuario
- Botón de logout
- Estructura lista para agregar funcionalidades futuras

## 🔗 Endpoints Requeridos en Backend

El frontend espera estos endpoints REST:

| Método | Endpoint | Payload | Response |
|--------|----------|---------|----------|
| POST | `/api/auth/register` | `{ email, password }` | `{ success: bool, message: string }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ isSignedIn: bool, user: {...} }` |
| POST | `/api/auth/logout` | - | `{ success: bool }` |
| POST | `/api/auth/confirm` | `{ email, code }` | `{ success: bool }` |

## 📝 Flujos de Usuario

### Nuevo Usuario (Registro)

1. Usuario accede a `/register`
2. Completa formulario con email y contraseña
3. Se valida el formato de email y contraseña
4. Se envía solicitud a `POST /api/auth/register`
5. Usuario ingresa código de confirmación en `/confirm-signup`
6. Se envía a `POST /api/auth/confirm`
7. Redirigido a `/login` para iniciar sesión

### Usuario Existente (Login)

1. Usuario accede a `/login`
2. Ingresa email y contraseña
3. Se envía solicitud a `POST /api/auth/login`
4. Si es correcto, se guarda la sesión del usuario
5. Redirigido a `/dashboard`

### Usuario Autenticado

1. Puede acceder a todas las rutas protegidas
2. Su información está disponible en el contexto de autenticación
3. Los datos del usuario pueden usarse para llamadas a APIs backend

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo

```bash
npm start
```

### Build para producción

```bash
npm run build
```

### Ejecutar pruebas

```bash
npm test
```

## 🌐 Despliegue

### Opción 1: Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Opción 3: Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 en uso

```bash
PORT=3001 npm start
```

### CORS errors

Verifica que tu backend tenga CORS habilitado para el origen del frontend.

## 📚 Recursos Adicionales

- [React Router Documentation](https://reactrouter.com/)
- [React Hooks Guide](https://react.dev/reference/react)
- [Context API Documentation](https://react.dev/reference/react/useContext)

## 🤝 Próximos Pasos

Esta es la puerta de entrada a toda la plataforma. Una vez completada esta historia, se pueden desarrollar:

1. **User Preferences** - Gestión de intereses tecnológicos
2. **Source Management** - Seguimiento de fuentes de contenido
3. **Feed Service** - Feed personalizado basado en preferencias
4. **Recommendation Engine** - Recomendaciones de contenido

## 📄 Licencia

Proyecto privado para la plataforma de gestión de contenido tecnológico.
