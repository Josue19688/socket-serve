"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUsuarios = exports.loginWS = exports.mensaje2 = exports.mensaje = exports.desconectar = exports.conectarClinte = exports.usuarioConectados = void 0;
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../classes/usuario");
const capacitacionasistencia_1 = __importDefault(require("../models/capacitacionasistencia"));
exports.usuarioConectados = new usuarios_lista_1.UserList();
const conectarClinte = (cliente, io) => {
    const usuario = new usuario_1.Usuario(cliente.id);
    exports.usuarioConectados.agregar(usuario);
    io.emit('usuarios-activos', exports.usuarioConectados.getLista());
};
exports.conectarClinte = conectarClinte;
const desconectar = (cliente, io) => {
    cliente.on('disconnect', () => {
        exports.usuarioConectados.borrarUsuario(cliente.id);
    });
};
exports.desconectar = desconectar;
//escuchar mensjaes
const mensaje = (cliente, io) => {
    cliente.on('mensaje', (payload) => {
        console.log('Mensaje recibido', payload); //esto nos trae el nombre de usuarios qeu dira presente
        capacitacionasistencia_1.default.create({ nombre: payload.de, mensaje: payload.cuerpo })
            .then(() => console.log('Insertado Correctamente!!'))
            .catch(error => console.log(error));
        io.emit('mensaje-nuevo', payload);
    });
};
exports.mensaje = mensaje;
///metodo socket para seguridad y su vista de datos en tiempo real 
////registro de ingreso de personal 
const mensaje2 = (cliente, io) => {
    cliente.on('mensaje2', (payload) => {
        console.log('Mensaje recibido', payload); //esto nos trae el nombre de usuarios qeu dira presente
        io.emit('mensaje2-nuevo', payload);
    });
};
exports.mensaje2 = mensaje2;
const loginWS = (cliente, io) => {
    cliente.on('configurar-usuario', (payload, callback) => {
        exports.usuarioConectados.actualizarNombre(cliente.id, payload.nombre);
        io.emit('usuarios-activos', exports.usuarioConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
    });
};
exports.loginWS = loginWS;
//obtener usuarios para cuando entramos nos cargue toda la lista
const obtenerUsuarios = (cliente, io) => {
    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', exports.usuarioConectados.getLista());
    });
};
exports.obtenerUsuarios = obtenerUsuarios;
