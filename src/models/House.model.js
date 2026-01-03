// 1º requerir componentes
const { Schema, model, mongoose } = require('mongoose');

// 2º crear el esquema
const HouseSchema = new Schema({

    titulo: {
        type: String,
        required: true,
        trim: true
    },
    ubicacion: {
        type: String,
        required: true

    },
    precioNoche: {
        type: Number,
        required: true,
        min: 0
    },
    imagenPrincipal: { // URL única para la portada
        type: String, 
        required: true
    },
    imagenes: [{ // Colección de todas las URLs (incluida la principal)
        type: String, 
        required: true
    }],
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['disponible', 'reservada'],
        default: 'disponible'
    }
})

//3º exportar el modelo para poder utilizarlo en controllers
module.exports = model('House', HouseSchema)

