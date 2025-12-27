// 1º importar express y router
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

// 2º Importar controllers
// const { } = require("../controllers/");
// const { } = require("../controllers/");
// const { } = require("../controllers/");
// const { } = require("../controllers/");

// 3º Importar Middlewares
// const { verifyToken } = require("../middlewares/");

// Ver panel principal con todas las casas y buscador (GET)
router.get('/houses', /*  */);

// Ver detalles de una casa específica (GET)
router.get('/houses/:id', /* */);

// Ver ofertas especiales (GET)
router.get('/offers', /* */);


//--------ACCIONES DE USUARIO (Requieren verifyToken) ---

// Reservar una casa (POST)
router.post('/reservar', /* [verifyToken],  */);


//--------GESTIÓN DE FAVORITOS ---

// Ver mis favoritos (GET)
router.get('/favoritos', /* [verifyToken],  */);

// Añadir a favoritos (POST)
router.post('/favoritos/:id', /* [verifyToken], */);

// Eliminar de favoritos (DELETE)
router.delete('/favoritos/:id', /* [verifyToken],  */);

//--------PERFIL DE USUARIO ---

// Modificar mis datos de usuario (PUT)
router.put('/miperfil', /* [verifyToken], */);

module.exports = router;