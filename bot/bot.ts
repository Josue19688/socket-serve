require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';
import ServerSocket from '../server/server';


export  const botTelegram =()=>{
    const token = '5345732567:AAHA5Ax2aCmT8jO4bqcMwiTxOmKmooxc6LA';
    const bot = new TelegramBot(token, {polling:true});




    bot.on('message',(msg)=>{
        // const idNumeroTelgram = msg.from?.id;
        // const nombre = msg.from?.first_name;
        const de = msg.from?.username;

        const cuerpo = msg.text;

        const payload={
            de,
            cuerpo
        }
        console.log(payload);
        const server = ServerSocket.instance;
        server.io.emit('mensaje-nuevo',payload);

    })
}
