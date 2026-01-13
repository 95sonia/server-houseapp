const fs = require('node:fs');
const path = require('node:path');

/**
 * Compara dos listas de URLs de imágenes y elimina físicamente del servidor 
 * aquellas que han sido descartadas en la actualización.
 * * @function cleanImages
 * @param {string[]} antiguas - Array de URLs de las imágenes que existían previamente en la base de datos.
 * @param {string[]} nuevas - Array de URLs de las imágenes recibidas en la nueva actualización.
 * @returns {void} No devuelve nada, realiza operaciones de borrado en el sistema de archivos.
 * * @example
 * const antiguas = ['http://localhost:4000/upload/foto1.jpg', 'http://localhost:4000/upload/foto2.jpg'];
 * const nuevas = ['http://localhost:4000/upload/foto1.jpg'];
 * cleanImages(antiguas, nuevas); // Borrará físicamente 'foto2.jpg'
 */
const cleanImages = (antiguas, nuevas) => {
    // Busca URLs q estaban antes pero ya no están en la lista nueva
    const sobran = antiguas.filter(foto => !nuevas.includes(foto));
    
    sobran.forEach(url => {
        // Extrae el nombre del archivo de la URL almacenada
        const file = url.split('/').pop();
        
        // Ruta absoluta a la carpeta de subidas
        const ruta = path.join(__dirname, '..', 'public', 'upload', file);
        
        // Borrado físico
        if (fs.existsSync(ruta)) {
            fs.unlinkSync(ruta);
            console.log(`Archivo actualizado: ${file}`);
        }
    });
};

module.exports = { cleanImages };