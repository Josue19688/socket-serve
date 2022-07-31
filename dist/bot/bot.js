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
    // bot.on('message', async(msg) => {
    //     console.log(msg);
    //    const registro=msg.from?.id;
    //    const codigo = msg.text;
    //    let resultado = await MovimientoColaborador.findOne({
    //        where:{
    //            numero_gafete:codigo
    //        }
    //    });
    //    let data = resultado?.toJSON();
    //         let sede='';
    //         if(data.sedeOrigen==1){
    //             sede='ZONA 4';
    //         }if (data.sedeOrigen==2) {
    //             sede='ZONA 9';
    //         }
    //         let sedefin='';
    //         if(data.sedeIngreso==1){
    //             sedefin='ZONA 4';
    //         }if (data.sedeIngreso==2) {
    //             sedefin='ZONA 9';
    //         }
    //         console.log( data.numero_gafete);
    //         console.log( sede);
    //         console.log( sedefin);
    //         var f:string=`Codigo :${data.numero_gafete}\nSEDE ORIGEN :${sede}\nSEDE INGRESO: ${sedefin}\nACCION : INGRESO`;
    //         bot.sendMessage(msg.chat.id,f);
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
                            let movimientosalida = yield movimientoAgente_1.default.create({ nombre: de, unico: myId, accion: cuerpo, estado: estad, idultimo: 0 });
                            //josue
                            const datos = movimientosalida.toJSON();
                            const { fechasalida, nombre, accion, estado } = datos;
                            const payload = {
                                fechasalida,
                                nombre,
                                myId,
                                accion,
                                estado
                            };
                            const server = server_1.default.instance;
                            server.io.emit('mensaje-nuevo', payload);
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
                            ///me traera el maximo id de la tabla
                            let busqueda = yield movimientoAgente_1.default.max('id', {
                                where: {
                                    unico: myId
                                }
                            });
                            const estad = 1;
                            //creamos el registro
                            let movimientosalida = yield movimientoAgente_1.default.create({ nombre: de, unico: myId, accion: cuerpo, estado: estad, idultimo: busqueda });
                            // await MovimientoAgente.update(
                            //     {
                            //         ingreso:1
                            //     },
                            //     {
                            //         where:{
                            //             id:busqueda
                            //         }
                            //     }
                            // );
                            //console.log(busqueda);
                            ///let d = new Date(busqueda);
                            // console.log(d.toString());
                            const datos = movimientosalida.toJSON();
                            const { fechasalida, nombre, accion, estado } = datos;
                            const payload = {
                                fechasalida,
                                nombre,
                                myId,
                                accion,
                                estado
                            };
                            const server = server_1.default.instance;
                            server.io.emit('mensaje-nuevo', payload);
                            //     const registros = await MovimientoAgente.findAll({
                            //         where:{
                            //             created_at:output
                            //         }
                            //     });
                            //    console.log(registros);
                            // const server = ServerSocket.instance;
                            // server.io.emit('mensaje-nuevo',registros);
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
    // bot.onText(/^\/getContacto/, (msg) => {
    //     const opts:any = {
    //       reply_markup: JSON.stringify({
    //         keyboard: [
    //           [{text: 'Contacto', request_contact: true}],
    //         ],
    //         resize_keyboard: true,
    //         one_time_keyboard: true,
    //       }),
    //     };
    //     bot.sendMessage(msg.chat.id, 'Enviar Contacto para registro de reportes.', opts);
    // });
    // Obtenemos la ubicación que nos manda un usuario
    // bot.on('location', (msg) => {
    //     console.log(msg.location?.latitude);
    //     console.log(msg.location?.longitude);
    // });
    //   // Obtenemos la información de contacto que nos manda un usuario
    // bot.on('contact', async(msg) => {
    //     var chatId=msg.chat.id;
    function generateToken(length) {
        let rand = () => Math.random().toString(36).substr(2);
        return (rand() + rand() + rand() + rand()).substr(0, length);
    }
    bot.on('contact', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        var chatId = msg.chat.id;
        const id = (_a = msg.contact) === null || _a === void 0 ? void 0 : _a.user_id;
        const nombre = (_b = msg.contact) === null || _b === void 0 ? void 0 : _b.first_name;
        const telefono = (_c = msg.contact) === null || _c === void 0 ? void 0 : _c.phone_number;
        const token = generateToken(11);
        try {
            const usuario = yield userTelegram_1.default.create({ id, nombre, telefono });
            //const registro = await UsuarioTelegramcolaborador.create({idTelegram:telegram,numero:telefono,nombre});
            // const agregartoken  = await UsuarioToken.create(
            //     {
            //         idTelegram:telegram,
            //         numero:telefono,
            //         token:token,
            //         estado:1
            //     }
            // );
            console.log(usuario.toJSON());
        }
        catch (error) {
            console.log(error);
        }
        bot.sendMessage(chatId, `Registro agregado correctamente.`, { parse_mode: "HTML" });
        console.log("Nombre: " + ((_d = msg.contact) === null || _d === void 0 ? void 0 : _d.first_name) + "\nUserID:" + ((_e = msg.contact) === null || _e === void 0 ? void 0 : _e.user_id) + "\nNúmero Telf: " + ((_f = msg.contact) === null || _f === void 0 ? void 0 : _f.phone_number));
    }));
};
exports.botTelegram = botTelegram;
