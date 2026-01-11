//1º Importar el modelo
const House = require('../models/House.model');
const User = require('../models/User.model');
const Reserva = require('../models/Reserva.model');
const { saveImage } = require('../middlewares/upload');
const { cleanImages } = require('../helpers/cleanImages');

//CREAR NUEVA CASA 
const createHouse = async (req, res) => {
    try {

        // Verificar que Multer haya recibido archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Es obligatorio subir al menos una imagen'
            });
        }

        // Procesar los archivos físicos y obtener URLs
        // Usamos .map para aplicar la función saveImage a cada archivo del array
        const urls = req.files.map(file => saveImage(file));

        // Creamos instancia del modelo House
        const nuevaCasa = new House({
            ...req.body, // Extraemos los textos del body (titulo, precio, etc.)
            imagenPrincipal: urls[0], // Asignamos la 1ª URL del array como img principal por defecto
            imagenes: urls    // Guardar listado completo URLs en el array 'imagenes'
        });

        //Guardar en Mongo DB con método save de mongoose (como hay latencia = espera-> usamos await)
        const casaGuardada = await nuevaCasa.save()
        console.log(casaGuardada)

        // si todo bien -> responder al cliente -> retornar (201 CREATED)
        return res.status(201).json({
            ok: true,
            msg: 'Nueva vivienda creada correctamente',
            data: casaGuardada
        });

    } catch (error) {
        console.log(error)// Gestionar si hay error (500 Internal Server Error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al crear la nueva vivienda.'
        })

    }
}

//VER TODAS LAS CASAS (Dashboard) 
const getAllHouses = async (req, res) => {
    try {
        //1º Acceder a la BD con método find() de mongoose
        const houses = await House.find()

        // 2º Retornar respuesta exitosa (200 OK) y la data
        return res.status(200).json({
            ok: true,
            msg: 'Todas las Viviendas obtenidas correctamente ',
            data: houses
        })

    } catch (error) {
        console.log(error) // Gestionar si hay error (500 Internal Server Error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener todas las viviendas'
        })
    }
}

//VER UNA CASA (Detalle) -> Veo que es la misma funcion que admin...se podría haber hecho solo una?
const getHouseById = async (req, res) => {

    //extraer el id en los params del endPoint = URL
    const { id } = req.params;

    try {
        // Buscar la casa en la BD con método findById() de mongoose
        const house = await House.findById(id)
        // Comprobar si casa no existe => responder (404 => NOT FOUND)
        if (!house) {
            return res.status(404).json({
                ok: false,
                msg: 'Vivienda no encontrada con ese ID'
            })
        }

        // 2º si existe retornar respuesta exitosa y la data
        return res.status(200).json({
            ok: true,
            msg: 'Vivienda encontrada',
            data: house
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

//EDITAR CASA
const editHouseById = async (req, res) => {
    try {
        //extraer el id en los params
        const { id } = req.params
        console.log(id)

        // Buscar la casa ACTUAL (necesaria para comparar fotos y limpiar disco)
        const casaPrevia = await House.findById(id);
        if (!casaPrevia) {
            return res.status(404).json({
                ok: false,
                msg: 'Vivienda no encontrada'
            });
        }

        //Capturar datos básicos del body
        const dataActualizada = { ...req.body };

        let imagenesFinales = [];
        if (req.body.imagenesRestantes) {
            try {
                imagenesFinales = JSON.parse(req.body.imagenesRestantes);
            } catch (e) {
                // Por si acaso llega como string simple
                imagenesFinales = [req.body.imagenesRestantes];
            }
        }

        //Fotos nuevas
        if (req.files && req.files.length > 0) {
            // Usamos la función saveImage para obtener las nuevas URLs
            const nuevasUrls = req.files.map(file => saveImage(file));
            imagenesFinales = [...imagenesFinales, ...nuevasUrls];
        }
        //Si después de procesar todo, el array está vacío, lanzar error
        if (imagenesFinales.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'La vivienda debe tener al menos una imagen. No puedes borrar todas.'
            });
        }

        //Usar helper para borrar lo que ya no sirve
        cleanImages(casaPrevia.imagenes, imagenesFinales);

        //Preparar objeto final para Mongoose 
        dataActualizada.imagenes = imagenesFinales;
        dataActualizada.imagenPrincipal = imagenesFinales[0] || '';

        //Actualizar en la BD, { new: true } sirve para que devuelva la casa ya modificada
        const houseActualizada = await House.findByIdAndUpdate(id, dataActualizada, { new: true });

        //Si existe responder (200 OK) y la data
        return res.status(200).json({
            ok: true,
            msg: 'Vivienda actualizada correctamente',
            data: houseActualizada
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// ELIMINAR CASA
const deleteHouseById = async (req, res) => {
    try {
        // buscar el id en los params del endPoint
        const { id } = req.params;
        console.log(req.params, 'desde deleteHouse-admin controller-back')

        // Buscar la casa antes de borrarla para saber qué fotos tiene
        const house = await House.findById(id);

        //si no existe responder (404 NOT FOUND)
        if (!house) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró la vivienda para eliminar'
            })
        }

        //Borrar todas las fotos del servidor con la función cleanImages (helper) enviando array vacío
        cleanImages(house.imagenes, [])

        //Borrar todas las reservas asociadas a la vivienda (si no se quedan guardadas en la BD aunque la casa no exista!!)
        await Reserva.deleteMany({ vivienda: id });

        //Borrar la casa de la base de datos con el método findByIdAndDelete() de mongoose
        await House.findByIdAndDelete(id);

        // si existe responder (200 OK)
        return res.status(200).json({
            ok: true,
            msg: 'Vivienda eliminada correctamente'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al intentar eliminar la vivienda'
        })
    }
}


// VER TODAS LAS RESERVAS
const getAllReservas = async (req, res) => {
    try {
        // Buscar todas las reservas
        const reservas = await Reserva.find()
            //Usar método .populate() para relacionar la reserva con usuario y casa
            //sirve para unir datos de una colección con información de otra
            .populate('usuario', 'nombre email telefono') // poblar el campo 'usuario' del modelo de reserva para ver sus datos
            .populate('vivienda', 'titulo ubicacion descripcion estado') //poblar vivienda para ver sus datos

        if (reservas.lenght === 0) {
            return res.status(200).json({// 200 porque la consulta se ha realizado bien (aunque este vacío)
                ok: true,
                msg: 'Todavía no hay ninguna reserva realizada',
            })
        };
        //respuesta favorable (200 OK) y devolver reservas
        return res.status(200).json({
            ok: true,
            msg: 'Todas las reservas obtenidas correctamente',
            reservas
        });

        //gestionar error
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al obtener las reservas'
        })
    }
}

// MODIFICAR UNA RESERVA
const editReservaById = async (req, res) => {
    try {
        const { id } = req.params; // id de la reserva llega desde la URL
        //console.log(id, '--------id desde editarReserva admincontrollers------')

        // Capturar datos del body - formulario front
        const dataActualizada = req.body;

        // Verificar si reserva existe
        const reservaExiste = await Reserva.findById(id);
        if (!reservaExiste) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna reserva con ese ID'
            });
        }
        //Actualizar en la BD
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            id,
            dataActualizada,
            {
                new: true, // devuelve la reserva ya modificada
                runValidators: true //revisa si los datos cumplen con las reglas del esquema (para no poder un estado que no sea 'pendiente', 'confirmada', 'cancelada')
            })
            .populate('usuario', 'nombre email') //poblar 'usuario' del modelo de reserva para ver sus datos (Por si los quiero mostrar en front)
            .populate('vivienda', 'titulo');

        // SINCRONIZAR CON EL MODELO HOUSE para cambiar su estado !!
        // Usar ID de la vivienda q está guardado en la reserva
        const casaId = reservaActualizada.vivienda;

        if (estado === 'confirmada') { // Si la reserva se confirma, la casa pasa a estar RESERVADA
            await House.findByIdAndUpdate(casaId, { estado: 'reservada' });
        }

        if (estado === 'cancelada') { // Si la reserva se cancela, la casa estará DISPONIBLE
            await House.findByIdAndUpdate(casaId, { estado: 'disponible' });
        }
        //Respuesta exitosa (200 OK) y la data
        return res.status(200).json({
            ok: true,
            msg: 'Reserva actualizada correctamente',
            data: reservaActualizada
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al actualizar la reserva'
        })
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
