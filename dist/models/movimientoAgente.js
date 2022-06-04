"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../mysql/connection"));
const MovimientoAgente = connection_1.default.define('T10_movimientoAgente', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    unico: {
        type: sequelize_1.DataTypes.STRING
    },
    accion: {
        type: sequelize_1.DataTypes.STRING
    },
    estado: {
        type: sequelize_1.DataTypes.INTEGER
    },
    ingreso: {
        type: sequelize_1.DataTypes.INTEGER
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    timestamps: false
});
exports.default = MovimientoAgente;
