"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsuariosDB = exports.getUsuariosDetalles = exports.getUsuarios = void 0;
const server_1 = __importDefault(require("../server/server"));
const sockets_1 = require("../sockets/sockets");
const mysql_1 = __importDefault(require("../mysql/mysql"));
//metodod para obtener los usuarios conectados via socket
exports.getUsuarios = ((req, res) => {
    const server = server_1.default.instance;
    const data = [];
    server.io.fetchSockets()
        .then(resp => {
        for (let i in resp) {
            data.push(resp[i].id);
        }
        res.json({
            ok: true,
            dato: data
        });
    }).catch(function (e) {
        console.log('Error al mostra el id del usuarios:', e); // "oh, no!"
    });
});
//obtener usuarios por id y sus nombres
exports.getUsuariosDetalles = ((req, res) => {
    res.json({
        ok: true,
        data: sockets_1.usuarioConectados.getLista()
    });
});
exports.getUsuariosDB = ((req, res) => {
    const query = `
    SELECT * FROM usuarios
    `;
    mysql_1.default.ejecutarQuery(query, (err, usuarios) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        else {
            res.json({
                ok: true,
                usuarios
            });
        }
    });
});
