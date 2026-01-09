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
router.post('/reservar/:id', [validarJWT, validarRol('user')], reservarHouse);

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
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Email no válido').isEmail(),
    check('telefono', 'El teléfono es obligatorio y debe tener 9 dígitos').not().isEmpty().isLength({ min: 9, max: 9 }),
    validarRol('user'), 
    validarInputs
], updatePerfil);    

module.exports = router;


