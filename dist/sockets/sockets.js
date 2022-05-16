"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUsuarios = exports.loginWS = exports.mensaje = exports.desconectar = exports.conectarClinte = exports.usuarioConectados = void 0;
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../classes/usuario");
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
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
};
exports.mensaje = mensaje;
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
