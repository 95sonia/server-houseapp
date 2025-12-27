// importar express y router
const express = require('express');
const router = express.Router()
//const {check} = require('express-validator') // lo usaremos mas adelante para validar

//Importar controllers (funciones CRUD)
const { createUser, loginUser, renewToken } = require("../controllers/auth.controller")

//Importar middlewares validar JWT, validar rol y validar inputs
const { validarJWT } = require("../middlewares/validarJWT")
// const { } = require("../middlewares/nombrearchivo")
// const { } = require("../middlewares/nombrearchivo")

//HOME Y BUSCADOR (GET) Vista inicio de la app
// router.get('/home');

// //REGISTRO (POST) 
router.post('/register', createUser)

// //LOGIN (POST)
router.post('/login' /*, [validacion] */, loginUser)

// //LOGOUT (POST)
// router.post('/logout'/*, [validacion] , controlador*/)

// Validar y renovar token
router.get('/renew', validarJWT, renewToken);

// //RECUPERAR CONTRASEÑA (GET)
// router.get('/recoverpassword'/*, [validacion] , controlador*/)

// //CAMBIAR CONTRASEÑA (POST)
// router.post('/restorepassword '/*, [validacion] , controlador*/) 

module.exports = router



