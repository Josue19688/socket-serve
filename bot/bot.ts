require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';
import ServerSocket from '../server/server';


export  const botTelegram =()=>{
    const token = '5345732567:AAHA5Ax2aCmT8jO4bqcMwiTxOmKmooxc6LA';
    const bot = new TelegramBot(token, {polling:true});


    bot.onText(/^\/start/,(msg)=>{
        const chatId = msg.chat.id;
        const nameUser = msg.from?.first_name;
        const alias = msg.from?.username;
        
        bot.sendMessage(chatId, "Bienvenido  \n" + nameUser+"\n "+alias+"\n COMANDOS :\n 211 saliendo \n 211 ingresando ");
        return;
    });


    bot.onText(/^\/mensaje/,(msg)=>{
        const chatId = msg.chat.id;
        const idNumeroTelgram = msg.from?.id;
        const nombre = msg.from?.first_name;
        const de = msg.from?.username;

        const cuerpo = msg.text;

        const payload={
            de,
            cuerpo
        }
        console.log(payload);
        const server = ServerSocket.instance;
        server.io.emit('mensaje-nuevo',payload);

        bot.sendMessage(chatId, "Su reporte fue exitoso!!");

    })



    
 bot.onText(/^\/reporte/,function(msg){
    var chatId=msg.chat.id;

    var botones = {
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"saliendo",callback_data:'boton1'},
                    {text:"ingresando",callback_data:'boton2'}
                ]
            ]
        }
    };

    bot.sendMessage(chatId,"Marcar Reporte",botones);

   
    bot.on('callback_query',function onCallbackQuery(accionboton){
        const data = accionboton.data;
       
        

        // let fecha = accionboton.message?.date;
        // const dt = new Date(fecha*1000); 
        // var nuevaFecha = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ' -- ' + dt;
        if(data=='boton1'){
        const cuerpo='saliendo';
        const myId = accionboton.from.id;
        const de = accionboton.from.first_name;
        //const de = accionboton.from.username;
        const payload={
            de,
            cuerpo
        }
        console.log(payload);
        const server = ServerSocket.instance;
        server.io.emit('mensaje-nuevo',payload);

       

            bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de salida agregado correctamente', show_alert: true});
        }
        if(data=='boton2'){
            const cuerpo='ingresando';
            const myId = accionboton.from.id;
            const de = accionboton.from.first_name;
            //const de = accionboton.from.username;
            const payload={
                de,
                cuerpo
            }
            console.log(payload);
            const server = ServerSocket.instance;
            server.io.emit('mensaje-nuevo',payload);
    
           
    
                bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de ingreso agregado correctamente', show_alert: true});
        }
       
    })
})
}
