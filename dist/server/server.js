"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enviroments_1 = require("../global/enviroments");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const socket = __importStar(require("../sockets/sockets"));
const connection_1 = __importDefault(require("../mysql/connection"));
class ServerSocket {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = enviroments_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: ["http://192.168.0.73:4200", "https://192.168.0.72/digici_full/admin/seguridad/IngresosV1.php"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });
        this.dbConnection();
        this.escucharSockets();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Database online');
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    escucharSockets() {
        this.io.on('connection', cliente => {
            /**
             * Configurar usuario
             */
            socket.conectarClinte(cliente, this.io);
            socket.loginWS(cliente, this.io);
            //obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);
            //aqui iran todos los metodos que quiero emitir 
            //o escuchar de los sockets
            socket.desconectar(cliente, this.io);
            socket.mensaje(cliente, this.io);
            socket.mensaje2(cliente, this.io);
        });
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = ServerSocket;
