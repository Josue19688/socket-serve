"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enviroments_1 = require("../global/enviroments");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
class ServerSocket {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = enviroments_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: "http://localhost:4200",
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });
        this.escucharSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    escucharSockets() {
        console.log('Escuchando conexiones');
        this.io.on('connection', cliente => {
            console.log('Nuevo Cliente conectado');
        });
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = ServerSocket;
