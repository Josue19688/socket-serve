"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const mensajesController_1 = require("../controllers/mensajesController");
exports.router = (0, express_1.Router)();
exports.router.get('/mensajes', mensajesController_1.getMensajes);
