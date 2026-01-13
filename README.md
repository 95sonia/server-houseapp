# HouseApp Server - API Backend

Este es el servidor de **HouseApp**, una aplicación de gestión de alquileres vacacionales que permite a los usuarios explorar viviendas en zonas como el País Vasco, Cantabria y el Mediterráneo, realizar reservas y guardar en favoritos. El administrador puede gestionar las viviendas (crear, editar, eliminar), gestionar las reservas realizadas y los usuarios de la app.

## Tecnologías utilizadas

* **Node.js**: Entorno de ejecución para el servidor.
* **Express**: Framework para la creación de la API REST.
* **Express-Validator**: Middleware para validación de datos en las rutas.
* **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos (viviendas, usuarios y reservas):
    * `User`: Datos de usuario: email, teléfono, contraseña, rol...
    * `House`: Catálogo con títulos, descripciones detalladas y precios.
    * `Reserva`: Gestión de estancias, validación de fechas y huéspedes.
* **JWT (JSON Web Tokens)**: Sistema de autenticación y protección de rutas.
* **Bcrypt**: Encriptación de contraseñas.
* **Multer**: Middleware para la gestión de subida de archivos (imágenes de las viviendas).
* **Dotenv**: Gestión de variables de entorno.
* **Cors**: Configuración de seguridad para el acceso desde el frontend.

## Gestión de Imágenes

Un aspecto fundamental del modelo `House` en Mongoose es el campo `imagenPrincpal` y el array `imagenes`:
- **Lógica**: No almacena datos binarios pesados en la base de datos; lo que se guarda es la **dirección web (URL)** de la imagen.
- **Middleware**: Se utiliza **Multer** para procesar la subida física del archivo al servidor en Node.js, generando la ruta que finalmente se persiste en MongoDB.


## Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/95sonia/server-houseapp.git](https://github.com/95sonia/server-houseapp.git)
   cd server-houseapp

2. **Instalación de dependencias:**
    ```bash
    npm install

3. **Variables de Entorno: Crea un archivo .env en la raíz del proyecto con la siguiente configuración (copia las variables del .env.templates y rellénalas con tus claves):**
   ```bash
    PORT=4000
    MONGO_URI=tu_cadena_de_conexion_mongodb
    JWT_SECRET=tu_clave_secreta_para_tokens
    VITE_API_URL_BASE=[https://server-houseapp.onrender.com](https://server-houseapp.onrender.com)

4. **Ejecución del servidor:**
    ```bash
    npm start # O npm run dev para modo desarrollo con nodemon

## Uso

- Una vez el servidor esté corriendo, la API estará disponible en el puerto configurado (por defecto 4001).
- Puedes acceder a la documentación Swagger en:  
  `http://localhost:4001/api-docs`  
  donde encontrarás todos los endpoints disponibles con sus descripciones, parámetros y ejemplos.

## Endpoints Principales

- `/home` 
  Página pública, vista inicial de la web app.

- `/auth`  
  Registro, login, renovación de token y logout de usuarios.

- `/admin`  
  Gestión completa de viviendas, reservas y usuarios (requiere rol administrador).

- `/user`  
  Visualización de viviendas, gestión de reservas propias, favoritos y perfil (requiere rol de user).

## Estructura de carpetas
    ```bash
    /src
    /config # Configuraciones generales (DB, variables de entorno).
    /controllers # Lógica de negocio y controladores por entidad.
    /middlewares # Middlewares para validaciones, autenticación y carga de archivos.
    /models # Esquemas de Mongoose para User, House y Reserva.
    /routes # Definición de rutas agrupadas por funcionalidad.
    /public/upload # Almacenamiento de imágenes subidas.
    /src/app.js # Punto de entrada principal del servidor.
    
Desarrollado por Sonia N.M. (Enero 2026)