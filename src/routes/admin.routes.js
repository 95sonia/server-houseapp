// 1º importar express y router
const express = require('express')
const router = express.Router()
const { check } = require('express-validator') // lo usaremos mas adelante para validar

//2º Importar controllers (funciones CRUD)
// const { } = require("../controllers/auth.controller")

//3º Importar Middlewares validar JWT, validar rol y validar inputs
// const { } = require("../middlewares/nombrearchivo")
const { validarJWT } = require("../middlewares/validarJWT");
const { validarRol } = require("../middlewares/validarRol");
// const upload = require("../middlewares/multer.......");

//----------------GESTIÓN DE CASAS------------------

//Panel principal admin donde ve todas las casas (GET)
// router.get('/viviendas', [validarJWT, validarRol('admin')] , controlador)

// //Vista detalles de una casa específica (GET)
// router.get('/viviendas/:id', [validarJWT, validarRol('admin')] , controlador)

// //Añadir nueva casa (POST)
// router.post('/viviendas', [validarJWT, validarRol('admin'), upload.single('imagen')] , controlador)

// //Eliminar casa (DELETE)
// router.delete('/viviendas/:id', [validarJWT, validarRol('admin')], controlador)

// //Editar una casa (PUT)
// router.put('/viviendas/:id', [validarJWT, validarRol('admin')], controlador)


// //-----------------GESTIÓN DE RESERVAS-----------------

// //Ver todas las reservas (GET)
// router.get('/reservas' , [validarJWT, validarRol('admin')], controlador)

// //Editar una reserva (PUT)
// router.put('/reservas/:id', [validarJWT, validarRol('admin')], controlador)


// //-----------PANEL DE GESTIÓN DE USUARIOS--------------

// //VER LISTADO TODOS LOS USUARIOS (GET)
// router.get('/users'/*, [validarJWT, validarRol('admin')] , controlador*/);

// //VER FICHA DE UN USUARIO para cargar el formulario de editar (GET)
// router.get('/users/:id'/*, [validarJWT, validarRol('admin')] , controlador*/);

// //EDITAR USUARIO (nombre, email, teléfono, rol...) (PUT)
// router.put('/users/:id'/*, [validarJWT, validarRol('admin')], controlador*/);

// //ELIMINAR USUARIO (DELETE)
// router.delete('/users/:id'/*, [validarJWT, validarRol('admin')] , controlador*/);

module.exports = router

