"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const mensajesController_1 = require("../controllers/mensajesController");
const usuariosController_1 = require("../controllers/usuariosController");
const validator_campos_1 = require("../middlewares/validator-campos");
exports.router = (0, express_1.Router)();
/**authenticacion de usuarios */
exports.router.post('/login', [
    (0, express_validator_1.check)('correo', 'El correo es obligatorio').isEmail().notEmpty(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria minimo de 6 digitos.').notEmpty(),
    validator_campos_1.validarCampos
], auth_controller_1.getLogin);
exports.router.post('/mensajes', mensajesController_1.mensajes);
exports.router.get('/mensajes', mensajesController_1.getMensajes);
exports.router.post('/mensajes/:id', mensajesController_1.postMensajes);
exports.router.get('/usuarios', usuariosController_1.getUsuarios);
exports.router.get('/usuarios/detalle', usuariosController_1.getUsuariosDetalles);
exports.router.get('/userdb', usuariosController_1.getUsuariosDB);
