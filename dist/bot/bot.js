"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.botTelegram = void 0;
require('dotenv').config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const server_1 = __importDefault(require("../server/server"));
const botTelegram = () => {
    const token = '5345732567:AAHA5Ax2aCmT8jO4bqcMwiTxOmKmooxc6LA';
    const bot = new node_telegram_bot_api_1.default(token, { polling: true });
    bot.on('message', (msg) => {
        var _a;
        // const idNumeroTelgram = msg.from?.id;
        // const nombre = msg.from?.first_name;
        const de = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.username;
        const cuerpo = msg.text;
        const payload = {
            de,
            cuerpo
        };
        console.log(payload);
        const server = server_1.default.instance;
        server.io.emit('mensaje-nuevo', payload);
    });
};
exports.botTelegram = botTelegram;
