"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../mysql/connection"));
const Capacitaciones = connection_1.default.define('T09_asistenciacapacitaciones', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    mensaje: {
        type: sequelize_1.DataTypes.STRING
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    timestamps: false
});
exports.default = Capacitaciones;
