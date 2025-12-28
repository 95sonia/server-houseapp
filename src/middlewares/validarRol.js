/**
 * Middleware para validar el rol del usuario contra una lista de roles permitidos.
 * Utiliza el encadenamiento opcional (?.) para evitar errores si el token no ha sido validado previamente.
 * * @param {...String} rolesPermitidos - Lista de roles que tienen acceso a la ruta (en este casao 'admin', 'user').
 * @returns {Function} Middleware de Express que valida el rol contenido en req.userToken.
 */
const validarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        //Siempre verificar que el token se haya validado antes. Después extraer el rol del token
        // El ?. evita que el servidor explote si req.userToken no existe
        const rol = req.userToken?.role;

        //Verificar si rol de usuario está entre los permitidos
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                ok: false,
                msg: "No tienes permisos"
            });
        }
        next();
    };

}

module.exports = { validarRol };
