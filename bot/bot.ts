require('dotenv').config();
import {Op,Sequelize, where} from 'sequelize';
import TelegramBot from 'node-telegram-bot-api';
import UsuarioTelegram from '../models/userTelegram';
import ServerSocket from '../server/server';
import MovimientoAgente from '../models/movimientoAgente';




export  const botTelegram =()=>{
    const token:any = process.env.TOKEN;
    const bot = new TelegramBot(token, {polling:true});



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

   


    
    bot.onText(/^\/reporte/,(msg, match)=>{
        var chatId=msg.chat.id;//mi id de chat
        var miid:any=msg.from?.id;
        var nombre = msg.from?.first_name;
        bot.getChatMember(chatId, miid).then(function(data) {
            if ((data.status == "creator") || (data.status == "administrator")){
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
                   
                  
        
        
                    
                    let date = new Date();
                    let output =date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' +  String(date.getDate()).padStart(2, '0');
                    
        
        
                    if(data=='boton1'){
        
                              
                            
                        const cuerpo='saliendo';
                        const myId = accionboton.from.id;
                        const de = accionboton.from.first_name;
                        const estad= 2;
                     
                      //creamos el registro
                        MovimientoAgente.create({nombre:de,unico:myId,accion:cuerpo,estado:estad,ingreso:0})
                        .then(()=>console.log('Insertado Correctamente!!'))
                        .catch(error=>console.log(error));
                        
        
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
                        bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de salida agregado correctamente', show_alert: true});
                    }
                        if(data=='boton2'){
                            const cuerpo='ingresando';
                            const myId = accionboton.from.id;
                            const de = accionboton.from.first_name;
                            const estad= 1;
                           
                            //me traera el maximo id de la tabla
                            let busqueda = await MovimientoAgente.max('id',
                            {
                                where:{
                                    unico:myId
                                }
                            }
                            );
                            
                            await MovimientoAgente.update(
                                {
                                    ingreso:1
                                },
                                {
                                    where:{
                                        id:busqueda
                                    }
                                }
                            ).then(()=>console.log('Actualizado  Correctamente!!'))
                            .catch(error=>console.log(error));

                            //console.log(busqueda);
                            ///let d = new Date(busqueda);
                            
                           // console.log(d.toString());


                          


                          
                            // const server = ServerSocket.instance;
                            // server.io.emit('mensaje-nuevo',payload);
                            const registros = await MovimientoAgente.findAll({
                                where:{
                                    created_at:output
                                }
                            });
            

                           console.log(registros);


                            const server = ServerSocket.instance;
                            server.io.emit('mensaje-nuevo',registros);
                            bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de ingreso agregado correctamente', show_alert: true});
                        }   
                          
                     
                      
                })
               
            }else{
                bot.sendMessage(chatId, nombre+" No tienes permisos para ejecutar comandos.");
                return;
            }
        });
      
       
      
        
    
        
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

    
//  bot.on('message', (msg) => {
//     const codigo = msg.text;



//    console.log(msg);
  

// });


bot.onText(/^\/borratodo/, (msg) => {
    console.log(msg);
    var chatId = msg.chat.id;
    var messageId:any = msg.message_id;
    var replyMessage:any = msg.reply_to_message?.message_id;
    
    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.deleteMessage(chatId, messageId);
    //bot.deleteMessage(chatId, replyMessage);
});

   
}
