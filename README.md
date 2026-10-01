# Tech Platform - Frontend

Aplicación React moderna para la plataforma de gestión de contenido tecnológico con autenticación integrada via **AWS Cognito**.

## ⚡ Stack Tecnológico

- **Frontend**: React 18 con React Router 7
- **Autenticación**: AWS Cognito + AWS Amplify Auth
- **Estado Global**: React Context API
- **Hosting**: AWS Amplify (integración con GitHub)

## 📋 Requisitos

- Node.js 16+ y npm
- Cuenta AWS con Cognito User Pool configurado

## 🚀 Inicio Rápido

### 1. Clonar Repositorio

```bash
git clone <repository-url>
cd tech-platform-frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar AWS Cognito

#### Opción A: Ya tienes Cognito deployado

1. Obtén tus valores de Cognito:
   - **User Pool ID**: `us-east-1_xxxxx`
   - **Client ID**: `xxxxx`
   - **Identity Pool ID**: `us-east-1:xxxxx`

2. Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

3. Edita `.env.local` con tus valores:

```env
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxx
REACT_APP_COGNITO_CLIENT_ID=xxxxx
REACT_APP_IDENTITY_POOL_ID=us-east-1:xxxxx
```

#### Opción B: Necesitas crear Cognito primero

Ver [Infraestructura](#-infraestructura-cognito) abajo.

### 4. Ejecutar en Desarrollo

```bash
npm start
```

La aplicación abrirá en `http://localhost:3000`

### 5. Build para Producción

```bash
npm run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   └── ProtectedRoute.js      # Componente para proteger rutas
├── config/
│   └── amplify.js             # Configuración de AWS Amplify
├── context/
│   └── AuthContext.js         # Context de autenticación (Cognito)
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

## 🔐 Autenticación con AWS Cognito

### ¿Qué es Cognito?

Amazon Cognito proporciona:
- ✅ Registro e inicio de sesión seguro
- ✅ Verificación de email automática
- ✅ Gestión de tokens JWT
- ✅ Integración con APIs backend

### Arquitectura

```
Frontend (React/Amplify)
    ↓ (email/password)
AWS Cognito User Pool
    ↓ (JWT token)
API Gateway + Lambda (Backend)
    ↓ (valida JWT)
DynamoDB
```

### Flujo de Autenticación

**Login:**
1. Usuario ingresa credenciales
2. Amplify llama a Cognito
3. Cognito devuelve JWT token
4. Token se guarda en el navegador
5. Redirige a `/dashboard`

**Registro:**
1. Usuario completa formulario
2. Cognito crea usuario y envía código por email
3. Usuario confirma código en `/confirm-signup`
4. Redirige a `/login`

---

## 🏗️ Infraestructura Cognito

**IMPORTANTE**: Antes de ejecutar el frontend, necesitas tener Cognito deployado.

### Desplegar Cognito

Desde el repo de infraestructura:

```bash
cd ../infra  # O donde esté tu carpeta de infra
npm install
cdk bootstrap  # Primera vez solo
cdk deploy AuthStack
```

Esto creará:
- ✅ Cognito User Pool
- ✅ App Client
- ✅ Identity Pool

**Copia los Outputs** (al final del deploy):
```
AuthStack.CFUserPool = us-east-1_xxxxx
AuthStack.CFUserPoolClient = xxxxx
AuthStack.CFIdentityPool = us-east-1:xxxxx
```

---

## 🔐 Funcionalidades Implementadas

### ✅ Autenticación

- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nuevas cuentas
- **Confirmación de Email**: Flujo de verificación automático
- **Logout**: Cierre de sesión seguro

### ✅ Gestión de Sesión

- 🔒 Protección de rutas autenticadas
- 🔄 Redirección automática a login si no está autenticado
- 💾 Mantenimiento de sesión al recargar
- ⚡ Validación de tokens con Cognito

### ✅ Dashboard

- Página de bienvenida para usuarios autenticados
- Información del usuario
- Botón de logout
- Lista para nuevas funcionalidades

---

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm start       # Inicia servidor de desarrollo (puerto 3000)
npm run build   # Build para producción
npm test        # Ejecuta tests
npm run eject   # (Cuidado: irreversible)
```

### Usar el Contexto de Autenticación

```javascript
import { useAuth } from '../context/AuthContext';

export const MiComponente = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>No autenticado</p>;
  }

  return (
    <div>
      <p>Bienvenido {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Variables de Entorno Disponibles

```env
REACT_APP_AWS_REGION              # Región AWS (default: us-east-1)
REACT_APP_COGNITO_USER_POOL_ID    # ID del User Pool
REACT_APP_COGNITO_CLIENT_ID       # ID del App Client
REACT_APP_IDENTITY_POOL_ID        # ID del Identity Pool
```

---

## 🌐 Despliegue en Producción

### Opción 1: AWS Amplify (Recomendado)

Amplify Hosting se conecta automáticamente a GitHub:

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Haz clic en "New app" → "Host web app"
3. Selecciona GitHub y este repositorio
4. Configura variables de entorno (en Amplify Console)
5. Deploy automático en cada push a `main`

### Opción 1: AWS Amplify (Recomendado)

Configura el hosting desde AWS Amplify Console:

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Haz clic en "New app" → "Host web app"
3. Selecciona GitHub y este repositorio
4. Configura variables de entorno (en Amplify Console)
5. Deploy automático en cada push a `main`

### Opción 2: Vercel

```bash
npm install -g vercel
vercel
```

### Opción 3: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "REACT_APP_COGNITO_USER_POOL_ID is undefined"

- ✅ Verifica que `.env.local` exista
- ✅ Verifica que tengas los valores correctos
- ✅ Reinicia el servidor (`npm start`)

### Error de Cognito: "InvalidClientTokenId"

- ✅ Los valores en `.env.local` son inválidos
- ✅ Verifica en AWS Console que el User Pool existe
- ✅ Copia nuevamente los valores corretos

### Puerto 3000 en uso

```bash
PORT=3001 npm start
```

---

## 📚 Recursos Útiles

- [React Docs](https://react.dev/)
- [React Router Docs](https://reactrouter.com/)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Guía completa para desarrolladores

---

## 🤝 Contribuir

Para cambios en autenticación o configuración de Cognito, revisa [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).

---

## 📄 Licencia

Proyecto privado para Tech Platform.
