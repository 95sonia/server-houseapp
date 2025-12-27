// 1º importar el módulo de mongoose
const mongoose = require('mongoose');

// Función para conectar a MongoDB
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI); //usar metodo connect de mongoose porque lo dice la docu
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
    }
};

module.exports = dbConnect;