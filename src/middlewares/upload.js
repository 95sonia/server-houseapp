const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");

// Destino src/public/upload
// __dirname aquí es src/middlewares, así q subimos un nivel con '..'
const upload = multer({
    dest: path.join(__dirname, '..', 'public', 'upload'),
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

// Función para renombrar la imagen a su nombre original
const saveImage = (file) => {

    const fileName = Date.now() + '-' + file.originalname;   // Crear nombre de archivo final: fecha actual + nombre original (para evitar que no se suba la img o que se sobreescriba si ya existe ese nombre)
    const newPath = path.join(__dirname, '..', 'public', 'upload', fileName);   // Definir ruta completa: src/public/upload/archivo.jpg
    fs.renameSync(file.path, newPath);  // Renombra archivo temporal de multer al nuevo nombre con fecha
    return `${process.env.URL_BASE}/upload/${fileName}`;  // Retornar URL que se guarda en Mongoose como String 
};

module.exports = {
    upload,
    saveImage
};