const fs = require('node:fs');
const path = require('node:path');

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