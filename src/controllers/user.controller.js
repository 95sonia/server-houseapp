const User = require('../models/User.model');
const Reserva = require('../models/Reserva.model');


// VER TODAS LAS CASAS (USERDASHBOARD)
const getAllHouses = async (req, res) => {
    try {
//1º Acceder a la BD con método find() de mongoose

// 2º Retornar respuesta exitosa (200 OK) y la data



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}


// VER DETALLE CASA (POR ID)
const getHouseById = async (req, res) => {
//extraer el id en los params del endPoint = URL

    try {
// Buscar la casa en la BD con método findById() de mongoose


// 2º si existe retornar respuesta exitosa y la data


// Gestionar si hay error (500 Internal Server Error)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// RESERVAR UNA CASA (con id??) es enviar formulario de momento
const reservarHouse = async (req, res) => {
    try {



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// AÑADIR A FAVORITOS (POR ID)
const addFavorito = async (req, res) => {
    try {





    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}



//VER TODOS MIS FAVORITOS
const verFavoritos = async (req, res) => {
    try {





    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}



// ELIMINAR FAVORITO (POR ID)
const deleteFavorito = async (req, res) => {
    try {





    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}



// VER MI PERFIL DE USUARIO
const getPerfil = async (req, res) => {
    try {
        // coger los datos




    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}


// MODIFICAR MIS DATOS PERFIL USUARIO
const updatePerfil = async (req, res) => {
     //coger los datos del body - formulario
    try {
        //Actualizar solo los campos permitidos (rol no se puede)

        //respuesta favorable


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// VER OFERTAS ESPECIALES
//Lo dejamos para el próximo sprint


module.exports = {
    getAllHouses,
    // getHouseById,
    // reservarHouse,
    // addFavorito,
    // verFavoritos,
    // deleteFavorito,
    // getPerfil,
    // updatePerfil,
}