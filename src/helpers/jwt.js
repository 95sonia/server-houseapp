const jwt = require('jsonwebtoken'); // importar libreria jwt

/**
 * La funcion genera un JWT = un token (cada vez que el usuario se logea correctamente y se envia de vuelta al cliente)
 * Usa JWT_SECRET_KEY para firmar el token
 * @param {object} payload 
 * @returns {}
 */
const JWTGenerator = (payload) => {

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, // son los datos que se incluirán en el token
            process.env.JWT_SECRET_KEY,
            { expiresIn: '3h'},
            (error, token) => {
                if (error) {
                    console.log(error)
                    reject('error')
                } else {
                    resolve(token)
                }
            }
        )
    })

}

module.exports = { JWTGenerator }