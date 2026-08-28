# Decisiones técnicas

## Contexto

Para esta prueba técnica decidí construir una aplicación web sencilla para la gestión de promociones, teniendo como prioridad que fuera fácil de entender, mantener y ejecutar.

La elección de las tecnologías parte de herramientas con las que ya tengo experiencia. Durante mis prácticas profesionales he trabajado en desarrollo Full Stack, manejo de APIs, bases de datos, Git y trabajo bajo metodologías ágiles, por lo que busqué aplicar esos conocimientos en un proyecto pequeño pero completo.

---

## Frontend: React + Vite

Elegí React porque permite construir interfaces mediante componentes reutilizables y es una tecnología con la que tengo experiencia.

Para este proyecto separé la interfaz en componentes relacionados con las promociones, principalmente el formulario y la tabla. Esto permite mantener una estructura clara y facilita realizar cambios sin afectar toda la aplicación.

Utilicé Vite como herramienta de desarrollo y construcción porque permite trabajar con React de forma sencilla y proporciona un servidor de desarrollo rápido.

No utilicé una librería de componentes externa porque, para el alcance de esta prueba, no era necesario. Preferí mantener una interfaz sencilla utilizando CSS propio.

---

## Backend: Node.js + Express

Para el backend elegí Node.js con Express.

La elección se debe principalmente a que permite crear una API REST de forma sencilla y es adecuada para el tamaño de este proyecto.

Organicé el backend separando las responsabilidades en:

- Rutas
- Controladores
- Servicios
- Middlewares
- Configuración de base de datos

Esta separación evita concentrar toda la lógica en un solo archivo y facilita el mantenimiento y las pruebas.

También utilicé middlewares para las validaciones relacionadas con las promociones y para controlar las reglas asociadas a los cambios de estado.

## Base de datos: PostgreSQL

Elegí PostgreSQL porque es una base de datos relacional adecuada para la información que maneja el sistema.

La aplicación utiliza diferentes entidades relacionadas entre sí:

- Productos
- Categorías
- Promociones

Utilizar una base de datos relacional permite mantener estas relaciones de manera clara y evitar almacenar información repetida.

La estructura permite que una promoción pueda estar asociada a un producto o a una categoría, de acuerdo con los requerimientos de la prueba.
## Reglas de negocio

Una parte importante del proyecto fue controlar correctamente el ciclo de vida de una promoción.

Las promociones manejan tres estados:

```text
PROGRAMADA → ACTIVA → FINALIZADA