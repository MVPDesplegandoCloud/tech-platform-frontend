# Tech Platform - Frontend

Aplicación React moderna para la plataforma de gestión de contenido tecnológico con autenticación integrada.

## 📋 Requisitos

- Node.js 14+ y npm

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

Configura las variables según tu infraestructura de autenticación.

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
├── config/
│   └── amplify.js             # Configuración de AWS Amplify
├── context/
│   └── AuthContext.js         # Context de autenticación
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
- Muestra información del usuario (username, userId)
- Botón de logout
- Estructura lista para agregar funcionalidades futuras:
  - Gestión de intereses
  - Seguimiento de fuentes
  - Feed personalizado
  - Perfil de usuario

## 📝 Flujos de Usuario

### Nuevo Usuario (Registro)

1. Usuario accede a `/register`
2. Completa formulario con email y contraseña
3. Se valida la contraseña (8+ caracteres, mayúscula, número, carácter especial)
4. Se envía código de confirmación al email
5. Usuario ingresa código en `/confirm-signup`
6. Redirigido a `/login` para iniciar sesión

### Usuario Existente (Login)

1. Usuario accede a `/login`
2. Ingresa email y contraseña
3. Amazon Cognito verifica credenciales
4. Si es correcto, se genera JWT token
5. Redirigido a `/dashboard`

### Usuario Autenticado

1. Puede acceder a todas las rutas protegidas
2. Su información está disponible en el contexto de autenticación
3. El `userId` se puede usar para llamadas a APIs backend

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

## 🌐 Despliegue en AWS Amplify

### 1. Conectar repositorio GitHub

```bash
amplify init
```

Sigue las instrucciones para conectar tu repositorio.

### 2. Agregar hosting

```bash
amplify add hosting
```

Elige:
- Hosting with Amplify Console
- Manual deployment o Git-based deployment

### 3. Publicar

```bash
amplify publish
```

Esto construirá y desplegará la aplicación en AWS Amplify.

## 🔑 Configuración de Cognito Recomendada

### Políticas de Contraseña

- Mínimo 8 caracteres
- Requiere mayúsculas
- Requiere números
- Requiere símbolos especiales

### Atributos de Usuario

- Email (requerido)
- Verificación de email automática

### Flujo de Autenticación

- USER_PASSWORD_AUTH (para login)
- ALLOW_USER_PASSWORD_AUTH (para apps)

## 🐛 Solución de Problemas

### Error: "Amplify is not configured"

Asegúrate de que tu `.env.local` tiene los valores correctos de Cognito.

### Error: "User not found"

Verifica que el usuario está confirmado en Cognito.

### Error: "Invalid client id"

Confirma que el `REACT_APP_COGNITO_CLIENT_ID` es correcto.

## 📚 Recursos Adicionales

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Próximos Pasos

Esta es la puerta de entrada a toda la plataforma. Una vez completada esta historia, se pueden desarrollar:

1. **User Preferences** - Gestión de intereses tecnológicos
2. **Source Management** - Seguimiento de fuentes de contenido
3. **Feed Service** - Feed personalizado basado en preferencias
4. **Recommendation Engine** - Recomendaciones de contenido

## 📄 Licencia

Proyecto privado para la plataforma de gestión de contenido tecnológico.
