Backend - Proyecto Alquiler Vacacional

Servidor robusto construido con Node.js, Express y MongoDB para la gestión de reservas, usuarios y propiedades.
Tecnologías utilizadas

    Node.js: Entorno de ejecución para JavaScript.

    Express: Framework para la creación de la API REST.

    Mongoose: ODM para modelar los datos en MongoDB.

    Express-Validator: Middleware para validación de datos en las rutas.

    JWT (JSON Web Token): Autenticación segura.

    Bcrypt: Encriptación de contraseñas.

Instalación y Configuración

   1 Clona el repositorio.

   2 Instala las dependencias: 
    Bash

npm install

3 Crea un archivo .env en la raíz con las siguientes variables:
Fragmento de código

PORT=4001
MONGO_URI=tu_conexion_a_mongodb
JWT_SECRET=tu_palabra_secreta

4 Arranca el servidor en modo desarrollo:
Bash

npm run dev