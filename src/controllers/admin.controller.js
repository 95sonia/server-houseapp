//EMPIEZO EL 2 DE ENERO 2025

//importar el modelo
const House = require('../models/House.model');
const Reserva = require('../models/Reserva.model');


//CREAR NUEVA CASA 
const createHouse = async (req, res) => {

    // capturar el body, es un atributo donde tendré los datos enviados desde el formulario de front
    const nuevaCasa = new House(req.body);
    console.log(req.body);

    try {
        //save es un método mongoose para almacenar, crear una casa en la BD. como hay latencia- espera- usamos await
        const casaGuardada = await nuevaCasa.save()
        console.log(casaGuardada)

        // si todo bien -> retornar (201 CREATED)
        return res.status(201).json({
            ok: true,
            msg: 'Nueva vivienda creada correctamente',
            data: casaGuardada
        });

    } catch (error) {
        console.log(error)// Gestionar si hay error (500 Internal Server Error)
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })

    }
}

//VER TODAS LAS CASAS (Dashboard) 
// const getAllHouses = async (req, res) => {
//     try {




//     } catch (error) {
//         console.log(error)
//     }

// }


// //VER UNA CASA (Detalle)
// const getHouseById = async (req, res) => {
//     try {




//     } catch (error) {
//         console.log(error)
//     }

// }


// //EDITAR CASA
// const editHouseById = async (req, res) => {
//     try {




//     } catch (error) {
//         console.log(error)
//     }
// }

// // ELIMINAR CASA
// const deleteHouseById = async (req, res) => {
//     try {




//     } catch (error) {
//         console.log(error)
//     }
// }




// // VER TODAS LAS RESERVAS
// const getAllReservas = async (req, res) => {
//     try {



//     } catch (error) {
//         console.log(error)
//     }
// }


// // MODIFICAR UNA RESERVA
// const editReservaById = async (res, res) => {
//     try {



//     } catch (error) {
//         console.log(error)

//     }
// }


module.exports = {
    createHouse,
    // getAllHouses,
    // getHouseById,
    // editHouseById,
    // deleteHouseById,
    // getAllReservas,
    // editReservaById
}
