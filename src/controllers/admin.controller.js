//EMPIEZO EL 2 DE ENERO 2025

//importar el modelo
const House = require('../model/House.model');
const Reserva = require('../model/Reserva.model')


//CREAR NUEVA CASA
// Los datos entran del body. El body lo mando desde el front con formularios (De momento simular con postman)
const createHouse = async (req, res) => {
    try {





    } catch (error) {
        console.log(error)
    }
}

//VER TODAS LAS CASAS (Dashboard) 
const getAllHouses = async (req, res) => {
    try {




    } catch (error) {
        console.log(error)
    }

}


//VER UNA CASA (Detalle)
const getHouseById = async (req, res) => {
    try {




    } catch (error) {
        console.log(error)
    }

}


//EDITAR CASA
const editHouseById = async (req, res) => {
    try {




    } catch (error) {
        console.log(error)
    }
}

// ELIMINAR CASA
const deleteHouseById = async (req, res) => {
    try {




    } catch (error) {
        console.log(error)
    }
}




// VER TODAS LAS RESERVAS
const getAllReservas = async (req, res) => {
    try {



    } catch (error) {
        console.log(error)
    }
}


// MODIFICAR UNA RESERVA
const editReservaById = async (res, res) => {
    try {



    } catch (error) {
        console.log(error)

    }
}


module.exports = {
    createHouse,
    getAllHouses,
    getHouseById,
    editHouseById,
    deleteHouseById,
    getAllReservas,
    editReservaById
}
