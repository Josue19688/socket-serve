"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMensajes = void 0;
exports.getMensajes = ((req, res) => {
    res.json({
        ok: true,
        msg: 'Mi primer ruta get'
    });
});
