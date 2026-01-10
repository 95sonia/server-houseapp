// 1º importar express y router
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

// 2º Importar controllers
const {
    getAllHouses,
    getHouseById,
    reservarHouse,
    verReservas,
    verFavoritos,
    addFavorito,
    deleteFavorito,
    getPerfil,
    updatePerfil
} = require("../controllers/user.controller");

// 3º Importar Middlewares
const { validarJWT } = require("../middlewares/validarJWT");
const { validarRol } = require("../middlewares/validarRol");
const { validarInputs } = require("../middlewares/validarInputs");

// Ver panel principal con todas las casas y buscador (GET)
router.get('/dashboard', [validarJWT, validarRol('user')], getAllHouses);

// Ver detalles de una casa específica (GET)
router.get('/house/:id', [validarJWT, validarRol('user')], getHouseById);

// Reservar una casa (POST)
router.post('/reservar/:id', [
    validarJWT,
    validarRol('user'),
    check('numeroHuespedes', 'Introduce un número mayor que 0').notEmpty().isInt({ min: 1 }),
    check('fechaEntrada')
        .notEmpty().withMessage('La fecha de entrada es obliagtoria')
        .isISO8601().withMessage('Solo es válido el formato fecha DD/MM/AAAA') // ISO 8601 = formato estándar internac para fechas = YYYY-MM-DD    
        .custom((value) => {
            const fechaEntrada = new Date(value);
            const fechaHoy = new Date();
            fechaHoy.setHours(0, 0, 0, 0); // resetear a las 00:00h para comparar SOLO FECHAS y que deje reservar hoy (porque newDate guarda también la hora)
            
            if (fechaEntrada < fechaHoy) {
                throw new Error('Fecha de entrada no puede ser anterior a hoy');
            }
            return true; //pasa la validación   
        }),
    check('fechaSalida')
        .notEmpty().withMessage('La fecha de salida es obligatoria')
        .isISO8601().withMessage('Solo es válido el formato fecha')
        .custom((value, { req }) => {
            const fechaEntrada = new Date(req.body.fechaEntrada); //desde el cuerpo de la petición (req.body)
            const fechaSalida = new Date(value);
            if (fechaSalida <= fechaEntrada) {
                throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
            }
            return true;
        }),
    validarInputs
], reservarHouse);

// Ver mis reservas realizadas (GET)
router.get('/reservas', [validarJWT, validarRol('user')], verReservas);

//--------GESTIÓN DE FAVORITOS -----------

// Ver todos mis favoritos (GET)
router.get('/favoritos', [validarJWT, validarRol('user')], verFavoritos);

// Añadir a favoritos (POST)
router.post('/favoritos/:id', [validarJWT, validarRol('user')], addFavorito);

// Eliminar de favoritos (DELETE)
router.delete('/favoritos/:id', [validarJWT, validarRol('user')], deleteFavorito);

// Ver ofertas especiales (GET) -> Para el próximo sprint
//  router.get('/ofertas', /* */);


//--------PERFIL DE USUARIO ------------

//Ver mi perfil de usuario (GET)
router.get('/perfil', [validarJWT, validarRol('user')], getPerfil);

// Modificar mis datos de usuario (PUT)
router.put('/perfil', [
    validarJWT,
    validarRol('user'),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Email no válido').isEmail(),
    check('telefono', 'El teléfono es obligatorio y debe tener 9 dígitos').notEmpty().isLength({ min: 9, max: 9 }),
    validarInputs
], updatePerfil);

module.exports = router;


