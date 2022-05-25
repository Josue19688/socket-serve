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
    bot.onText(/^\/start/, (msg) => {
        var _a, _b;
        const chatId = msg.chat.id;
        const nameUser = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.first_name;
        const alias = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.username;
        bot.sendMessage(chatId, "Bienvenido  \n" + nameUser + "\n " + alias + "\n COMANDOS :\n 211 saliendo \n 211 ingresando ");
        return;
    });
    bot.onText(/^\/mensaje/, (msg) => {
        var _a, _b, _c;
        const chatId = msg.chat.id;
        const idNumeroTelgram = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id;
        const nombre = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.first_name;
        const de = (_c = msg.from) === null || _c === void 0 ? void 0 : _c.username;
        const cuerpo = msg.text;
        const payload = {
            de,
            cuerpo
        };
        console.log(payload);
        const server = server_1.default.instance;
        server.io.emit('mensaje-nuevo', payload);
        bot.sendMessage(chatId, "Su reporte fue exitoso!!");
    });
    bot.onText(/^\/reporte/, function (msg) {
        var chatId = msg.chat.id;
        var botones = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "saliendo", callback_data: 'boton1' },
                        { text: "ingresando", callback_data: 'boton2' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId, "Marcar Reporte", botones);
        bot.on('callback_query', function onCallbackQuery(accionboton) {
            const data = accionboton.data;
            // let fecha = accionboton.message?.date;
            // const dt = new Date(fecha*1000); 
            // var nuevaFecha = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ' -- ' + dt;
            if (data == 'boton1') {
                const cuerpo = 'saliendo';
                const myId = accionboton.from.id;
                const nombre = accionboton.from.first_name;
                const de = accionboton.from.username;
                const payload = {
                    de,
                    cuerpo
                };
                console.log(payload);
                const server = server_1.default.instance;
                server.io.emit('mensaje-nuevo', payload);
                bot.answerCallbackQuery(accionboton.id, { text: 'Reporte de salida agregado correctamente', show_alert: true });
            }
            if (data == 'boton2') {
                const cuerpo = 'ingresando';
                const myId = accionboton.from.id;
                const nombre = accionboton.from.first_name;
                const de = accionboton.from.username;
                const payload = {
                    de,
                    cuerpo
                };
                console.log(payload);
                const server = server_1.default.instance;
                server.io.emit('mensaje-nuevo', payload);
                bot.answerCallbackQuery(accionboton.id, { text: 'Reporte de ingreso agregado correctamente', show_alert: true });
            }
        });
    });
};
exports.botTelegram = botTelegram;
