// 1º importar express y router
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

// 2º Importar controllers
const {
    getAllHouses,
    // getHouseById,
    // reservarHouse,
    // addFavorito,
    // verFavoritos,
    // deleteFavorito,
    // getPerfil,
    // updatePerfil,
} = require("../controllers/user.controller");


// 3º Importar Middlewares
const { validarJWT } = require("../middlewares/validarJWT");
const { validarRol } = require("../middlewares/validarRol");
const { validarInputs } = require("../middlewares/validarInputs");

// Ver panel principal con todas las casas y buscador (GET)
router.get('/dashboard', [validarJWT], getAllHouses);

// Ver detalles de una casa específica (GET)
// router.get('/house/:id', [validarJWT], getHouseById);

//--------ACCIONES DE USUARIO (Requieren verificar Token) -------

// Reservar una casa (POST)
// router.post('/reservar',  [validarJWT, validarRol('user')], reservarHouse);


//--------GESTIÓN DE FAVORITOS -----------

// Ver mis favoritos (GET)
// router.get('/favoritos', [validarJWT, validarRol('user')], verFavoritos);

// Añadir a favoritos (POST)
// router.post('/favoritos/:id', [validarJWT, validarRol('user')], addFavorito);

// Eliminar de favoritos (DELETE)
// router.delete('/favoritos/:id', [validarJWT, validarRol('user')],  deleteFavorito);

// Ver ofertas especiales (GET)
// router.get('/ofertas', /* */);


// //--------PERFIL DE USUARIO ------------

//Ver mi perfil de usuario (GET)
// router.get('/perfil', [validarJWT, validarRol('user')], getPerfil);

// Modificar mis datos de usuario (PUT)
// router.put('/perfil', [
//     validarJWT, 
//     check('nombre', 'El nombre es obligatorio').notEmpty(),
//     check('email', 'Email no válido').isEmail(),
//     validarRol('user'), 
//     validarInputs
// ], updatePerfil);


module.exports = router;
