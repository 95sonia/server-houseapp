const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Configuración del middleware Multer para la gestión de subida de archivos.
 * Define el destino en 'public/upload', limita la cantidad de archivos a 10
 * y filtra para asegurar que solo se procesen tipos de archivo de imagen.
 * * @constant {Object} upload
 */
const upload = multer({
    dest: path.join(__dirname, '..', 'public', 'upload'), // __dirname aquí es src/middlewares, así q subimos un nivel con '..'
    limits: {
        files: 10, // limita nº de archivos que se pueden subir
        //fileSize: 5 * 1024 * 1024 // limita tamaño: 5MB por foto, creo que es muy poco, no me coge la mayoria de fotos
    },
    fileFilter: (req, file, cb) => {
        // Verificamos si el archivo es una img
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Aceptar archivo
        } else {
            cb(new Error('Solo se permiten imágenes'), false); // Rechazar
        }
    }
});


/**
 * Procesa un archivo subido mediante Multer, moviéndolo de la carpeta temporal 
 * a la ubicación definitiva en el servidor y generando su URL pública.
 * * @function saveImage
 * @param {Object} file - Objeto del archivo proporcionado por el middleware Multer.
 * @param {string} file.originalname - Nombre original del archivo subido.
 * @param {string} file.path - Ruta temporal donde Multer almacenó el archivo inicialmente.
 * @returns {string} La URL completa (ej. http://localhost:4000/upload/imagen.jpg) para almacenar en el campo `representativeImage` de Mongoose.
 * * @description
 * 1. Extrae el nombre original del archivo.
 * 2. Define la ruta de destino final en el sistema de archivos (src/public/upload).
 * 3. Utiliza `fs.renameSync` para mover el archivo desde la ruta temporal de Multer a la final.
 * 4. Retorna la dirección web basada en la variable de entorno `URL_BASE`.
 */
const saveImage = (file) => {

    const fileName = file.originalname;   // Crear nombre de archivo final: fecha actual + nombre original (para evitar que no se suba la img o que se sobreescriba si ya existe ese nombre)
    const newPath = path.join(__dirname, '..', 'public', 'upload', fileName);   // Definir ruta completa: src/public/upload/archivo.jpg
    fs.renameSync(file.path, newPath);  // Renombra archivo temporal de multer al nuevo nombre con fecha
    return `${process.env.URL_BASE}/upload/${fileName}`;  // Retornar URL que se guarda en Mongoose como String 
};

module.exports = {
    upload,
    saveImage
};