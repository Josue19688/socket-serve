


import { Request, Response} from 'express';
import ServerSocket from '../server/server';

//crear mensajes
export const mensajes=((req:Request, res:Response)=>{
    const cuerpo =  req.body.cuerpo;
    const de = req.body.de;

    const payload={
        de,
        cuerpo
    }
   
    const server = ServerSocket.instance;
    server.io.emit('mensaje-nuevo',payload);
    
    res.json({
        ok:true,
        de,
        cuerpo,
        msg:'Nuevos mensajes agregados'
    })

})

//obtener mensajes
export const getMensajes=((req:Request,res:Response)=>{
    res.json({
        ok:true,
        msg:'Mi primer ruta get'
    })
})


export const postMensajes=((req:Request,res:Response)=>{
    const cuerpo=req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload={
        de,
        cuerpo
    }
    
    const server = ServerSocket.instance;

    //para mandar mensaje a un usuario en especifico
    //para transmitir a todos se quitaria el .in 
    server.io.in(id).emit('mensaje-privado',payload);

    res.json({
        ok:true,
        cuerpo,
        de,
        id
    })
})



