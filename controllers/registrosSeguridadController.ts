/*Este controlador tiene la finalidad de recibir datos desde el silan y mostrarlos via socket a la vista */
import { Request, Response} from 'express';
import ServerSocket from '../server/server';

//crear mensajes
export const registroMovimiento=((req:Request, res:Response)=>{
    const cuerpo =  req.body.buscar;
    const de='Josue';

    const payload={
        cuerpo,
        de
    }
 
    const server = ServerSocket.instance;
    server.io.emit('mensaje2-nuevo',payload);
  
    res.json({
        ok:true,
       cuerpo,
        msg:'Nuevos registro agregados'
    })

})





