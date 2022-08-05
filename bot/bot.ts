require('dotenv').config();

import TelegramBot from 'node-telegram-bot-api';
import UsuarioTelegram from '../models/userTelegram';
import MovimientoColaborador from '../models/movimientoColaborador';


import  sequelize, { Op }  from 'sequelize';


export  const botTelegram =()=>{
    const token:any = process.env.TOKEN;
    const bot = new TelegramBot(token, {polling:true});



  

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

    bot.on('contact', async(msg) => {
        
        var chatId=msg.chat.id;
    
        console.log(msg);
        
        const id = msg.contact?.user_id;
        const nombre = msg.contact?.first_name;
        const telefono=msg.contact?.phone_number;

       

        try {
            const usuario = await  UsuarioTelegram.create({id,nombre,telefono});

        } catch (error) {
            console.log(error);
        }
       
        bot.sendMessage(chatId,`Registro agregado correctamente.`,{parse_mode : "HTML"});
          console.log("Nombre: " + msg.contact?.first_name + "\nUserID:"  +  msg.contact?.user_id + "\nNúmero Telf: " + msg.contact?.phone_number);
    });

  
    bot.on('message', async(msg) => {
       
        const userid:any=msg.from?.id;
        const codigo = msg.text;
        
        // var fecha = msg.date;
       
    
        // var output = Moment.unix(fecha).format('YYYY-MM-DD');
          

            //buscamos el maximo registro de un codigo o gafete
            let resultado = await MovimientoColaborador.findOne({
                where:{
                    numero_gafete:codigo
                },
                attributes:[[sequelize.fn('max', sequelize.col('id')),'max']]
            });

            //encontramos el maximo resutado
            let data = resultado?.toJSON();
            let {max} =data;
            if(!!max){
                 //nos traemos todos los datos del maximo registro encontrado
                let buscar = await MovimientoColaborador.findOne({
                    where:{
                        id:max
                    },
                });
                 
                //destructuramos para poder verificar a que sede pertenece y la ultima
                //accion que tuvo esto solo sera para codigo de gafete
                const result=buscar?.toJSON();
            
                let datocodigo = result.numero_gafete;
                let datosedeorigen=result.sedeOrigen;
                let datoaccion = result.accion;
    
                let nombresede='';
                if(datosedeorigen===1){
                    nombresede='ZONA 4';
                }else if(datosedeorigen===2){
                    nombresede='ZONA 9';
                }else if(datosedeorigen===3){
                    nombresede='NORTE';
                }else if(datosedeorigen===4){
                    nombresede='SUR';
                }else if(datosedeorigen===5){
                    nombresede='ORIENTE';
                }else if(datosedeorigen===6){
                    nombresede='OCCIDENTE';
                }else if(datosedeorigen===10){
                    nombresede='ZONA 1';
                }else if(datosedeorigen===11){
                    nombresede='ZONA 6';
                }else if(datosedeorigen===12){
                    nombresede='ZONA 10';
                }else{
                    nombresede='No existe sede';
                }    

                 //hacemos la consulta para ver si existe el registro de el usuario
                //que inserta y asi poder ver en que sede esta ingresando
                let consulta = await UsuarioTelegram.findOne({
                    where:{
                        id:userid
                    }
                })
    
                let usuario=consulta?.toJSON();
                let sedeinicial=usuario?.nombre;
    
                let nombresedeingreso='';
                if(sedeinicial==='1'){
                    nombresedeingreso='ZONA 4';
                }else if(sedeinicial==='2'){
                    nombresedeingreso='ZONA 9';
                }else if(sedeinicial==='3'){
                    nombresedeingreso='NORTE';
                }else if(sedeinicial==='4'){
                    nombresedeingreso='SUR';
                }else if(sedeinicial==='5'){
                    nombresedeingreso='ORIENTE';
                }else if(sedeinicial==='6'){
                    nombresedeingreso='OCCIDENTE';
                }else if(sedeinicial==='10'){
                    nombresedeingreso='ZONA 1';
                }else if(sedeinicial==='11'){
                    nombresedeingreso='ZONA 6';
                }else if(sedeinicial==='12'){
                    nombresedeingreso='ZONA 10';
                }else{
                    nombresedeingreso='No existe sede';
                }

                 //VAMOS A CONSTRUIR LO QUE SE INSERTARA EN LA BASE DE DATOS
                 let date = new Date();
                 let output =date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' +  String(date.getDate()).padStart(2, '0');
                                 
            if(datoaccion===1){
                let creado = await MovimientoColaborador.create(
                    {
                        numero_gafete:codigo,
                        sedeOrigen:datosedeorigen,
                        sedeIngreso:sedeinicial,
                        usuario:userid,
                        id_ultimo_movimiento:0,
                        accion:2
                    });



                    let todosregistros = await MovimientoColaborador.findAll({
                        raw:true,
                        where:{
                            numero_gafete:codigo,
                            fechaIngreso:{
                                [Op.between]:[output+' 00:00:00',output+' 23:59:59']
                            }
                            
                        }
                    });
                    const reg = [];

                    let cod='';
                if(todosregistros){
                    cod =`<b>Gafete</b>:<i>${codigo}</i> ---> <b>SALIDA</b>\n\n`;
                   
                }
                reg.push(cod);
                todosregistros.forEach(function (item: any) {


                    var fechaIngreso = String(item.fechaIngreso);
                    fechaIngreso = fechaIngreso.slice(3,-32);
                    var acciones = item.accion;
                    let estado='';
                    if(acciones===1){
                        estado='Ingreso';
                    }else{
                        estado='Salida';
                    }

                    

                    //var f = Moment.utc(fechaIngreso).format("YYYY-MM-DD hh:mma");
                    
                    var f = `<b>Fecha:</b><i>${fechaIngreso}</i><i>  ${estado}</i>\n`;
                    reg.push(f);

                });
                bot.sendMessage(msg.chat.id,reg.toString(),{parse_mode : "HTML"});


            }else if(datoaccion===2){
                    let creado = await MovimientoColaborador.create(
                        {
                            numero_gafete:codigo,
                            sedeOrigen:datosedeorigen,
                            sedeIngreso:sedeinicial,
                            usuario:userid,
                            id_ultimo_movimiento:0,
                            accion:1
                        }
                    );  

                    let todosregistros = await MovimientoColaborador.findAll({
                        raw:true,
                        where:{
                            numero_gafete:codigo,
                            fechaIngreso:{
                                [Op.between]:[output+' 00:00:00',output+' 23:59:59']
                            }
                            
                        }
                    });
                    const reg = [];

                    let cod='';
                if(todosregistros){
                    cod =`<b>Gafete</b>:<i>${codigo}</i> ---> <b>INGRESO</b>\n\n`;
                   
                }
                reg.push(cod);
                todosregistros.forEach(function (item: any) {


                    var fechaIngreso = String(item.fechaIngreso);
                    fechaIngreso = fechaIngreso.slice(3,-32);
                    var acciones = item.accion;
                    let estado='';
                    if(acciones===1){
                        estado='Ingreso';
                    }else{
                        estado='Salida';
                    }

                   /// var f = Moment.utc(fechaIngreso).format("YYYY-MM-DD hh:mma");
                  

                    var f = `<b>Fecha:</b><i>${fechaIngreso}</i><i> ${estado}</i>\n`;
                    reg.push(f);

                });
                bot.sendMessage(msg.chat.id,reg.toString(),{parse_mode : "HTML"});

                    
                    // var f:string=`Codigo :${codigo}\nSEDE ORIGEN :${nombresede}\nSEDE INGRESO: ${nombresedeingreso}\nACCION : INGRESO`;
                    // bot.sendMessage(msg.chat.id,f);
                }

            }else{

                let consulta = await UsuarioTelegram.findOne({
                    where:{
                        id:userid
                    }
                })
    
                let usuario=consulta?.toJSON();
                let sedeinicial=usuario?.nombre;
    
                let nombresedeingreso='';
                if(sedeinicial==='1'){
                    nombresedeingreso='ZONA 4';
                }else if(sedeinicial==='2'){
                    nombresedeingreso='ZONA 9';
                }else if(sedeinicial==='3'){
                    nombresedeingreso='NORTE';
                }else if(sedeinicial==='4'){
                    nombresedeingreso='SUR';
                }else if(sedeinicial==='5'){
                    nombresedeingreso='ORIENTE';
                }else if(sedeinicial==='6'){
                    nombresedeingreso='OCCIDENTE';
                }else if(sedeinicial==='10'){
                    nombresedeingreso='ZONA 1';
                }else if(sedeinicial==='11'){
                    nombresedeingreso='ZONA 6';
                }else if(sedeinicial==='12'){
                    nombresedeingreso='ZONA 10';
                }else{
                    nombresedeingreso='No existe sede';
                }

                let creado = await MovimientoColaborador.create(
                    {
                        numero_gafete:codigo,
                        sedeOrigen:0,
                        sedeIngreso:sedeinicial,
                        usuario:userid,
                        id_ultimo_movimiento:0,
                        accion:1
                    }
                );  
                    
                var f:string=`Codigo :${codigo}\nSEDE ORIGEN :0\nSEDE INGRESO: ${nombresedeingreso}\nACCION : INGRESO`;
                bot.sendMessage(msg.chat.id,f);   
            }   
    });
    



    // bot.on('message', async(msg) => {
    //     //console.log(msg);
    //     const userid:any=msg.from?.id;
    //     const codigo = msg.text;

          

    //         //buscamos el maximo registro de un codigo o gafete
    //         let resultado = await MovimientoColaborador.findOne({
    //             where:{
    //                 numero_gafete:codigo
    //             },
    //             attributes:[[sequelize.fn('max', sequelize.col('id')),'max']]
    //         });

    //         //encontramos el maximo resutado
    //         let data = resultado?.toJSON();
    //         let {max} =data;
            
    //         //nos traemos todos los datos del maximo registro encontrado
    //         let buscar = await MovimientoColaborador.findOne({
    //                 where:{
    //                     id:max
    //                 },
    //             });
        
    //         //destructuramos para poder verificar a que sede pertenece y la ultima
    //         //accion que tuvo esto solo sera para codigo de gafete
    //         const result=buscar?.toJSON();
        
    //         let datocodigo = result.numero_gafete;
    //         let datosedeorigen=result.sedeOrigen;
    //         let datoaccion = result.accion;

    //         let nombresede='';
    //         if(datosedeorigen===1){
    //             nombresede='ZONA 4';
    //         }else if(datosedeorigen===2){
    //             nombresede='ZONA 9';
    //         }else if(datosedeorigen===3){
    //             nombresede='NORTE';
    //         }else if(datosedeorigen===4){
    //             nombresede='SUR';
    //         }else if(datosedeorigen===5){
    //             nombresede='ORIENTE';
    //         }else if(datosedeorigen===6){
    //             nombresede='OCCIDENTE';
    //         }else if(datosedeorigen===10){
    //             nombresede='ZONA 1';
    //         }else if(datosedeorigen===11){
    //             nombresede='ZONA 6';
    //         }else if(datosedeorigen===12){
    //             nombresede='ZONA 10';
    //         }else{
    //             nombresede='No existe sede';
    //         }
        
    //         //hacemos la consulta para ver si existe el registro de el usuario
    //         //que inserta y asi poder ver en que sede esta ingresando
    //         let consulta = await UsuarioTelegram.findOne({
    //             where:{
    //                 id:userid
    //             }
    //         })

    //         let usuario=consulta?.toJSON();
    //         let sedeinicial=usuario?.nombre;

    //         let nombresedeingreso='';
    //         if(sedeinicial==='1'){
    //             nombresedeingreso='ZONA 4';
    //         }else if(sedeinicial==='2'){
    //             nombresedeingreso='ZONA 9';
    //         }else if(sedeinicial==='3'){
    //             nombresedeingreso='NORTE';
    //         }else if(sedeinicial==='4'){
    //             nombresedeingreso='SUR';
    //         }else if(sedeinicial==='5'){
    //             nombresedeingreso='ORIENTE';
    //         }else if(sedeinicial==='6'){
    //             nombresedeingreso='OCCIDENTE';
    //         }else if(sedeinicial==='10'){
    //             nombresedeingreso='ZONA 1';
    //         }else if(sedeinicial==='11'){
    //             nombresedeingreso='ZONA 6';
    //         }else if(sedeinicial==='12'){
    //             nombresedeingreso='ZONA 10';
    //         }else{
    //             nombresedeingreso='No existe sede';
    //         }
    //         //VAMOS A CONSTRUIR LO QUE SE INSERTARA EN LA BASE DE DATOS
        
    //         if(datoaccion===1){
    //         let creado = await MovimientoColaborador.create(
    //             {
    //                 numero_gafete:codigo,
    //                 sedeOrigen:datosedeorigen,
    //                 sedeIngreso:sedeinicial,
    //                 usuario:userid,
    //                 id_ultimo_movimiento:0,
    //                 accion:2
    //             });

    //             var f:string=`Codigo :${codigo}\nSEDE ORIGEN :${nombresede}\nSEDE INGRESO: ${nombresedeingreso}\nACCION : Salida`;
    //             bot.sendMessage(msg.chat.id,f);
    //         }else{
    //             let creado = await MovimientoColaborador.create(
    //                 {
    //                     numero_gafete:codigo,
    //                     sedeOrigen:datosedeorigen,
    //                     sedeIngreso:sedeinicial,
    //                     usuario:userid,
    //                     id_ultimo_movimiento:0,
    //                     accion:1
    //                 }
    //             );  
                    
    //             var f:string=`Codigo :${codigo}\nSEDE ORIGEN :${nombresede}\nSEDE INGRESO: ${nombresedeingreso}\nACCION : INGRESO`;
    //             bot.sendMessage(msg.chat.id,f);
    //         }   
    // });
    


    
    // bot.onText(/^\/reporte/,(msg, match)=>{
    //     var chatId=msg.chat.id;//mi id de chat
    //     var miid:any=msg.from?.id;
    //     var nombre = msg.from?.first_name;
    //     bot.getChatMember(chatId, miid).then(function(data) {
    //         if ((data.status == "creator") || (data.status == "administrator")){
    //             var botones = {
    //                 reply_markup:{
    //                     inline_keyboard:[
    //                         [
    //                             {text:"saliendo",callback_data:'boton1'},
    //                             {text:"ingresando",callback_data:'boton2'}
    //                         ],
    //                     ]
    //                 }
    //             };
    //             bot.sendMessage(chatId,"Marcar Reporte",botones);

    //             bot.on('callback_query', async function onCallbackQuery(accionboton){
    //                 const data = accionboton.data;
                   
                  
        
        
                    
    //                 let date = new Date();
    //                 let output =date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' +  String(date.getDate()).padStart(2, '0');
                    
        
        
    //                 if(data=='boton1'){
        
                              
                            
    //                     const cuerpo='saliendo';
    //                     const myId = accionboton.from.id;
    //                     const de = accionboton.from.first_name;
    //                     const estad= 2;
                     
    //                   //creamos el registro
    //                    let movimientosalida=await  MovimientoAgente.create({nombre:de,unico:myId,accion:cuerpo,estado:estad,idultimo:0})
                       

                       

    //                     //josue
    //                     const datos = movimientosalida.toJSON();
    //                     const {fechasalida, nombre, accion,estado}=datos;
        
    //                     const payload={
    //                         fechasalida, 
    //                         nombre,
    //                         myId,
    //                         accion,
    //                         estado
    //                     }
    //                     const server = ServerSocket.instance;
    //                     server.io.emit('mensaje-nuevo',payload);
    //                     // const registros = await MovimientoAgente.findAll({
    //                     //     where:{
    //                     //         created_at:{
    //                     //             [Op.between]:[output+' 00:00:01',output+' 23:59:59']
    //                     //         }
    //                     //     }
    //                     // });
        
                        
    //                     // const server = ServerSocket.instance;
    //                     // server.io.emit('mensaje-nuevo',registros);
    //                     bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de salida agregado correctamente', show_alert: true});
    //                 }
    //                     if(data=='boton2'){
    //                         const cuerpo='ingresando';
    //                         const myId = accionboton.from.id;
    //                         const de = accionboton.from.first_name;
                           
                           
    //                         ///me traera el maximo id de la tabla
    //                         let busqueda = await MovimientoAgente.max('id',
    //                         {
    //                             where:{
    //                                 unico:myId
    //                             }
    //                         }
    //                         );

    //                         const estad= 1;
                     
    //                         //creamos el registro
    //                         let movimientosalida= await  MovimientoAgente.create({nombre:de,unico:myId,accion:cuerpo,estado:estad,idultimo:busqueda})
                            
    //                         // await MovimientoAgente.update(
    //                         //     {
    //                         //         ingreso:1
    //                         //     },
    //                         //     {
    //                         //         where:{
    //                         //             id:busqueda
    //                         //         }
    //                         //     }
    //                         // );

    //                         //console.log(busqueda);
    //                         ///let d = new Date(busqueda);
                            
    //                        // console.log(d.toString());

    //                        const datos = movimientosalida.toJSON();
    //                        const {fechasalida, nombre, accion,estado}=datos;
           
    //                        const payload={
    //                            fechasalida, 
    //                            nombre,
    //                            myId,
    //                            accion,
    //                            estado
    //                        }
                          


                          
    //                         const server = ServerSocket.instance;
    //                         server.io.emit('mensaje-nuevo',payload);
    //                     //     const registros = await MovimientoAgente.findAll({
    //                     //         where:{
    //                     //             created_at:output
    //                     //         }
    //                     //     });
            

    //                     //    console.log(registros);


    //                         // const server = ServerSocket.instance;
    //                         // server.io.emit('mensaje-nuevo',registros);
    //                         bot.answerCallbackQuery(accionboton.id, {text: 'Reporte de ingreso agregado correctamente', show_alert: true});
    //                     }   
                          
                     
                      
    //             })
               
    //         }else{
    //             bot.sendMessage(chatId, nombre+" No tienes permisos para ejecutar comandos.");
    //             return;
    //         }
    //     });
      
       
      
        
    
        
    // })

 
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

    
      
      // Obtenemos la ubicación que nos manda un usuario
    // bot.on('location', (msg) => {
    //     console.log(msg.location?.latitude);
    //     console.log(msg.location?.longitude);
    // });
      
    //   // Obtenemos la información de contacto que nos manda un usuario
    // bot.on('contact', async(msg) => {
        
    //     var chatId=msg.chat.id;
    
        
     

    function generateToken(length:any){
        let rand=()=>Math.random().toString(36).substr(2);
        return (rand()+rand()+rand()+rand()).substr(0,length)
    }
    
   
   
}

