//1º Importar el modelo
const House = require('../models/House.model');
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

//VER UNA CASA (Detalle)
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

        //capturar datos básicos del body
        const dataActualizada = { ...req.body };

        // Gestionar imágenes (Lógica de mezcla y guardado)
        // Fots que se quedan ->  Mantenemos las que el usuario no borró en el front 
        let imagenesFinales = req.body.imagenesExistentes || [];
        // Aseguramos que sea un Array (por si llega una sola URL como string)
        if (typeof imagenesFinales === 'string') imagenesFinales = [imagenesFinales];

        //Fotos nuevas
        if (req.files && req.files.length > 0) {
            // Usamos la función saveImage para obtener las nuevas URLs
            const nuevasUrls = req.files.map(file => saveImage(file));
            imagenesFinales = [...imagenesFinales, ...nuevasUrls];
        }
        // Si después de procesar todo, el array está vacío, lanzar error
        if (imagenesFinales.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'La vivienda debe tener al menos una imagen. No puedes borrar todas.'
            });
        }

        // LIMPIEZA: Usamos el helper para borrar lo que ya no sirve
        cleanImages(casaPrevia.imagenes, imagenesFinales);

        // Preparar objeto final para Mongoose 
        dataActualizada.imagenes = imagenesFinales;
        dataActualizada.imagenPrincipal = imagenesFinales[0] || '';

        // Actualizar en la BD, { new: true } sirve para que devuelva la casa ya modificada
        const houseActualizada = await House.findByIdAndUpdate(id, dataActualizada, { new: true });

        // si existe responder (200 OK) y la data
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

        //borrar todas las fotos del servidor con la función cleanImages (helper) enviando array vacío
        cleanImages(house.imagenes, [])

        // Borrar la casa de la base de datos con el método findByIdAndDelete() de mongoose
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
// const getAllReservas = async (req, res) => {
//     try {


//     } catch (error) {
//         console.log(error)
//     }
// }


// MODIFICAR UNA RESERVA
// const editReservaById = async (res, res) => {
//     try {


//     } catch (error) {
//         console.log(error)

//     }
// }


module.exports = {
    createHouse,
    getAllHouses,
    getHouseById,
    editHouseById,
    deleteHouseById,
    // getAllReservas,
    // editReservaById
}
