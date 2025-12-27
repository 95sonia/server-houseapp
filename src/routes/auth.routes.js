// importar express y router
const express = require ('express')
const router = express.Router()
const {check} = require('express-validator') // lo usaremos mas adelante para validar

//Importar controllers (funciones CRUD)
    // const { } = require("../controllers/auth.controller")
//Importar middlewares validar JWT, validar rol y validar inputs
    // const { } = require("../middlewares/nombrearchivo")
    // const { } = require("../middlewares/nombrearchivo")
    // const { } = require("../middlewares/nombrearchivo")

//HOME Y BUSCADOR (GET) Vista inicio de la app
router.get('/home', /* houseController */);

//REGISTRO (POST) 
router.post('/register'/*, [validacion] , controlador*/)

//LOGIN (POST)
router.post('/login' /*, [validacion] , controlador*/)

//LOGOUT (POST)
router.post('/logout'/*, [validacion] , controlador*/)

//Validar y renovar token
router.get('/renew' /*, verificarJWT, renovarToken */);

//RECUPERAR CONTRASEÑA (GET)
router.get('/recoverpassword'/*, [validacion] , controlador*/)

//CAMBIAR CONTRASEÑA (POST)
router.post('/restorepassword '/*, [validacion] , controlador*/) 

module.exports = router



