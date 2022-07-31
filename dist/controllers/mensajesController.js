"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMensajes = exports.getMensajes = exports.mensajes = void 0;
const server_1 = __importDefault(require("../server/server"));
//crear mensajes
exports.mensajes = ((req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const payload = {
        de,
        cuerpo
    };
    const server = server_1.default.instance;
    server.io.emit('mensaje-nuevo', payload);
    res.json({
        ok: true,
        de,
        cuerpo,
        msg: 'Nuevos mensajes agregados'
    });
});
//obtener mensajes
exports.getMensajes = ((req, res) => {
    res.json({
        ok: true,
        msg: 'Mi primer ruta get'
    });
});
exports.postMensajes = ((req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    const payload = {
        de,
        cuerpo
    };
    const server = server_1.default.instance;
    //para mandar mensaje a un usuario en especifico
    //para transmitir a todos se quitaria el .in 
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});
