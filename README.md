# Sistema de Autenticación - Beauty & Skin Care

Sistema de inicio de sesión y registro para el sitio web de Beauty & Skin Care, integrado con la base de datos `beauty_care.sql`.

## Características

- **Inicio de Sesión**: Los usuarios pueden iniciar sesión con su correo electrónico y contraseña.
- **Registro**: Nuevos usuarios pueden crear una cuenta con sus datos personales.
- **Seguridad**: Contraseñas encriptadas con bcrypt y tokens JWT para autenticación.
- **Base de Datos**: Sistema SQLite integrado que replica la estructura de `beauty_care.sql`.
- **Diseño Responsivo**: Totalmente adaptado para dispositivos móviles y escritorio.
- **Integración Visual**: El sistema de autenticación se integra perfectamente con el diseño existente del sitio.

## Requisitos

- Node.js 14 o superior
- npm (incluido con Node.js)

## Instalación

1. Navega a la carpeta del proyecto:
   ```bash
   cd beauty-care-auth
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor:
   ```bash
   npm start
   ```

4. Abre tu navegador y visita:
   ```
   http://localhost:3000
   ```

## Usuarios de Prueba

### Administrador
- **Correo**: admin@beautysite.com
- **Contraseña**: admin123

## Estructura del Proyecto

```
beauty-care-auth/
├── config/
│   └── database.js       # Configuración de base de datos
├── middleware/
│   └── auth.js           # Middleware de autenticación
├── public/
│   ├── css/
│   │   └── styles.css    # Estilos del sitio
│   ├── js/
│   │   └── auth.js       # JavaScript de autenticación
│   └── index.html        # Página principal
├── routes/
│   └── auth.js           # Rutas de autenticación
├── server.js             # Servidor principal
└── package.json          # Dependencias del proyecto
```

## API de Autenticación

### Registrar Usuario
```
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "telefono": "123456789",
  "password": "contraseña123",
  "confirmPassword": "contraseña123"
}
```

### Iniciar Sesión
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "password": "contraseña123"
}
```

### Verificar Sesión
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Cerrar Sesión
```
POST /api/auth/logout
```

## Base de Datos

El sistema utiliza SQLite para almacenar los datos. La base de datos se crea automáticamente al iniciar el servidor con la siguiente estructura:

### Tabla usuarios
- `id_usuario`: ID único del usuario
- `nombre`: Nombre del usuario
- `apellido`: Apellido del usuario
- `email`: Correo electrónico único
- `telefono`: Número de teléfono
- `password_hash`: Contraseña encriptada
- `rol`: 'cliente' o 'admin'
- `fecha_creacion`: Fecha de registro

### Tabla servicios
- `id_servicio`: ID único del servicio
- `nombre`: Nombre del servicio
- `descripcion`: Descripción detallada
- `precio`: Precio del servicio
- `duracion_minutos`: Duración estimada
- `activo`: Estado del servicio

### Tabla citas
- `id_cita`: ID único de la cita
- `id_usuario`: ID del usuario que reserva
- `id_servicio`: ID del servicio reservado
- `fecha_cita`: Fecha y hora de la cita
- `estado`: 'pendiente', 'confirmada', 'completada', 'cancelada'
- `notas`: Notas adicionales

## Tecnologías Utilizadas

- **Express.js**: Framework de servidor web
- **SQLite**: Base de datos ligera
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Generación de tokens JWT
- **cookie-parser**: Manejo de cookies

## Personalización

### Colores
Los colores principales pueden modificarse en el archivo `public/css/styles.css` en la sección `:root`:

```css
:root {
    --primary-color: #D8B4A0;      /* Color principal */
    --primary-dark: #C4A090;       /* Color principal oscuro */
    --secondary-color: #FFB7B2;    /* Color secundario */
    /* ... más colores */
}
```

### JWT Secret
Para cambiar la clave secreta de JWT, establece la variable de entorno:
```bash
JWT_SECRET=tu-clave-secreta npm start
```

## Licencia

Este proyecto fue creado por MiniMax Agent.
