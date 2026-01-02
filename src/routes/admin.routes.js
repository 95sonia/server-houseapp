// 1º importar express y router
const express = require('express')
const router = express.Router()
const { check } = require('express-validator') // lo usaremos mas adelante para validar

//2º Importar controllers (funciones CRUD)
const { createHouse/*, getAllHouses, getHouseById, editHouseById, deleteHouseById, getAllReservas, editReservaById*/} = require("../controllers/admin.controller")

//3º Importar Middlewares validar JWT, validar rol y validar inputs
const { validarJWT } = require("../middlewares/validarJWT");
const { validarRol } = require("../middlewares/validarRol");
const { validarInputs } = require("../middlewares/validarInputs");

// const upload = require("../middlewares/multer.......");

//----------------GESTIÓN DE CASAS------------------

//Panel principal admin donde ve todas las casas (GET)
// router.get('/dashboard', [validarJWT, validarRol('admin')] , getAllHouses)

//Vista detalle de una casa específica (GET)
// router.get('/house/:id', [validarJWT, validarRol('admin')] , getHouseById)

//Añadir nueva casa (POST)
router.post('/createHouse', [/*upload.single('imagen'),*/ validarJWT, validarRol('admin'), validarInputs] , createHouse)

// //Editar una casa (PUT)
// router.put('/editHouse/:id', [validarJWT, validarRol('admin'), validarInputs], editHouseById)

// //Eliminar casa (DELETE)
// router.delete('/deleteHouse/:id', [validarJWT, validarRol('admin')], deleteHouseById)


// //-----------------GESTIÓN DE RESERVAS-----------------

// //Ver todas las reservas (GET)
// router.get('/reservas' , [validarJWT, validarRol('admin')], getAllReservas)

// //Editar una reserva (PUT)
// router.put('/reservas/:id', [validarJWT, validarRol('admin'), validarInputs], editReservaById)


// //-----------PANEL DE GESTIÓN DE USUARIOS--------------

// //VER LISTADO TODOS LOS USUARIOS (GET)
// router.get('/users'/*, [validarJWT, validarRol('admin')] , controlador*/);

// //VER FICHA DE UN USUARIO para cargar el formulario de editar (GET)
// router.get('/users/:id'/*, [validarJWT, validarRol('admin')] , controlador*/);

// //EDITAR USUARIO (nombre, email, teléfono, rol...) (PUT)
// router.put('/users/:id'/*, [validarJWT, validarRol('admin'), validarInputs], controlador*/);

// //ELIMINAR USUARIO (DELETE)
// router.delete('/users/:id'/*, [validarJWT, validarRol('admin')] , controlador*/);

module.exports = router

