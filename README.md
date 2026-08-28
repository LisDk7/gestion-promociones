# Gestión de Promociones

Aplicación web para registrar y gestionar promociones y descuentos asociados a productos o categorías.

El proyecto fue desarrollado como parte de una prueba técnica para Kódigo Fuente.

## Funcionalidades

- Crear promociones por producto o categoría.
- Configurar descuentos por porcentaje o monto fijo.
- Definir fechas de inicio y finalización.
- Listar promociones.
- Cambiar el estado de las promociones:

  `PROGRAMADA → ACTIVA → FINALIZADA`

- Eliminar promociones únicamente en estado `PROGRAMADA`.
- Validar las reglas de negocio.
- Consultar un resumen de promociones por estado y vigencia.

## Tecnologías

**Frontend**

- React
- Vite
- JavaScript
- CSS

**Backend**

- Node.js
- Express
- PostgreSQL
- Jest
- Supertest
- ESLint

**Infraestructura**

- Docker
- Docker Compose
- GitHub Actions

## Requisitos

Para ejecutar el proyecto con Docker se necesita:

- Git
- Docker Desktop

No es necesario instalar PostgreSQL localmente.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/LisDk7/gestion-promociones.git
cd gestion-promociones
```

### 2. Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
POSTGRES_DB=promociones_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

> El archivo `.env` no se encuentra incluido en el repositorio por seguridad.

### 3. Levantar el proyecto

Desde la raíz:

```bash
docker compose up --build
```

Esto levantará:

- PostgreSQL
- Backend
- Frontend

### 4. Acceder a la aplicación

**Frontend**

```text
http://localhost:5173
```

**Backend**

```text
http://localhost:3000
```

**Health check**

```text
http://localhost:3000/health
```

El endpoint `/health` debe responder con HTTP `200` cuando la aplicación y la base de datos estén disponibles.

### 5. Detener el proyecto

```bash
docker compose down
```

Para eliminar también los datos almacenados en PostgreSQL:

```bash
docker compose down -v
```

## Desarrollo local

Si se desea ejecutar los servicios sin Docker:

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

## Pruebas

Desde `backend`:

```bash
npm test
```

Para ejecutar el linter:

```bash
npm run lint
```

## CI/CD

El proyecto cuenta con un flujo de GitHub Actions organizado en:

```text
Lint → Tests → Build Docker → Smoke Test
```

El Smoke Test levanta la aplicación con Docker Compose y verifica que `/health` responda correctamente.

Las credenciales utilizadas por el pipeline se manejan mediante GitHub Secrets.

## Decisiones técnicas

Las decisiones sobre arquitectura, tecnologías y organización del proyecto se encuentran documentadas en:

`DECISIONS.md`