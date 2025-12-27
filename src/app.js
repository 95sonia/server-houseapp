const express= require('express') // importar express para crear el servidor con el (ver docu npm)
const mongoose = require('mongoose');
const cors = require("cors"); // para poder hacer peticiones de front a back sin que el navegador lo bloquee por seguridad
const path = require('path'); // para utilizarlo abajo, en la carpeta uploads

require('dotenv').config() // para poder usar variables de entorno (ver docu npm)
const dbConnect = require('./config/dbConnect');

const app=express() // hacer uso de express

//const multer = require("multer");
//const upload = multer({ storage: multer.memoryStorage() });

// Conectar a la base de datos
dbConnect(); 

// Especificar el puerto
const port= process.env.PORT 

// Middleware
app.use(cors()); // Para permitir peticiones desde el Frontend - React
app.use(express.urlencoded({ extended: true })) // docu web de urlencoded npm. desde node para poder parsear el body necesitamos el componente bodyparser
app.use(express.json()) // para recibir el body en formato JSON


// --- CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS (Crucial para Multer) ---
// Esto permite que las URLs de imagen sean accesibles
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas (endpoints)
// Definir prefijo base para todas las rutas
app.use('/', require('./routes/auth.routes'))
app.use('/admin', require('./routes/admin.routes'))
app.use('/user', require('./routes/user.routes'))


// Listener: Poner a la escucha el servidor ="levantar" el servidor. Se pone siempre al final del archivo
app.listen(port,()=> { 
    console.log(`Server (backend) on port ${port}`) 
})






