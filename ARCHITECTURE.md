# 🏗️ Arquitectura del Frontend - Tech Platform

Documento de arquitectura y decisiones técnicas para el frontend de Tech Platform.

## 📊 Visión General

```
┌─────────────────────────────────────────────────┐
│              Navegador del Usuario              │
│  ┌────────────────────────────────────────────┐ │
│  │         Tech Platform React App            │ │
│  │  ┌──────────────────────────────────────┐  │ │
│  │  │      React Router (v7)               │  │ │
│  │  │  Routes:                             │  │ │
│  │  │  - /login (público)                  │  │ │
│  │  │  - /register (público)               │  │ │
│  │  │  - /confirm-signup (público)         │  │ │
│  │  │  - /dashboard (protegido)            │  │ │
│  │  └──────────────────────────────────────┘  │ │
│  │                     ↓                       │ │
│  │  ┌──────────────────────────────────────┐  │ │
│  │  │  AuthContext (React Context API)     │  │ │
│  │  │  - user: Información del usuario     │  │ │
│  │  │  - isAuthenticated: Estado de auth   │  │ │
│  │  │  - Funciones: login, logout, register│  │ │
│  │  └──────────────────────────────────────┘  │ │
│  │                     ↓                       │ │
│  │  ┌──────────────────────────────────────┐  │ │
│  │  │  AWS Amplify Configuration           │  │ │
│  │  │  - Autenticación con Cognito         │  │ │
│  │  │  - Hosting en Amplify                │  │ │
│  │  └──────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │    AWS Amplify Console         │
        │  - Build y Deploy              │
        │  - Hosting CDN                 │
        │  - Integración con Cognito     │
        └────────────────────────────────┘
                         ↓
    ┌─────────────────────────────────────────┐
    │  Amazon Cognito User Pool              │
    │  - Autenticación de usuarios            │
    │  - Generación de tokens JWT             │
    │  - Gestión de sesiones                  │
    │  - Confirmación de email                │
    └─────────────────────────────────────────┘
                         ↓
    ┌─────────────────────────────────────────┐
    │  APIs Backend (futuro)                  │
    │  - API Gateway                          │
    │  - Lambda Functions                     │
    │  - DynamoDB (User Preferences, Sources) │
    └─────────────────────────────────────────┘
```

## 🎯 Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 19.3.0 | Framework UI |
| **React Router** | 7.18.3 | Enrutamiento del lado del cliente |
| **AWS Amplify** | 6.20.0 | Integración con servicios AWS |
| **React Scripts** | 5.0.1 | Build tools y dev server |

### Infraestructura

| Servicio | Propósito |
|---------|----------|
| **AWS Amplify** | Hosting, CI/CD, CDN |
| **Amazon Cognito** | Autenticación y gestión de usuarios |
| **GitHub** | Control de versión y trigger para CI/CD |

## 🔐 Flujo de Autenticación

### 1. Registro

```
Usuario → Página de Registro
           ↓
    Completa: Email + Contraseña
           ↓
    Frontend valida contraseña
           ↓
    signUp() de Amplify
           ↓
    Cognito crea usuario
           ↓
    Envía código a Email
           ↓
    Usuario → Página de Confirmación
           ↓
    Ingresa código
           ↓
    confirmSignUp() de Amplify
           ↓
    Cognito confirma usuario
           ↓
    Usuario → Login
```

### 2. Login

```
Usuario → Página de Login
           ↓
    Completa: Email + Contraseña
           ↓
    signIn() de Amplify
           ↓
    Cognito autentica
           ↓
    ✅ Retorna: JWT Tokens
    - ID Token (identidad del usuario)
    - Access Token (acceso a APIs)
    - Refresh Token (renovación)
           ↓
    Frontend guardaTokens
           ↓
    AuthContext actualiza state
           ↓
    Redirige a Dashboard
```

### 3. Acceso Protegido

```
Usuario Autenticado → Solicita /dashboard
                      ↓
                ProtectedRoute valida
                      ↓
             ¿Es autenticado?
                      ↓
                   SÍ → Muestra Dashboard
                      ↓
                      NO → Redirige a /login
```

### 4. Logout

```
Usuario → Click "Cerrar Sesión"
           ↓
    signOut() de Amplify
           ↓
    Cognito invalida sesión
           ↓
    Frontend limpia tokens
           ↓
    AuthContext actualiza state
           ↓
    Redirige a /login
```

## 📁 Estructura de Carpetas

```
src/
├── components/
│   └── ProtectedRoute.js
│       Componente que envuelve rutas protegidas
│       - Verifica autenticación
│       - Redirige si no está autenticado
│
├── config/
│   └── amplify.js
│       Inicializa Amplify con variables de entorno
│       - Configura Cognito
│       - Configura región de AWS
│
├── context/
│   └── AuthContext.js
│       Context API para estado global de autenticación
│       - Provider: envuelve la app
│       - Hook: useAuth() para usar en componentes
│       - Estado: user, isLoading, error
│       - Funciones: login, logout, register, confirmSignUp
│
├── pages/
│   ├── Login.js
│   │   Página de inicio de sesión
│   │   - Formulario email + contraseña
│   │   - Validación en cliente
│   │   - Manejo de errores de Cognito
│   │
│   ├── Register.js
│   │   Página de registro
│   │   - Formulario email + contraseña + confirmación
│   │   - Validación de contraseña (8+, mayús, número, símbolo)
│   │   - Gestión de errores
│   │
│   ├── ConfirmSignUp.js
│   │   Página de confirmación de email
│   │   - Entrada de código de confirmación
│   │   - Comunicación con Cognito
│   │
│   ├── Dashboard.js
│   │   Página principal (protegida)
│   │   - Información del usuario autenticado
│   │   - Botón de logout
│   │   - Estructura para futuras funcionalidades
│   │
│   ├── Auth.css
│   │   Estilos para páginas de autenticación
│   │
│   └── Dashboard.css
│       Estilos para el dashboard
│
├── App.js
│   Punto de entrada principal
│   - Configura Router (React Router)
│   - Define todas las rutas
│   - Envuelve app en AuthProvider
│   - Maneja redirecciones
│
├── App.css
│   Estilos globales
│
└── index.js
    Renderiza React a DOM
```

## 🔄 Flujo de Datos

### Estado Global (AuthContext)

```javascript
{
  user: {
    username: "usuario@email.com",
    userId: "us-east-1_abc123xyz-abc-123",
    attributes: { email: "usuario@email.com" }
  },
  isAuthenticated: true,
  isLoading: false,
  error: null
}
```

### Props Descendentes

```
App.js
├── AuthProvider (proporciona contexto)
│   ├── Login (usa useAuth())
│   ├── Register (usa useAuth())
│   ├── ConfirmSignUp (usa useAuth())
│   └── ProtectedRoute
│       └── Dashboard (usa useAuth())
```

## 🛡️ Medidas de Seguridad

### Frontend

- ✅ Validación de contraseña antes de enviar
- ✅ Protección de rutas con ProtectedRoute
- ✅ Manejo seguro de tokens (almacenados por Amplify)
- ✅ Redirección automática a login si no está autenticado
- ✅ Variables sensibles en `.env.local` (no en código)

### Cognito

- ✅ Políticas de contraseña fuertes
- ✅ Verificación de email
- ✅ Tokens JWT con expiración
- ✅ Refresh tokens para renovación segura

### AWS

- ✅ HTTPS obligatorio en Amplify
- ✅ IAM roles para acceso mínimo requerido
- ✅ Encriptación de datos en tránsito

## 📱 Responsividad

La aplicación está optimizada para:

- 📱 Móvil (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1024px+)

Usando media queries en CSS:

```css
@media (max-width: 768px) {
  /* Estilos para móvil/tablet */
}
```

## 🎨 Paleta de Colores

```
Gradiente Principal: #667eea → #764ba2
Blanco: #ffffff
Gris Oscuro: #333
Gris: #666
Error: #c00
Fondo: #f5f7fa
```

## 🚀 Despliegue

### Pipeline CI/CD

```
git push → GitHub
           ↓
        Amplify detecta push
           ↓
        npm install
           ↓
        npm run build
           ↓
        Tests (futuro)
           ↓
        Deploy a CDN
           ↓
        ✅ App disponible en URL pública
```

### Variables de Entorno

Configuradas en Amplify Console:

```
REACT_APP_AWS_REGION
REACT_APP_COGNITO_USER_POOL_ID
REACT_APP_COGNITO_CLIENT_ID
REACT_APP_IDENTITY_POOL_ID
```

## 📈 Escalabilidad

### Presente
- Single page application (SPA)
- Client-side routing
- Almacenamiento local de tokens

### Futuro
- Service Workers para offline support
- Progressive Web App (PWA)
- Code splitting por rutas
- Lazy loading de componentes

## 🔗 Integración Backend

### Próximas Conexiones

Una vez completada esta historia, se conectarán:

1. **User Preferences API**
   - Guardar/obtener intereses del usuario
   - Endpoint: `/api/users/{userId}/preferences`

2. **Source Management API**
   - Gestionar suscripciones a fuentes
   - Endpoint: `/api/users/{userId}/sources`

3. **Feed API**
   - Obtener feed personalizado
   - Endpoint: `/api/users/{userId}/feed`

### Autenticación en APIs

Cada request incluirá:

```javascript
const config = {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
};
```

Donde `accessToken` viene del JWT de Cognito.

## 📊 Monitoreo y Logs

### Amplify Console

- Build logs
- Deploy logs
- Métricas de rendimiento
- Errores en runtime

### CloudWatch

- Logs de Cognito
- Métricas de autenticación

### Browser Console

- Errores de JavaScript
- Warnings de React
- Network requests

## 🎯 Métricas de Éxito

- ✅ Tiempo de carga < 3s
- ✅ Tasa de registro exitoso > 95%
- ✅ Tasa de login exitoso > 98%
- ✅ Disponibilidad > 99.5%
- ✅ Zero vulnerabilidades de seguridad

## 📚 Decisiones Arquitectónicas

### ¿Por qué React Router?

- Estándar de la industria para SPAs
- Soporte para rutas protegidas
- Buena integración con React Context

### ¿Por qué AWS Amplify?

- Simplifica integración con Cognito
- CI/CD automático
- Hosting con CDN global
- Escalabilidad automática

### ¿Por qué Context API en lugar de Redux?

- Requisitos simples (solo estado de autenticación)
- Menos boilerplate
- Suficiente para esta fase
- Redux se puede agregar si crece el estado

### ¿Por qué Email + Contraseña?

- Más simple que OAuth para MVP
- Cognito proporciona todo lo necesario
- Más control sobre el flujo de registro

## 🔮 Roadmap Futuro

```
Fase 1 (Actual)
└── Autenticación básica ✅

Fase 2 (Próxima)
├── User Preferences
├── Source Management
└── Feed personalizado

Fase 3
├── Búsqueda avanzada
├── Recomendaciones IA
└── Notificaciones

Fase 4
├── Sharing social
├── Comentarios
└── Comunidad
```

## 📞 Contacto y Soporte

Para preguntas sobre la arquitectura:
- Revisar [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Abrir issue en GitHub
- Contactar al equipo de desarrollo
