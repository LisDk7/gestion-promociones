# Decisiones técnicas

## Frontend: React + Vite

Se eligió React con Vite porque React es una tecnología ampliamente utilizada
para construir interfaces web modernas y permite desarrollar componentes
reutilizables de manera sencilla.

Vite se utiliza como herramienta de construcción y desarrollo debido a su
rápido servidor de desarrollo y su configuración sencilla.

## Backend: Node.js + Express

Se eligió Node.js como tecnología backend porque permite construir APIs REST
de manera eficiente utilizando JavaScript.

Express se utiliza como framework HTTP para organizar las rutas, controladores
y middleware de la aplicación de forma sencilla.

## Base de datos: PostgreSQL

Se eligió PostgreSQL porque es un sistema de gestión de bases de datos
relacional robusto y adecuado para manejar las relaciones entre categorías,
productos y promociones.

La estructura utiliza claves foráneas y restricciones SQL para garantizar la
integridad de los datos.

## Pruebas: Jest + Supertest

Se utilizaron Jest y Supertest para implementar pruebas automatizadas de los
endpoints del backend.

Las pruebas verifican:

- Health check de la aplicación.
- Listado de promociones.
- Creación de promociones.
- Validaciones de promociones.
- Transiciones de estado.
- Eliminación de promociones.
- Consulta de promociones por ID.
- Resumen de promociones.

## Contenedores: Docker

Se utiliza Docker para garantizar un entorno reproducible y facilitar el
levantamiento de la aplicación junto con PostgreSQL.

El objetivo es que frontend, backend y base de datos puedan ejecutarse mediante
Docker Compose.

## CI/CD: GitHub Actions

Se utilizará GitHub Actions para automatizar el proceso de validación del
proyecto.

El flujo definido será:

lint → test → build → smoke test

El smoke test levantará la aplicación mediante Docker Compose y verificará que
el endpoint `/health` responda correctamente.