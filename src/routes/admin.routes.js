// 1º importar express y router
const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); // lo usaremos para validar

// 2º Importar controllers (funciones CRUD)
const { createHouse,
    getAllHouses,
    getHouseById,
    editHouseById,
    deleteHouseById,
    getAllReservas,
    editReservaById,
    getAllUsers,
    getUserById,
    editUserById,
    deleteUserById
} = require("../controllers/admin.controller")

// 3º Importar Middlewares
const { validarJWT } = require("../middlewares/validarJWT");
const { validarRol } = require("../middlewares/validarRol");
const { validarInputs } = require("../middlewares/validarInputs");
const { upload } = require("../middlewares/upload");

//----------------GESTIÓN DE CASAS------------------

//Panel principal admin donde ve todas las casas (GET)
router.get('/dashboard', [validarJWT, validarRol('admin')], getAllHouses)

//Vista detalle de una casa específica (GET)
router.get('/house/:id', [validarJWT, validarRol('admin')], getHouseById)

//Añadir nueva casa (POST)
// imagenes es el nombre del campo que enviaremos desde el Front
router.post('/createHouse', [
    validarJWT,
    validarRol('admin'),
    upload.array('imagenes', 10),
    check('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .matches(/[a-zA-Z]/).withMessage('El título debe contener letras, no solo números'), // Expresión regular -> debe haber al menos una letra
    check('ubicacion').matches(/[a-zA-Z]/).withMessage('La ubicación debe contener letras, no solo números'),
    check('precioNoche', 'El precio debe ser un número mayor que 0').isFloat({ min: 0.01 }),
    validarInputs,
], createHouse)

// Editar una casa (PUT)
router.put('/editHouse/:id', [
    validarJWT,
    validarRol('admin'),
    upload.array('imagenes', 10),
    check('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .matches(/[a-zA-Z]/).withMessage('El título debe contener letras, no solo números'), // Expresión regular -> debe haber al menos una letra
    check('ubicacion').matches(/[a-zA-Z]/).withMessage('La ubicación debe contener letras, no solo números'),
    check('precioNoche', 'El precio debe ser un número mayor que 0').isFloat({ min: 0.01 }),
    validarInputs
], editHouseById)

// Eliminar casa (DELETE)
router.delete('/deleteHouse/:id', [validarJWT, validarRol('admin')], deleteHouseById)

//------------------GESTIÓN DE RESERVAS------------------

// Ver todas las reservas (GET)
router.get('/reservas', [validarJWT, validarRol('admin')], getAllReservas)

// Editar una reserva (PUT)
router.put('/reservas/:id', [
    validarJWT,
    validarRol('admin'),
    validarInputs
], editReservaById)

//-------------PANEL DE GESTIÓN DE USUARIOS--------------

// VER LISTADO TODOS LOS USUARIOS (GET)
router.get('/users', [validarJWT, validarRol('admin')], getAllUsers);

// VER FICHA DE UN USUARIO para cargar el formulario de editar (GET)
router.get('/users/:id', [validarJWT, validarRol('admin')], getUserById);

// EDITAR USUARIO (nombre, email, teléfono, rol...) (PUT)
router.put('/users/:id', [
    validarJWT,
    validarRol('admin'),
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
    validarInputs
], editUserById);

//ELIMINAR USUARIO (DELETE)
router.delete('/users/:id', [validarJWT, validarRol('admin')], deleteUserById);

module.exports = router

