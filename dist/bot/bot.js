"use strict";
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
exports.botTelegram = void 0;
require('dotenv').config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const userTelegram_1 = __importDefault(require("../models/userTelegram"));
const server_1 = __importDefault(require("../server/server"));
const movimientoAgente_1 = __importDefault(require("../models/movimientoAgente"));
const botTelegram = () => {
    const token = process.env.TOKEN;
    const bot = new node_telegram_bot_api_1.default(token, { polling: true });
    bot.onText(/^\/start/, (msg) => {
        var _a, _b;
        const chatId = msg.chat.id;
        const nameUser = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.first_name;
        const alias = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.username;
        bot.sendMessage(chatId, "Bienvenido  \n" + nameUser + "\n " + alias + "\n COMANDOS :\n 211 saliendo \n 211 ingresando ");
        return;
    });
    bot.onText(/^\/dado/, (msg) => {
        bot.sendDice(msg.chat.id);
    });
    bot.onText(/^\/dardo/, (msg) => {
        const opts = {
            'emoji': '🎯'
        };
        bot.sendDice(msg.chat.id, opts);
    });
    bot.onText(/^\/reporte/, function (msg) {
        var chatId = msg.chat.id;
        var botones = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "saliendo", callback_data: 'boton1' },
                        { text: "ingresando", callback_data: 'boton2' }
                    ],
                ]
            }
        };
        bot.sendMessage(chatId, "Marcar Reporte", botones);
        bot.on('callback_query', function onCallbackQuery(accionboton) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = accionboton.data;
                if (data == 'boton1') {
                    const cuerpo = 'saliendo';
                    const myId = accionboton.from.id;
                    const de = accionboton.from.first_name;
                    const estad = 2;
                    const movimientosalida = yield movimientoAgente_1.default.create({ nombre: de, accion: cuerpo, estado: estad });
                    const datos = movimientosalida.toJSON();
                    const { fechasalida, nombre, accion, estado } = datos;
                    const payload = {
                        fechasalida,
                        nombre,
                        accion,
                        estado
                    };
                    const server = server_1.default.instance;
                    server.io.emit('mensaje-nuevo', payload);
                    bot.answerCallbackQuery(accionboton.id, { text: 'Reporte de salida agregado correctamente', show_alert: true });
                }
                if (data == 'boton2') {
                    const cuerpo = 'ingresando';
                    const myId = accionboton.from.id;
                    const de = accionboton.from.first_name;
                    const estad = 1;
                    const movimientosalida = yield movimientoAgente_1.default.create({ nombre: de, accion: cuerpo, estado: estad });
                    const datos = movimientosalida.toJSON();
                    const { fechasalida, nombre, accion, estado } = datos;
                    const payload = {
                        fechasalida,
                        nombre,
                        accion,
                        estado
                    };
                    const server = server_1.default.instance;
                    server.io.emit('mensaje-nuevo', payload);
                    bot.answerCallbackQuery(accionboton.id, { text: 'Reporte de ingreso agregado correctamente', show_alert: true });
                }
            });
        });
    });
    //nos traeremos localizacion y numero de contacto
    // bot.onText(/^\/getLocation/, (msg) => {
    //     const opts:any = {
    //       reply_markup: JSON.stringify({
    //         keyboard: [
    //           [{text: 'Location', request_location: true}],
    //           [{text: 'Contact', request_contact: true}],
    //         ],
    //         resize_keyboard: true,
    //         one_time_keyboard: true,
    //       }),
    //     };
    //     bot.sendMessage(msg.chat.id, 'Contact and Location request', opts);
    // });
    bot.onText(/^\/getContacto/, (msg) => {
        const opts = {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{ text: 'Contacto', request_contact: true }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            }),
        };
        bot.sendMessage(msg.chat.id, 'Enviar Contacto para registro de reportes.', opts);
    });
    // Obtenemos la ubicación que nos manda un usuario
    bot.on('location', (msg) => {
        var _a, _b;
        console.log((_a = msg.location) === null || _a === void 0 ? void 0 : _a.latitude);
        console.log((_b = msg.location) === null || _b === void 0 ? void 0 : _b.longitude);
    });
    // Obtenemos la información de contacto que nos manda un usuario
    bot.on('contact', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        var chatId = msg.chat.id;
        let fecha = new Date();
        const id = (_a = msg.contact) === null || _a === void 0 ? void 0 : _a.user_id;
        const nombre = (_b = msg.contact) === null || _b === void 0 ? void 0 : _b.first_name;
        const telefono = (_c = msg.contact) === null || _c === void 0 ? void 0 : _c.phone_number;
        try {
            const usuario = yield userTelegram_1.default.create({ id, nombre, telefono });
            console.log(usuario.toJSON());
        }
        catch (error) {
            console.log(error);
        }
        bot.sendMessage(chatId, "Registro agregado correctamente. aplicar /reporte para registrar movimientos diarios");
        console.log("Nombre: " + ((_d = msg.contact) === null || _d === void 0 ? void 0 : _d.first_name) + "\nUserID:" + ((_e = msg.contact) === null || _e === void 0 ? void 0 : _e.user_id) + "\nNúmero Telf: " + ((_f = msg.contact) === null || _f === void 0 ? void 0 : _f.phone_number));
    }));
    /**
     * PARA PODER CAPTURAR EL REGISTRO DE UN CODIGO DE UN COLABORADOR
     */
    bot.on('message', (msg) => {
        console.log(msg);
    });
};
exports.botTelegram = botTelegram;
