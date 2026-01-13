// 1º importar el módulo de mongoose
const mongoose = require('mongoose');


/**
 * Establece la conexión con la base de datos MongoDB utilizando Mongoose.
 * * Utiliza la URI almacenada en las variables de entorno.
 * Si la conexión es exitosa, lo comunica por consola; de lo contrario, captura y muestra el error.
 * * @async
 * @function dbConnect
 * @returns {Promise<void>} No devuelve ningún valor, pero resuelve la promesa cuando la conexión se establece.
 * @throws {Error} Lanza un error si la conexión a MongoDB falla.
 */
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); //usar metodo connect de mongoose porque lo dice la docu
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
    }
};

module.exports = dbConnect;