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
exports.botTelegramActualizacion = void 0;
require('dotenv').config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const registrocolaboradores_1 = __importDefault(require("../models/registrocolaboradores"));
const tokenupdate_1 = __importDefault(require("../models/tokenupdate"));
const botTelegramActualizacion = () => {
    const token = process.env.ACTUALIZACION_TOKEN;
    const bot = new node_telegram_bot_api_1.default(token, { polling: true });
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
    // bot.on('location', (msg) => {
    //     console.log(msg.location?.latitude);
    //     console.log(msg.location?.longitude);
    // });
    //   // Obtenemos la información de contacto que nos manda un usuario
    bot.on('contact', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        var chatId = msg.chat.id;
        const telegram = (_a = msg.contact) === null || _a === void 0 ? void 0 : _a.user_id;
        const nombre = (_b = msg.contact) === null || _b === void 0 ? void 0 : _b.first_name;
        const telefono = (_c = msg.contact) === null || _c === void 0 ? void 0 : _c.phone_number;
        const token = generateToken(11);
        try {
            //const usuario = await  UsuarioTelegram.create({id,nombre,telefono});
            const registro = yield registrocolaboradores_1.default.create({ idTelegram: telegram, numero: telefono, nombre });
            const agregartoken = yield tokenupdate_1.default.create({
                idTelegram: telegram,
                numero: telefono,
                token: token,
                estado: 1
            });
            console.log(agregartoken.toJSON());
        }
        catch (error) {
            console.log(error);
        }
        bot.sendMessage(chatId, `Registro agregado correctamente. Su <b>Token</b> : <i>${token}</i>  \nsolo podra utilizarlo una vez.`, { parse_mode: "HTML" });
        console.log("Nombre: " + ((_d = msg.contact) === null || _d === void 0 ? void 0 : _d.first_name) + "\nUserID:" + ((_e = msg.contact) === null || _e === void 0 ? void 0 : _e.user_id) + "\nNúmero Telf: " + ((_f = msg.contact) === null || _f === void 0 ? void 0 : _f.phone_number));
    }));
    function generateToken(length) {
        let rand = () => Math.random().toString(36).substr(2);
        return (rand() + rand() + rand() + rand()).substr(0, length);
    }
    // bot.on('contact', async(msg) => {
    //     var chatId=msg.chat.id;
    //     const id = msg.contact?.user_id;
    //     const nombre = msg.contact?.first_name;
    //     const telefono=msg.contact?.phone_number;
    //     const token = generateToken(11)
    //     try {
    //         const usuario = await  UsuarioTelegram.create({id,nombre,telefono});
    //         //const registro = await UsuarioTelegramcolaborador.create({idTelegram:telegram,numero:telefono,nombre});
    //         // const agregartoken  = await UsuarioToken.create(
    //         //     {
    //         //         idTelegram:telegram,
    //         //         numero:telefono,
    //         //         token:token,
    //         //         estado:1
    //         //     }
    //         // );
    //         console.log(usuario.toJSON());
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     bot.sendMessage(chatId,`Registro agregado correctamente.`,{parse_mode : "HTML"});
    //       console.log("Nombre: " + msg.contact?.first_name + "\nUserID:"  +  msg.contact?.user_id + "\nNúmero Telf: " + msg.contact?.phone_number);
    // });
};
exports.botTelegramActualizacion = botTelegramActualizacion;
