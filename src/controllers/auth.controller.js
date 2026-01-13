const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const { JWTGenerator } = require('../helpers/jwt');

/**
 * Registra un nuevo usuario en la base de datos.
 * - Verifica que el email no esté duplicado
 * - Encripta la contraseña con bcrypt
 * - Genera un JWT y lo guarda en una cookie HTTP-only
 *
 * @async
 * @function createUser
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Datos del formulario de registro.
 * @param {string} req.body.nombre - Nombre del usuario.
 * @param {string} req.body.direccion - Dirección del usuario.
 * @param {string} req.body.fechaNacimiento - Fecha de nacimiento del usuario.
 * @param {string} req.body.email - Email del usuario.
 * @param {string} req.body.password - Contraseña en texto plano.
 * @param {string} req.body.telefono - Teléfono del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta JSON con los datos básicos del usuario creado.
 */
const createUser = async (req, res) => {
    try {
        //capturar los elementos del formulario de registro
        const { nombre, direccion, fechaNacimiento, email, password, telefono } = req.body;
        //console.log(nombre, email, direccion, nacimiento, telefono, 'datos body desde authcontroller backend');

        //hay que verificar si existe el user (para no duplicar), buscamos el email en BD
        const userExiste = await User.findOne({ email });
        //console.log(userExiste, 'userExiste desde authcontroller backend');

        if (userExiste) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //Crear usuario = instancia
        const newUser = { nombre, direccion, fechaNacimiento, email, password: hashedPassword, telefono }
        const user = new User(newUser);

        //guardamos usuario en BD con método save
        const savedUser = await user.save();
        //console.log(savedUser, 'savedUser desde authcontroller backend');

        //generar token
        const payload = {
            uid: savedUser._id,
            nombre: savedUser.nombre,
            role: savedUser.role
        }
        const token = await JWTGenerator(payload)
        //console.log({ token }, 'desde authcontroller backend')

        // Configurar la cookie antes de enviar la respuesta JSON -------ESTO ESTA MAL----------HAY QUE CONFIGURARLO EN FRONTEND
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hora
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });

        //Respuesta favorable
        return res.status(200).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            user: { uid: savedUser._id, nombre: savedUser.nombre, role: savedUser.role }
        })

    } catch (error) {
        console.log(error)
        // Si algo falla, x ej caida de la BD:
        return res.status(500).json({
            ok: false,
            msg: 'Error al registrar, contacte con el administrador'
        })
    }
}

/**
 * Inicia sesión de un usuario.
 * - Verifica email y contraseña
 * - Genera un JWT
 * - Guarda el token en una cookie HTTP-only
 *
 * @async
 * @function loginUser
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Datos de login.
 * @param {string} req.body.email - Email del usuario.
 * @param {string} req.body.password - Contraseña en texto plano.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta JSON con los datos del usuario autenticado.
 */
const loginUser = async (req, res) => {
    try {
        //Recoger el email y password del req.body
        const { email, password } = req.body
        //Buscar al usuario por email en la BD y comprobar si no existe
        const usuarioBD = await User.findOne({ email })
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña no válidos' // No dar pistas de cual falla por seguridad
            })
        }
        //Comparar contraseñas coinciden con método compareSync metodo de bcryp
        const passwordOK = bcrypt.compareSync(password, usuarioBD.password)
        if (!passwordOK) {
            return res.status(401).json({// estado 401 -> No autorizado pero podria entrar poniendo bien la contraseña
                ok: false,
                msg: 'Email o contraseña no válidos'
            })
        }

        //Definir payload = lo que debe incluir el token
        const payload = {
            uid: usuarioBD._id,
            nombre: usuarioBD.nombre,
            role: usuarioBD.role
        }
        //console.log(payload)

        //Generar token usando helper JWTGenerator
        const token = await JWTGenerator(payload)
        console.log({ token }, 'desde login backend')


        //Configuracion cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hora
            secure: process.env.NODE_ENV === 'production', // Si el entorno es producción, secure = true; si no pon false
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });

        //crear un objeto user para la respuesta
        const user = {
            nombre: usuarioBD.nombre,
            direccion: usuarioBD.direccion,
            fechaNacimiento: usuarioBD.fechaNacimiento,
            email: email,
            uid: usuarioBD._id,
            role: usuarioBD.role,      
            telefono: usuarioBD.telefono 
        }
        console.log(user, 'desde login backend')

        //Respuesta favorable
        return res.status(200).json({
            ok: true,
            msg: "Login de usuario exitoso",
            user,
            token
        })

        // capturar y manejar el error con catch
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }
}

/**
 * Renueva el token JWT del usuario autenticado.
 * Se utiliza cuando el usuario recarga la aplicación
 * o vuelve a entrar para mantener la sesión activa.
 *
 * Requiere middleware previo de validación de JWT
 * que inyecte uid, nombre y role en el objeto req.
 *
 * @async
 * @function renewToken
 * @param {Object} req - Objeto de petición de Express.
 * @param {string} req.uid - ID del usuario autenticado.
 * @param {string} req.nombre - Nombre del usuario.
 * @param {string} req.role - Rol del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta JSON con el nuevo token y datos del usuario.
 */
const renewToken = async (req, res) => {//Sirve para que cuando el usuario refresca la pág o entra en la app, el Frontend llama a esta función para recibir token nuevo, lo que reinicia contador de tiempo de la sesión.
    // recoger uid y el nombre del req
    const { uid, nombre, role } = req;
    console.log(uid, nombre, role, '-> mis datos desde renewtoken backend');

    // generar JWT y se retorna despues en la respuesta
    const payload = { uid, nombre, role };
    const token = await JWTGenerator(payload);

    // IMPORTANTE: Actualizar la cookie tambien aqui
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });

    //retornar status
    return res.status(200).json({
        ok: true,
        msg: 'renovando token',
        user: { uid, nombre, role }
    })
}

/**
 * Cierra la sesión del usuario.
 * Elimina la cookie que contiene el JWT.
 *
 * @function logOut
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Respuesta JSON confirmando el cierre de sesión.
 */
const logOut = (req, res) => {
    res.clearCookie('token'); // Decir al navegador que destruya la cookie llamada 'token'
    return res.json({
        ok: true,
        msg: 'Sesión cerrada'
    });
};

module.exports = {
    createUser,
    loginUser,
    renewToken,
    logOut
}
