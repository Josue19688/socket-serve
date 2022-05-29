require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';
import UsuarioTelegram from '../models/userTelegram';
import ServerSocket from '../server/server';
import MovimientoAgente from '../models/movimientoAgente';




export  const botTelegram =()=>{
    const token:any = process.env.TOKEN;
    const bot = new TelegramBot(token, {polling:true});



    bot.onText(/^\/start/,(msg)=>{

        const chatId = msg.chat.id;
        const nameUser = msg.from?.first_name;
        const alias = msg.from?.username;
        
        bot.sendMessage(chatId, "Bienvenido  \n" + nameUser+"\n "+alias+"\n COMANDOS :\n 211 saliendo \n 211 ingresando ");
        return;
    });

    bot.onText(/^\/dado/, (msg) => {
        bot.sendDice(msg.chat.id);
    });

    bot.onText(/^\/dardo/, (msg) => {
        const opts = {
            'emoji': '🎯'
        }
        bot.sendDice(msg.chat.id, opts);
    });

   


    
    bot.onText(/^\/reporte/,function(msg){
        var chatId=msg.chat.id;
       
        var botones = {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"saliendo",callback_data:'boton1'},
                        {text:"ingresando",callback_data:'boton2'}
                    ],
                ]
            }
        };

        bot.sendMessage(chatId,"Marcar Reporte",botones);

    
         bot.on('callback_query', async function onCallbackQuery(accionboton){
            const data = accionboton.data;
           




                if(data=='boton1'){
                const cuerpo='saliendo';
                const myId = accionboton.from.id;
                const de = accionboton.from.first_name;
                const estad= 2;
             
              
                const movimientosalida = await MovimientoAgente.create({nombre:de,accion:cuerpo,estado:estad});
                const datos = movimientosalida.toJSON();
                const {fechasalida, nombre, accion,estado}=datos;

                const payload={
                    fechasalida, 
                    nombre,
                    accion,
                    estado
                }
                const server = ServerSocket.instance;
                server.io.emit('mensaje-nuevo',payload);
                bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de salida agregado correctamente', show_alert: true});
                }
                if(data=='boton2'){
                    const cuerpo='ingresando';
                    const myId = accionboton.from.id;
                    const de = accionboton.from.first_name;
                    const estad= 1;
                   
                    const movimientosalida = await MovimientoAgente.create({nombre:de,accion:cuerpo,estado:estad});
                    const datos = movimientosalida.toJSON();
                    const {fechasalida, nombre, accion,estado}=datos;


                    const payload={
                        fechasalida, 
                        nombre,
                        accion,
                        estado
                    }
                    const server = ServerSocket.instance;
                    server.io.emit('mensaje-nuevo',payload);
                    bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de ingreso agregado correctamente', show_alert: true});
                }   
        })
    })

 
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
        const opts:any = {
          reply_markup: JSON.stringify({
            keyboard: [
              [{text: 'Contacto', request_contact: true}],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          }),
        };
        bot.sendMessage(msg.chat.id, 'Enviar Contacto para registro de reportes.', opts);
    });
      
      // Obtenemos la ubicación que nos manda un usuario
    bot.on('location', (msg) => {
        console.log(msg.location?.latitude);
        console.log(msg.location?.longitude);
    });
      
      // Obtenemos la información de contacto que nos manda un usuario
    bot.on('contact', async(msg) => {
        
        var chatId=msg.chat.id;
    
        let fecha = new Date();
     
        
        const id = msg.contact?.user_id;
        const nombre = msg.contact?.first_name;
        const telefono=msg.contact?.phone_number;
        try {
            const usuario = await  UsuarioTelegram.create({id,nombre,telefono});
            console.log(usuario.toJSON());

        } catch (error) {
            console.log(error);
        }
       
        bot.sendMessage(chatId,"Registro agregado correctamente. aplicar /reporte para registrar movimientos diarios");
          console.log("Nombre: " + msg.contact?.first_name + "\nUserID:"  +  msg.contact?.user_id + "\nNúmero Telf: " + msg.contact?.phone_number);
    });

    /**
     * PARA PODER CAPTURAR EL REGISTRO DE UN CODIGO DE UN COLABORADOR
     */

    
 bot.on('message', (msg) => {
    
   console.log(msg);
  

});

   
}
