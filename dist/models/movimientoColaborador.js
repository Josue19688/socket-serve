"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*CON ESTO IRIA A LA BASE DE DATOS A TRAER EL REGISTRO REALIZADO TODO SE HARA EN EL CONTROLADOR */
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../mysql/connection"));
const MovimientoColaborador = connection_1.default.define('T01_registrosColaboradoresVisitas', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_gafete: {
        type: sequelize_1.DataTypes.STRING
    },
    sedeOrigen: {
        type: sequelize_1.DataTypes.INTEGER
    },
    sedeIngreso: {
        type: sequelize_1.DataTypes.INTEGER
    },
    fechaIngreso: {
        type: sequelize_1.DataTypes.NOW
    },
    usuario: {
        type: sequelize_1.DataTypes.STRING
    },
    id_ultimo_movimiento: {
        type: sequelize_1.DataTypes.INTEGER
    },
    accion: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    timestamps: false
});
exports.default = MovimientoColaborador;
