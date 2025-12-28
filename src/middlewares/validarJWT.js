const jwt = require('jsonwebtoken'); // Requerir libreria JWT porque lo voy a utilizar en la función

/**
 * Middleware para revisar si el usuario tiene un token válido antes de dejarlo pasar a rutas privadas.
 * Extrae el token de las cookies de la petición, Verifica la validez del token usando la clave secreta.
 * Si es válido, inyecta los datos del usuario (uid, nombre, role) en req.userToken.
 * * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validarJWT = (req, res, next) => {
    // Leemos la cookie llamada 'token'
    const token = req.cookies.token
    console.log(token, 'token de la funcion validateJWT');

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
        // Inyectar los datos del usuario en la peticion (req)
        req.userToken = userToken
        //console.log(req)

        next() // si token válido puede pasar a la ruta -> funcion de express para pasar al siguiente middleware o controlador

        // si la verificación no es correcta porque el token no coincide retornar una respuesta, status 401 Unathorized
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'El Token no es válido'
        })
    }
}

module.exports = { validarJWT }
