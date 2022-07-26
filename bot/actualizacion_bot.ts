require('dotenv').config();

import TelegramBot from 'node-telegram-bot-api';
import ServerSocket from '../server/server';
import UsuarioTelegramcolaborador from '../models/registrocolaboradores';
import UsuarioToken from '../models/tokenupdate';




export  const botTelegramActualizacion =()=>{
    const token:any = process.env.ACTUALIZACION_TOKEN;
    const bot = new TelegramBot(token, {polling:true});

    
 
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
    // bot.on('location', (msg) => {
    //     console.log(msg.location?.latitude);
    //     console.log(msg.location?.longitude);
    // });
      
    //   // Obtenemos la información de contacto que nos manda un usuario
    bot.on('contact', async(msg) => {
        
        var chatId=msg.chat.id;
    
        
        
        const telegram = msg.contact?.user_id;
        const nombre = msg.contact?.first_name;
        const telefono=msg.contact?.phone_number;

        const token = generateToken(11)

        try {
            //const usuario = await  UsuarioTelegram.create({id,nombre,telefono});

            const registro = await UsuarioTelegramcolaborador.create({idTelegram:telegram,numero:telefono,nombre});

            const agregartoken  = await UsuarioToken.create(
                {
                    idTelegram:telegram,
                    numero:telefono,
                    token:token,
                    estado:1
                }
            );
            console.log(agregartoken.toJSON());

        } catch (error) {
            console.log(error);
        }
       
        bot.sendMessage(chatId,`Registro agregado correctamente. Su <b>Token</b> : <i>${token}</i>  \nsolo podra utilizarlo una vez.`,{parse_mode : "HTML"});
          console.log("Nombre: " + msg.contact?.first_name + "\nUserID:"  +  msg.contact?.user_id + "\nNúmero Telf: " + msg.contact?.phone_number);
    });

    function generateToken(length:any){
        let rand=()=>Math.random().toString(36).substr(2);
        return (rand()+rand()+rand()+rand()).substr(0,length)
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
   
}

