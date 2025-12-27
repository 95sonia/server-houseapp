// Requerir libreria JWT porque lo voy a utilizar en la función
const jwt = require('jsonwebtoken');

/**
 * Middleware para validar si el token es correcto
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validarJWT = (req, res, next) => {
    //Recoger el token de headers
    const token = req.headers['authorization']?.split(' ')[1];
    // la ? quiere decir si existe no es null ni undefined ejecuta split -> transforma palabras separadas por comas en un array de palabras
    //console.log(token, 'token de la funcion validateJWT');
    //comprobar si hay token, si no lo hay retornar:
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }
    // Si lo hay verificar el token (metodo verify del paquete jsonwebtoken)
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // si la verificación es correcta Guardar el payload del token en el objeto req y llamar al metodo next()
        console.log(payload, 'payload de la funcion validarJWT')
        const userToken = {
            uid: payload.uid,
            nombre: payload.nombre,
            role: payload.role
        }

        req.userToken = userToken
        //console.log(req)

        // si la verificación no es correcta porque el token no coincide retornar una respuesta, status 401 Unathorized
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'El Token no es válido'
        })
    }
    next() // para continuar al siguiente middleware o controlador
}

module.exports = { validarJWT }
