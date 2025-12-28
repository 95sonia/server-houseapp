// importar express y router
const express = require('express');
const router = express.Router()
const { check } = require('express-validator') // lo usaremos mas adelante para validar

//Importar controllers (funciones CRUD)
const { createUser, loginUser, renewToken, logOut } = require("../controllers/auth.controller")

//Importar middlewares validar JWT, validar rol y validar inputs
const { validarJWT } = require("../middlewares/validarJWT")
const { validarRol } = require("../middlewares/validarRol");
const { validarInputs } = require("../middlewares/validarInputs")

//HOME Y BUSCADOR (GET) Vista inicio de la app
// router.get('/home');

// //REGISTRO (POST) 
router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().isLength({ min: 2 }),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('telefono', 'El teléfono es obligatorio y debe tener 9 dígitos').not().isEmpty().isLength({ min: 9, max:9 }),
    validarInputs // middleware que revisa si los checks anteriores dieron error
], createUser);

// //LOGIN (POST)
router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarInputs // Si hay errores en los check, se detiene aquí
], loginUser)

//LOGOUT (POST) Limpia la cookie
router.post('/logout', validarJWT, logOut)

// RENEW (GET) Validar y renovar token que viene en la cookie
router.get('/renew', validarJWT, renewToken);

// //RECUPERAR CONTRASEÑA (GET)
// router.get('/recoverpassword'/*, [validacion] , controlador*/)

// //CAMBIAR CONTRASEÑA (POST)
// router.post('/restorepassword '/*, [validacion] , controlador*/) 

module.exports = router



