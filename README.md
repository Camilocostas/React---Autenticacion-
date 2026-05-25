# Taller React + json-server-auth + JWT

**Institución:** SENA — Centro de Comercio y Servicios  
**Programa:** Análisis y Desarrollo de Software  
**Instructor:** Raúl Gómez  
**Tecnologías:** React · json-server · json-server-auth · JWT · Axios · React Router

---

## Tabla de contenido

1. [Descripción general](#descripción-general)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Instalación y configuración](#instalación-y-configuración)
5. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
6. [Flujo de autenticación JWT](#flujo-de-autenticación-jwt)
7. [Endpoints disponibles](#endpoints-disponibles)
8. [Pruebas con SoapUI](#pruebas-con-soapui)
9. [Ejercicios del taller](#ejercicios-del-taller)
10. [Usuarios de prueba](#usuarios-de-prueba)

---

## Descripción general

Este proyecto implementa un sistema de autenticación y autorización completo utilizando React en el frontend y json-server-auth como backend simulado. El estándar de autenticación utilizado es **JSON Web Token (JWT)**.

El flujo general es:

```
Usuario ingresa email y contraseña
        ↓
React envía POST /login
        ↓
API valida credenciales
        ↓
Servidor genera JWT
        ↓
React guarda el token en localStorage
        ↓
React envía el token en peticiones protegidas (Bearer header)
```

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework frontend |
| Vite | 8 | Bundler y servidor de desarrollo |
| json-server | 0.17.4 | Backend simulado con REST API |
| json-server-auth | 2.1.0 | Autenticación JWT + bcrypt sobre json-server |
| axios | 1.7 | Cliente HTTP para consumir la API |
| react-router-dom | 6 | Navegación entre rutas |
| cors | 2.8 | Manejo de CORS en el backend |
| SoapUI | 5.7.2 | Pruebas de endpoints REST |

---

## Estructura del proyecto

```
Autenticacion/
├── server.cjs                  # Servidor backend (Node.js + json-server-auth)
├── db.json                     # Base de datos simulada (JSON)
├── rules.json                  # Reglas de autorización por recurso
├── package.json                # Dependencias y scripts
├── vite.config.js              # Configuración de Vite
├── documentacion/
│   ├── pruebas-soapui.txt      # Registro de pruebas realizadas en SoapUI
│   └── evidencias/             # Capturas de pantalla de cada ejercicio
└── src/
    ├── main.jsx                # Punto de entrada — BrowserRouter aquí
    ├── App.jsx                 # Componente raíz — rutas y estado global
    ├── App.css
    ├── index.css
    ├── hooks/
    │   └── useInactividad.js   # Hook personalizado — logout por inactividad
    ├── services/
    │   └── api.js              # Todas las llamadas HTTP centralizadas
    └── components/
        ├── Login.jsx           # Formulario de inicio de sesión
        ├── Register.jsx        # Formulario de registro + enlace de activación
        ├── ProductoLista.jsx   # Lista de productos (ruta protegida)
        ├── Admin.jsx           # Panel de administración de usuarios
        └── ActivarCuenta.jsx   # Activación de cuenta por enlace
```

---

## Instalación y configuración

### Requisitos previos

- Node.js v18 o superior
- npm v9 o superior
- SoapUI 5.7.2 (para pruebas de endpoints)

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Camilocostas/React---Autenticacion-.git
cd React---Autenticacion-

# 2. Instalar todas las dependencias
npm install
```

### Archivos de configuración importantes

**`db.json`** — base de datos inicial:

```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@correo.com",
      "password": "$2a$10$7WgD.qmr0dUsq7sMXTTWQuLE6uZmyhwOOcXDjInCV6Sq8NvMi3Yce",
      "role": "admin",
      "activo": true
    }
  ],
  "productos": [
    { "id": 1, "nombre": "Teclado", "precio": 150000 },
    { "id": 2, "nombre": "Mouse",   "precio": 80000  }
  ],
  "sesiones": [],
  "dashboard": []
}
```

> La contraseña hasheada corresponde a `123456`.

**`rules.json`** — permisos por recurso (código `660` = lectura y escritura solo para autenticados):

```json
{
  "productos": 660,
  "users":     660,
  "sesiones":  660,
  "dashboard": 660
}
```

---

## Cómo ejecutar el proyecto

Abrir **dos terminales** en la raíz del proyecto:

```bash
# Terminal 1 — Backend (puerto 3000)
npm run backend

# Terminal 2 — Frontend (puerto 5173)
npm run dev
```

Verificar que el backend está corriendo:

```
✅ JSON Server Auth corriendo en http://localhost:3000
📦 Endpoints disponibles:
   - POST /login
   - GET /productos (requiere token)
   - GET /users (requiere token)
```

Abrir el navegador en: `http://localhost:5173`

---

## Flujo de autenticación JWT

### ¿Qué es JWT?

JSON Web Token es un estándar (RFC 7519) que define una forma compacta y autocontenida de transmitir información entre partes como un objeto JSON. Se usa para autenticar usuarios sin necesidad de guardar sesiones en el servidor.

Un JWT tiene tres partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjF9.abc123
      HEADER                PAYLOAD    SIGNATURE
```

### Flujo implementado en este proyecto

```
1. Usuario llena el formulario de Login
2. React hace POST /login con { email, password }
3. json-server-auth valida credenciales con bcrypt
4. Si son correctas, devuelve { accessToken, user }
5. React guarda el token en localStorage
6. En cada petición protegida, React agrega el header:
   Authorization: Bearer <token>
7. json-server-auth valida el token antes de responder
8. Si el token es inválido o falta, devuelve 401 Unauthorized
```

### ¿Cómo se protegen los recursos?

Con `rules.json`. El código `660` indica:

- **6** (propietario): lectura + escritura
- **6** (grupo/autenticados): lectura + escritura
- **0** (público): sin acceso

Sin token → `"Missing authorization header"` (401)  
Con token válido → datos del recurso solicitado

---

## Endpoints disponibles

| Método | Endpoint | Autenticación | Descripción |
|---|---|---|---|
| POST | `/register` | No | Crear nuevo usuario |
| POST | `/login` | No | Iniciar sesión, obtener JWT |
| GET | `/productos` | Bearer token | Listar productos |
| GET | `/users` | Bearer token | Listar usuarios (admin) |
| PATCH | `/users/:id` | Bearer token | Editar usuario |
| DELETE | `/users/:id` | Bearer token | Eliminar usuario |
| GET | `/sesiones` | Bearer token | Ver historial de sesiones |
| POST | `/sesiones` | Bearer token | Registrar sesión |
| GET | `/dashboard` | Bearer token | Ver datos del dashboard |

---

## Pruebas con SoapUI

### ¿Qué es SoapUI?

SoapUI es una herramienta de pruebas para APIs REST y SOAP. Permite enviar peticiones HTTP con cualquier método, headers y body, y ver la respuesta del servidor. Es útil para verificar que los endpoints funcionan correctamente antes de integrarlos al frontend.

Descarga: [soapui.org](https://www.soapui.org)

### Configurar un proyecto REST en SoapUI

1. Abrir SoapUI
2. Clic en el ícono **REST** en la barra superior
3. En el campo URI escribir: `http://localhost:3000`
4. Clic en **OK**

### Prueba 1 — POST /login

```
Método:  POST
URL:     http://localhost:3000/login
Headers: Content-Type: application/json
Body:
{
  "email": "admin@correo.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@correo.com",
    "id": 1,
    "role": "admin"
  }
}
```

### Prueba 2 — GET /productos con token

```
Método:  GET
URL:     http://localhost:3000/productos
Headers: Authorization: Bearer <pegar accessToken aquí>
```

Respuesta esperada:

```json
[
  { "id": 1, "nombre": "Teclado", "precio": 150000 },
  { "id": 2, "nombre": "Mouse",   "precio": 80000  }
]
```

### Prueba 3 — GET /productos sin token

```
Método:  GET
URL:     http://localhost:3000/productos
Headers: (ninguno)
```

Respuesta esperada:

```
"Missing authorization header"
```

### Prueba 4 — POST /register

```
Método:  POST
URL:     http://localhost:3000/register
Headers: Content-Type: application/json
Body:
{
  "email": "nuevo@correo.com",
  "password": "1234",
  "role": "user",
  "activo": false
}
```

Respuesta esperada:

```json
{
  "accessToken": "eyJ...",
  "user": {
    "email": "nuevo@correo.com",
    "id": 2,
    "role": "user"
  }
}
```

### Prueba 5 — PATCH /users/:id (editar rol)

```
Método:  PATCH
URL:     http://localhost:3000/users/2
Headers:
  Content-Type: application/json
  Authorization: Bearer <token-de-admin>
Body:
{
  "role": "admin"
}
```

Respuesta esperada: usuario actualizado con el nuevo rol.

### Prueba 6 — DELETE /users/:id

```
Método:  DELETE
URL:     http://localhost:3000/users/2
Headers: Authorization: Bearer <token-de-admin>
```

Respuesta esperada: `200 OK`, usuario eliminado de `db.json`.

---

## Ejercicios del taller

### Ejercicio 1 — Botones condicionales por rol

Muestra los botones **Editar** y **Eliminar** en cada producto únicamente si el usuario autenticado tiene `role === 'admin'`. Un usuario con rol `user` no ve esos botones.

Archivos modificados: `Login.jsx`, `App.jsx`, `ProductoLista.jsx`

### Ejercicio 2 — Registro de usuario

Formulario `Register.jsx` que hace `POST /register` con `email`, `password` y `role`. Valida que el correo no esté duplicado (error 400) y que la contraseña tenga mínimo 4 caracteres.

Archivos creados/modificados: `Register.jsx`, `api.js`, `App.jsx`

### Ejercicio 3 — Logout automático por inactividad

Hook personalizado `useInactividad` que escucha eventos `mousemove`, `keydown`, `click`, `scroll` y `touchstart`. Si no hay actividad en el tiempo configurado (por defecto 2 minutos), limpia el token de `localStorage` y redirige al login mostrando un mensaje de aviso.

Archivos creados/modificados: `hooks/useInactividad.js`, `App.jsx`

### Ejercicio 4 — Panel de administración de usuarios

Vista `Admin.jsx` accesible solo para `role === 'admin'`. Muestra una tabla con todos los usuarios desde `GET /users`, permite editar el rol con `PATCH /users/:id` y eliminar usuarios con `DELETE /users/:id`.

Archivos creados/modificados: `Admin.jsx`, `api.js`, `App.jsx`

### Ejercicio 5 — Activación de cuenta con enlace

Tras el registro, se muestra un enlace simulado `/activar/:id?token=...`. Al hacer clic navega a `ActivarCuenta.jsx` que hace `PATCH /users/:id` con `{ activo: true }`. Usa React Router para manejar la ruta dinámica.

Archivos creados/modificados: `ActivarCuenta.jsx`, `Register.jsx`, `main.jsx`, `App.jsx`, `api.js`

### Ejercicio 6 — Dashboard por usuario *(pendiente)*

Vista que carga datos específicos del usuario autenticado usando su `id` extraído del token.

### Ejercicio 7 — Historial de sesiones *(pendiente)*

Registra cada inicio de sesión con `POST /sesiones` incluyendo `userId` y `timestamp`. Muestra el historial con `GET /sesiones?userId=ID`.

### Ejercicio 8 — Cerrar sesión con redirect *(pendiente)*

Elimina el token, redirige al login y muestra un mensaje de confirmación de cierre de sesión.

---

## Usuarios de prueba

| Email | Contraseña | Rol | Descripción |
|---|---|---|---|
| admin@correo.com | 123456 | admin | Usuario administrador inicial |
| user@correo.com | 123456 | user | Usuario sin privilegios de admin |

> Para agregar `user@correo.com` detén el backend, edita `db.json` manualmente y vuelve a iniciarlo. La contraseña hasheada es la misma que la de admin (equivale a `123456`).

---

## Notas técnicas

- `server.cjs` usa CommonJS (`require`) con import dinámico para compatibilizar con json-server que es ESM.
- Las contraseñas nunca se guardan en texto plano — json-server-auth las hashea automáticamente con bcrypt.
- El token JWT se guarda en `localStorage`. En producción real se recomienda usar `httpOnly cookies`.
- `rules.json` usa el sistema de permisos numérico de json-server-auth (similar a permisos Unix).
- `useCallback` en `App.jsx` es necesario para evitar que el hook `useInactividad` se re-ejecute en cada render.