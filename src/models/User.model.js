// 1º requerir componentes que vamos a utilizar
const { Schema, model, mongoose } = require('mongoose');

//2º crear el esquema
const UserSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, // Elimina espacios en blanco al ppio y al final
        lowercase: true
    },

    direccion: {
        type: String,
        required: true,
        lowercase: true
    },

    fechaNacimiento: {
        type: Date,
        required: true,
        min: [18, 'Debe ser mayor de edad para poder registrarse']
    },

    telefono: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true // Guarda email en minúscula
    },
    password: { // Se guardará hasheada con bcrypt
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'], // Solo permite estos valores
        default: 'user'
    },
    reservas: [{// Relación: Un usuario puede tener muchas reservas
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva'
    }],
    favoritos: [{// Relación: Un usuario guarda ids de viviendas que le gustan
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House' // Referencia al modelo de viviendas
    }]
})

//3º exportar el modelo para poder utilizarlo en controllers
module.exports = model('User', UserSchema)