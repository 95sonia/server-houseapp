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
router.get('/viviendas' /*, [validacion]  [verifyToken, isAdmin] , controlador*/)

//Vista detalles de una casa específica (GET)
router.get('/viviendas/:id' /*, [verifyToken, isAdmin] , controlador*/)

//Añadir nueva casa (POST)
router.post('/viviendas' /*, [verifyToken, isAdmin, upload.single('imagen')] , controlador*/)

//Eliminar casa (DELETE)
router.delete('/viviendas/:id' /*, [verifyToken, isAdmin] , controlador*/)

//Editar una casa (PUT)
router.put('/viviendas/:id' /*, [verifyToken, isAdmin] , controlador*/)


//-----------------GESTIÓN DE RESERVAS-----------------

//Ver todas las reservas (GET)
router.get('/reservas' /*, [verifyToken, isAdmin] , controlador*/)

//Editar una reserva (PUT)
router.put('/reservas/:id' /*, [verifyToken, isAdmin], controlador*/)


//-----------PANEL DE GESTIÓN DE USUARIOS--------------

//VER LISTADO TODOS LOS USUARIOS (GET)
router.get('/users'/*, [verifyToken, isAdmin] , controlador*/);

//VER FICHA DE UN USUARIO para cargar el formulario de editar (GET)
router.get('/users/:id'/*, [verifyToken, isAdmin] , controlador*/);

//EDITAR USUARIO (nombre, email, teléfono, rol...) (PUT)
router.put('/users/:id'/*, [verifyToken, isAdmin] , controlador*/);

//ELIMINAR USUARIO (DELETE)
router.delete('/users/:id'/*, [verifyToken, isAdmin] , controlador*/);

module.exports = router

