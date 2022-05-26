"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const router_1 = require("./routes/router");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const bot_1 = require("./bot/bot");
(0, bot_1.botTelegram)();
const server = server_1.default.instance;
server.app.use(body_parser_1.default.urlencoded({ extended: false }));
server.app.use(body_parser_1.default.json());
server.app.use((0, cors_1.default)());
server.app.use('/', router_1.router);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
