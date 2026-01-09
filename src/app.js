const express = require('express') // importar express para crear el servidor con el (ver docu npm)
const mongoose = require('mongoose');
const cors = require('cors'); // para poder hacer peticiones de front a back sin que el navegador lo bloquee por seguridad
const path = require('path'); // para utilizarlo abajo, en la carpeta upload
const cookieParser = require('cookie-parser');
require('dotenv').config() // para poder usar variables de entorno (ver docu npm)

const dbConnect = require('./config/dbConnect');

const app = express() // hacer uso de express

// Conectar a la base de datos
dbConnect();

// Especificar el puerto
const port = process.env.PORT || 4001;

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // El puerto de Front - React
    credentials: true // Permite que viajen las cookies 
})); // Para permitir peticiones desde el Frontend - React
app.use(express.urlencoded({ extended: true })) // docu web de urlencoded npm. desde node para poder parsear el body necesitamos el componente bodyparser
app.use(express.json()) // para recibir el body en formato JSON
app.use(cookieParser());

// --- CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS (para Multer) permite que las URLs de imagen sean accesibles
app.use('/upload', express.static(path.join(__dirname,'public', 'upload')));

// Rutas (endpoints) Definir prefijo base para todas las rutas
app.use('/', require('./routes/auth.routes'))
app.use('/admin', require('./routes/admin.routes'))
app.use('/user', require('./routes/user.routes'))


// Listener: Poner a la escucha ="levantar" el servidor. Se pone siempre al final del archivo
app.listen(port, () => {
    console.log(`Server (backend) on port ${port}`)
})






