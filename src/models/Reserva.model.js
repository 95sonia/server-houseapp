// 1º requerir componentes
const { Schema, model, mongoose } = require('mongoose');

// 2º crear el esquema
const ReservaSchema = new Schema({
    vivienda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',  // Debe coincidir con el nombre del modelo
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Debe coincidir con el nombre del modelo
        required: true
    },
    fechaEntrada: {
        type: Date,
        required: true
    },
    fechaSalida: {
        type: Date,
        required: true
    },

    numeroHuespedes: {
        type: Number,
        required: true,
        min: [1, 'El número de huéspedes debe ser al menos 1'],
        validate: {
            validator: Number.isInteger,
            message: 'El número de huéspedes debe ser un número entero (sin decimales).'
        }
    },

    precioTotal: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede ser negativo']
    },
    // Estado de la reserva para el panel de administración
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada'],
        default: 'pendiente'
    },
}, {
    timestamps: true // cuándo se hizo la reserva
});

// 3º exportar el modelo

module.exports = model('Reserva', ReservaSchema);