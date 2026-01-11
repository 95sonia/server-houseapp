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
    validarInputs // middleware que revisa si los checks anteriores dieron error
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
    check('nombre')
        .toLowerCase()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('El nombre solo puede contener letras'),
    check('direccion')
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ min: 5 }).withMessage('La dirección debe tener al menos 5 caracteres')
        .matches(/[a-zA-Z]/).withMessage('La dirección debe contener letras, no solo números'),
    check('fechaNacimiento')
        .notEmpty().withMessage('La fecha de nacimiento es obliagtoria')
        .isISO8601().withMessage('Solo es válido el formato fecha de nacimiento YYYY-MM-DD') // ISO 8601 = formato estándar internac para fechas = YYYY-MM-DD
        .custom((value) => { // funcion para que NO deje poner fechas de menores de 18 años
            const fechaNacimiento = new Date(value);
            const fechaHoy = new Date();
            // Calcular la fecha límite (HOY - 18 años)-> obtener año, mes y dia de hace 18 años
            const fechaLimite = new Date(
                fechaHoy.getFullYear() - 18, //MÉTODOS del obj Date de JS. Devuelve año completo (2026) 
                fechaHoy.getMonth(),  // Devuelve mes (0-11)
                fechaHoy.getDate()  // Devuelve día del mes (1-31)
            );
            if (fechaNacimiento > fechaLimite) {
                throw new Error('Debes ser mayor de 18 años para registrarte');
            }
            return true;
        }),
    check('email', 'El email no es válido').isEmail().toLowerCase(),
    check('telefono', 'El teléfono es obligatorio y debe tener 9 dígitos').not().isEmpty().isLength({ min: 9, max: 9 }),
    validarInputs // middleware que revisa si los checks anteriores dieron error
], updatePerfil);

module.exports = router;


