// importar express y router
const express = require('express');
const router = express.Router()
const { check } = require('express-validator') // lo usaremos mas adelante para validar

//Importar controllers (funciones CRUD)
const { createUser, loginUser, renewToken, logOut } = require("../controllers/auth.controller")
const { getAllHouses, getHouseById } = require("../controllers/user.controller");

//Importar middlewares validar JWT, validar rol y validar inputs
const { validarJWT } = require("../middlewares/validarJWT")
const { validarRol } = require("../middlewares/validarRol");
const { validarInputs } = require("../middlewares/validarInputs");

//HOME Vista inicio de la app  
router.get('/home', getAllHouses);

//HOME Vista detalle de una casa -> Importo la funcion de user porque es la misma vista en los 3 sitios (public, admin y user)
router.get('/home/houseDetails', getHouseById)

// //REGISTRO (POST) 
router.post('/register', [
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
        .isISO8601().withMessage('Solo es válido el formato fecha de nacimiento DD/MM/AAAA')
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
    check('password', 'La contraseña debe tener al menos 6 caracteres').not().isEmpty().isLength({ min: 6 }),
    check('telefono', 'El teléfono es obligatorio y debe tener 9 dígitos').not().isEmpty().isLength({ min: 9, max: 9 }),
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



