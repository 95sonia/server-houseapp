// Importar express-validator porque lo voy a utilizar
const { validationResult } = require('express-validator')

/**
 * Middleware para validar resultados de los checks si hay errores. (Una funcion middleware tiene como argto 3 param: req, res y next)
 * Esta función es necesaria porque los checks NO detienen la petición y te dejan pasar aunque los datos sean erróneos.
 * validatonResults es la función que recopila todos los errores
 * si hay errores la respuesta siempre es status y json(). el mensaje en este caso un objeto con el error
 * Si no hay errores pasa a la siguiente fucnion con next
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {object|void}
 */
const validarInputs = (req, res, next) => {
    const errors = validationResult(req) //obtener errores almacenados en validationResult (como arg req porque lo dice la docu)
    console.log(errors)
    //console.log(errors.isEmpty())
    if (!errors.isEmpty()) {
        // Convertimos el objeto de errores en un Array
        const errorArray = errors.array();
        //si no es válido -> responder 400 = Bad request
        //tengo que pasar al front esos errores
        return res.status(400).json({
            ok: false,
            msg: errorArray[0].msg // Envía el primer check que ha fallado al front. lo hago así porque con el objeto me daba problemas
        })
    } else {
        next() // solo si lista de errores está vacia pasar a la sig función
    }
}

module.exports = { validarInputs }
