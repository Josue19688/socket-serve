"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registroMovimiento = void 0;
const server_1 = __importDefault(require("../server/server"));
//crear mensajes
exports.registroMovimiento = ((req, res) => {
    const cuerpo = req.body.buscar;
    const de = 'Josue';
    const payload = {
        cuerpo,
        de
    };
    const server = server_1.default.instance;
    server.io.emit('mensaje2-nuevo', payload);
    res.json({
        ok: true,
        cuerpo,
        msg: 'Nuevos registro agregados'
    });
});
