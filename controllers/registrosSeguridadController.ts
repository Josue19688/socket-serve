/*Este controlador tiene la finalidad de recibir datos desde el silan y mostrarlos via socket a la vista */
import { Request, Response} from 'express';
import fs from 'fs';
import  sequelize  from 'sequelize';

import MovimientoColaborador from '../models/movimientoColaborador';
import ServerSocket from '../server/server';

//OBTENER LOS DATOS DEL REGISTRO PARA MANDARLOS A LA VISTA
 const registroMovimiento = ((req:Request, res:Response)=>{
    const codigo =  req.body.buscar;
    const ingreso =  req.body.zona;
  
   

    
        MovimientoColaborador.findAll({
            raw:true,
            where:{
                numero_gafete:codigo
            },
            attributes:[[sequelize.fn('max', sequelize.col('id')),'max']]
        }).then((resp)=>{
            let resultado:any = resp[0];
            let maximo =resultado.max;
            

            MovimientoColaborador.findAll({
                raw:true,
                where:{
                    id:maximo
                }
            }).then((result)=>{

                const data:any=result[0];
                const {numero_gafete,sedeIngreso,accion,usuario}=data;

                let movimiento='';
                if(accion===1){
                    movimiento='Ingreso';
                }
                if(accion===2){
                    movimiento='Salida';
                }

                let sede='';

                switch(sedeIngreso){
                    case 1:
                        sede='ZONA 4';
                        break;
                    case 2:
                        sede='ZONA 9';
                        break;
                    case 3:
                        sede='NORTE';
                        break;
                    case 4:
                        sede='SUR';
                        break;
                    case 5:
                        sede='ORIENTE';
                        break;
                    case 6:
                        sede='OCCIDENTE';
                        break;
                    case 10:
                        sede='ZONA 1';
                        break;
                    case 11:
                        sede='ZONA 6';
                        break;
                    case 12:
                        sede='ZONA 10';
                        break;
                    default:
                        sede='El dato no se encuentra';
                        break;
                }
                
                const payload={
                    numero_gafete,
                    sede,
                    movimiento,
                    usuario
                }
            
               
             
               
             
                const server = ServerSocket.instance;
                server.io.emit('mensaje2-nuevo',payload);

               

            }).catch(error=>console.log(error));
             
        }).catch(error=>console.log(error));
   


        ///Primero verificamos el dato si existe
        // const leerRegistro = fs.readFileSync('./data/asistencia.json','utf-8');
        // let registros = Array.from(JSON.parse(leerRegistro));

        //   // //Despues escribimos en el archivo
        // let data = {
        //     resultado,
        //     codigo
        // }
        // registros.push(data);
        // const json_registros = JSON.stringify(registros);
        // fs.writeFileSync('./data/asistencia.json',json_registros,'utf-8');

    
   

    
  
    res.json({
        ok:true,
       codigo,
        msg:'Nuevos registro agregados'
    })

})




   
    
    

    //     let fecha = accionboton.message.date;
    //     var dt = new Date(fecha*1000); 
    //     var nuevaFecha = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ' -- ' + dt;
       

        

    // //leer datos de un json creoado
    // const leerAsistencia = fs.readFileSync('./data/asistencia.json','utf-8');
    // let asistencia = Array.from(JSON.parse(leerAsistencia));

   



module.exports= {
    registroMovimiento
}
