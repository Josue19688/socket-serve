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
    // bot.onText(/^\/start/,(msg)=>{
    //     const chatId = msg.chat.id;
    //     const nameUser = msg.from?.first_name;
    //     const alias = msg.from?.username;
    //     bot.sendMessage(chatId, "Bienvenido  \n" + nameUser+"\n "+alias+"\n COMANDOS :\n 211 saliendo \n 211 ingresando ");
    //     return;
    // });
    // bot.onText(/^\/dado/, (msg) => {
    //     bot.sendDice(msg.chat.id);
    // });
    // bot.onText(/^\/dardo/, (msg) => {
    //     const opts = {
    //         'emoji': '🎯'
    //     }
    //     bot.sendDice(msg.chat.id, opts);
    // });
    bot.onText(/^\/reporte/, (msg, match) => {
        var _a, _b;
        var chatId = msg.chat.id; //mi id de chat
        var miid = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id;
        var nombre = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.first_name;
        bot.getChatMember(chatId, miid).then(function (data) {
            if ((data.status == "creator") || (data.status == "administrator")) {
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
                        let date = new Date();
                        let output = date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0');
                        if (data == 'boton1') {
                            const cuerpo = 'saliendo';
                            const myId = accionboton.from.id;
                            const de = accionboton.from.first_name;
                            const estad = 2;
                            //creamos el registro
                            movimientoAgente_1.default.create({ nombre: de, unico: myId, accion: cuerpo, estado: estad, ingreso: 0 })
                                .then(() => console.log('Insertado Correctamente!!'))
                                .catch(error => console.log(error));
                            // const datos = movimientosalida.toJSON();
                            // const {fechasalida, nombre, accion,estado}=datos;
                            // const payload={
                            //     fechasalida, 
                            //     nombre,
                            //     myId,
                            //     accion,
                            //     estado
                            // }
                            // const server = ServerSocket.instance;
                            // server.io.emit('mensaje-nuevo',payload);
                            // const registros = await MovimientoAgente.findAll({
                            //     where:{
                            //         created_at:{
                            //             [Op.between]:[output+' 00:00:01',output+' 23:59:59']
                            //         }
                            //     }
                            // });
                            // const server = ServerSocket.instance;
                            // server.io.emit('mensaje-nuevo',registros);
                            bot.answerCallbackQuery(accionboton.id, { text: 'Reporte de salida agregado correctamente', show_alert: true });
                        }
                        if (data == 'boton2') {
                            const cuerpo = 'ingresando';
                            const myId = accionboton.from.id;
                            const de = accionboton.from.first_name;
                            const estad = 1;
                            //me traera el maximo id de la tabla
                            let busqueda = yield movimientoAgente_1.default.max('id', {
                                where: {
                                    unico: myId
                                }
                            });
                            yield movimientoAgente_1.default.update({
                                ingreso: 1
                            }, {
                                where: {
                                    id: busqueda
                                }
                            }).then(() => console.log('Actualizado  Correctamente!!'))
                                .catch(error => console.log(error));
                            //console.log(busqueda);
                            ///let d = new Date(busqueda);
                            // console.log(d.toString());
                            // const server = ServerSocket.instance;
                            // server.io.emit('mensaje-nuevo',payload);
                            const registros = yield movimientoAgente_1.default.findAll({
                                where: {
                                    created_at: output
                                }
                            });
                            console.log(registros);
                            const server = server_1.default.instance;
                            server.io.emit('mensaje-nuevo', registros);
                            bot.answerCallbackQuery(accionboton.id, { text: 'Reporte de ingreso agregado correctamente', show_alert: true });
                        }
                    });
                });
            }
            else {
                bot.sendMessage(chatId, nombre + " No tienes permisos para ejecutar comandos.");
                return;
            }
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
    //  bot.on('message', (msg) => {
    //     const codigo = msg.text;
    //    console.log(msg);
    // });
    bot.onText(/^\/borratodo/, (msg) => {
        var _a;
        console.log(msg);
        var chatId = msg.chat.id;
        var messageId = msg.message_id;
        var replyMessage = (_a = msg.reply_to_message) === null || _a === void 0 ? void 0 : _a.message_id;
        if (msg.reply_to_message == undefined) {
            return;
        }
        bot.deleteMessage(chatId, messageId);
        //bot.deleteMessage(chatId, replyMessage);
    });
};
exports.botTelegram = botTelegram;
