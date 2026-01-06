const User = require('../models/User.model');
const House = require('../models/House.model')
const Reserva = require('../models/Reserva.model');


// VER TODAS LAS CASAS (USERDASHBOARD)
const getAllHouses = async (req, res) => {
    try {
        //1º Acceder a la BD con método find() de mongoose
        const houses = await House.find()

        // 2º Retornar respuesta exitosa (200 OK) y la data
        return res.status(200).json({
            ok: true,
            msg: 'Viviendas obtenidas correctamente ',
            data: houses
        })

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
    const { id } = req.params

    try {// Buscar la casa en la BD con método findById() de mongoose
        const house = await House.findById(id)

        // Comprobar si casa no existe => responder (404 => NOT FOUND)
        if (!house) {
            res.status(404).json({
                ok: false,
                msg: 'Vivienda no encontrada con ese ID'
            })
        }

        // si existe retornar respuesta exitosa y enviar la data
        return res.status(200).json({
            ok: true,
            msg: 'Vivienda encontrada',
            data: house
        })

        // Gestionar si hay error (500 Internal Server Error)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// RESERVAR UNA CASA (por id) es enviar formulario de momento
const reservarHouse = async (req, res) => {
    try {
        //QUIEN RESERVA: coger id usuario logueado desde el token para acceder a sus datos (req es un obj que transporta la info)
        const idUser = req.uid;
        //QUÉ CASA: coger id de la URL (es la casa q el usuario ha pinchado)
        const idHouse = req.params.id;
        //CUÁNDO: coger fechas del formulario
        const { fechaEntrada, fechaSalida, numeroHuespedes } = req.body;

        //Buscar la casa y comprobar si no existe
        const house = await House.findById(idHouse);
        //console.log(house)
        if (!house) {
            return res.status(404).json({
                ok: false,
                msg: 'La vivienda no existe'
            })
        }
        //Calcular el precio total (días x Precio). Hay que transformar las fechas en dias
        const inicio = new Date(fechaEntrada)
        const fin = new Date(fechaSalida)
        const dias = (fin - inicio) / (1000 * 60 * 60 * 24); // Pasar de milisegundos a días
        const precioFinal = dias * house.precioNoche

        //Crear la reserva (el estado 'pendiente' se pone autom/ en el modelo)
        const nuevaReserva = new Reserva({
            vivienda: idHouse,
            usuario: idUser,
            fechaEntrada,
            fechaSalida,
            numeroHuespedes,
            precioTotal: precioFinal

        })
        //Guardar en la base de datos
        await nuevaReserva.save();
        // Respuesta con el mensaje de "pago en el alojamiento"
        return res.status(201).json({
            ok: true,
            msg: 'Reserva solicitada correctamente. El pago se realizará en el alojamiento al llegar.',
            reserva: nuevaReserva
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor, no se puede realizar la reserva'
        })
    }
}


// VER TODAS MIS RESERVAS

const verReservas = async (req, res) => {
    try {
        const idUser = req.uid;

        // Busca  reservas de este usuario
        const reservas = await Reserva.find({ usuario: idUser });

        // Si no tiene reservas, parar aquí
        if (reservas.length === 0) {
            return res.status(200).json({
                ok: true,
                msg: 'No tienes reservas',
                data: []
            });
        }

        // Extraer todos los IDs de viviendas que usuario ha reservado
        const idsViviendas = reservas.map(reserva => reserva.vivienda);

        //Buscar info de esas casas (como en favoritos)
        // Buscar en la coleccion House qué casas coinciden con los ids que tengo '$in' reservas
        // $in -> operador de consulta dentro de los métodos de MongoDB
        const casasInfo = await House.find({ _id: { $in: idsViviendas } });

        // Devolver reservas y info de las casas
        return res.status(200).json({
            ok: true,
            msg: 'Reservas recuperadas',
            data: {
                reservas,
                casasInfo // Aquí el Front podrá sacar título y URL de imagen
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener tus reservas'
        });
    }
};


//VER TODOS MIS FAVORITOS
const verFavoritos = async (req, res) => {
    try {
        // Sacar id del usuario de req
        const idUser = req.uid;

        // Buscar usuario en la BD
        const usuario = await User.findById(idUser);

        //Si no existe el usuario (404) NOT FOUND
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            })
        }
        //Si no tiene nada en favoritos
        if (usuario.favoritos.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay nada en favoritos'
            });
        }

        // Buscar en la coleccion House qué casas coinciden con los ids que tengo '$in' favs
        // $in -> operador de consulta dentro de los métodos de MongoDB
        const casasFavoritas = await House.find({
            _id: { $in: usuario.favoritos }
        })

        //Respuesta favorable (200) OK
        return res.status(200).json({
            ok: true,
            msg: 'Favoritos obtenidos correctamente',
            data: casasFavoritas
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al obtener los favoritos'
        })
    }
}

// AÑADIR A FAVORITOS (POR ID)
const addFavorito = async (req, res) => {

    try {
        //coger id usuario logueado desde el token para acceder a sus datos (req es un obj que transporta la info)
        const idUser = req.uid;
        //coger id de la URL (es la casa q el usuario ha pinchado)
        const idHouse = req.params.id;
        console.log(idHouse, '----desde user controller back-----')

        // buscar usuario en BD con findById() porque el array de favoritos está ahí
        const usuario = await User.findById(idUser);
        //console.log(usuario, 'desde------usercontroller back-----')

        //si no existe el usuario -> 404
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            })
        };
        //comprobar si casa ya está en favoritos -> para no duplicar
        if (usuario.favoritos.includes(idHouse)) {
            return res.status(400).json({
                ok: false,
                msg: 'La vivienda ya existe en favoritos'
            })
        };
        //si no está en favs añadir la casa al array del usuario
        usuario.favoritos.push(idHouse);

        // guardar usuario actualizado en BD con método save() de mongoose. usar await porque hay latencia
        const usuarioActualizado = await usuario.save();
        //console.log(usuarioActualizado);

        //retornar respuesta exitosa y enviar la data
        return res.status(200).json({
            ok: true,
            msg: 'Vivienda guardada en favoritos',
            data: usuarioActualizado.favoritos
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al añadir favorito'
        })
    }
}

// ELIMINAR FAVORITO (POR ID)
const deleteFavorito = async (req, res) => {
    try {
        const idUser = req.uid;//coger id usuario logueado desde el token para acceder a sus datos (req es un obj que transporta la info)
        const idHouse = req.params.id; //coger id de la URL (es la casa q el usuario ha pinchado)
        const usuario = await User.findById(idUser); // buscar usuario en BD con findById()
        if (!usuario) { //si no existe el usuario -> 404
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            })
        };

        //comprobar si casa NO está en favs
        if (!usuario.favoritos.includes(idHouse)) {
            return res.status(400).json({
                ok: false,
                msg: 'No puedes borrar la vivienda porque NO está en favoritos'
            })
        };
        //borrar el favorito del array con método filter
        usuario.favoritos = usuario.favoritos.filter((idFav) => idFav.toString() !== idHouse);
        // guardar usuario actualizado en BD con método save() de mongoose
        const usuarioActualizado = await usuario.save();

        //retornar respuesta exitosa y enviar la data
        return res.status(200).json({
            ok: true,
            msg: 'Vivienda eliminada de favoritos',
            data: usuarioActualizado.favoritos
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al eliminar favorito'
        })
    }
}


// VER MI PERFIL DE USUARIO
// const getPerfil = async (req, res) => {
//     try {
//         // coger ID del token (gracias al middleware validarJWT)
//         // Buscar al usuario por su ID(hacer con algun metodo que NO traiga la contraseña)

//         // comprobar si user no eiste en BD -> 404

//         // Respuesta OK con los datos:
//         return res.status(200).json({
//             ok: true,
//             usuario
//         });

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             msg: 'Error interno del servidor al obtener los datos del perfil'
//         })
//     }
// }


// MODIFICAR MIS DATOS PERFIL USUARIO
// const updatePerfil = async (req, res) => {
//      //coger los datos del body - formulario
//     try {
//         //Actualizar solo los campos permitidos (rol no se puede)

//         //respuesta favorable


//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             msg: 'Error interno del servidor'
//         })
//     }
// }

// VER OFERTAS ESPECIALES
//Lo dejamos para el próximo sprint


module.exports = {
    getAllHouses,
    getHouseById,
    reservarHouse,
    verReservas,
    verFavoritos,
    addFavorito,
    deleteFavorito,
    // getPerfil,
    // updatePerfil,
}