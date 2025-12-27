const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const { JWTGenerator } = require('../helpers/jwt');

// FUNCION CREAR USUARIO NUEVO

const createUser = async (req, res) => {
    try {
        //capturar los elementos del formulario de registro
        const { nombre, email, password, telefono } = req.body;
        //console.log(nombre, email, password, telefono, 'datos body desde authcontroller backend');

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
        const newUser = { nombre, email, password: hashedPassword, telefono }
        const user = new User(newUser);

        //guardamos usuario en BD con método save
        const savedUser = await user.save();
        console.log(savedUser, 'savedUser desde authcontroller backend');

        //generar token
        const payload = {
            uid: savedUser._id,
            nombre: savedUser.nombre,
            role: savedUser.role
        }
        const token = await JWTGenerator(payload)
        console.log({ token }, 'desde authcontroller backend')

        //Respuesta favorable
        return res.status(200).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            user: savedUser,
            token
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


// FUNCIÓN LOGIN
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

        //crear un objeto user para la respuesta
        const user = {
            nombre: usuarioBD.nombre,
            email: email,
            uid: usuarioBD._id
        }
        console.log(user, 'desde login backend')

        //Respuesta favorable
        return res.status(200).json({
            ok: true,
            msg: "Login de usuario exitoso",
            user: usuarioBD,
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

// FUNCIÓN RENOVAR TOKEN
//Sirve para que cuando el usuario refresca la pág o entra en la app, el Frontend llama a esta función para recibir token nuevo, lo que reinicia contador de tiempo de la sesión.

const renewToken = async (req, res) => {
    // recoger uid y el nombre del req
    const { uid, nombre, role } = req.userToken;
    console.log(uid, nombre, role, '-> mis datos desde renewtoken backend');

    // generar JWT y se retorna despues en la respuesta
    const payload = { uid, nombre, role };
    const token = await JWTGenerator(payload);

    //retornar status
    return res.status(200).json({
        ok: true,
        msg: 'renovando token',
        user: {
            uid,
            nombre,
            role
        },
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}
