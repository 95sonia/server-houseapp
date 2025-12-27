// 1º importar express y router
const express = require('express')
const router = express.Router()
const { check } = require('express-validator') // lo usaremos mas adelante para validar

//2º Importar controllers (funciones CRUD)
// const { } = require("../controllers/auth.controller")

//3º Importar Middlewares validar JWT, validar rol y validar inputs
// const { } = require("../middlewares/nombrearchivo")
// const { } = require("../middlewares/nombrearchivo")
// const { verifyToken, isAdmin } = require("../middlewares/nombrearchivo")
// const upload = require("../middlewares/multer.......");

//----------------GESTIÓN DE CASAS------------------

//Panel principal admin donde ve todas las casas (GET)
router.get('/houses' /*, [validacion] , controlador*/)

//Vista detalles de una casa específica (GET)
router.get('/houses/:id' /*, [validacion] , controlador*/)

//Añadir nueva casa (POST)
router.post('/houses' /*, [verifyToken, isAdmin, upload.single('imagen')] , controlador*/)

//Eliminar casa (DELETE)
router.delete('/houses/:id' /*, [validacion] , controlador*/)

//Editar una casa (PUT)
router.put('/houses/:id' /*, [validacion] , controlador*/)


//-----------------GESTIÓN DE RESERVAS-----------------

//Ver todas las reservas (GET)
router.get('/reservas' /*, [validacion] , controlador*/)

//Editar una reserva (PUT)
router.put('/reservas/:id' /*, [validaciones] , controlador*/)


//-----------PANEL DE GESTIÓN DE USUARIOS--------------

//VER LISTADO TODOS LOS USUARIOS (GET)
router.get('/users'/*, [validaciones] , controlador*/);

//VER FICHA DE UN USUARIO para cargar el formulario de editar (GET)
router.get('/users/:id'/*, [validaciones] , controlador*/);

//EDITAR USUARIO (nombre, email, teléfono, rol...) (PUT)
router.put('/users/:id'/*, [validaciones] , controlador*/);

//ELIMINAR USUARIO (DELETE)
router.delete('/users/:id'/*, [validaciones] , controlador*/);

module.exports = router

