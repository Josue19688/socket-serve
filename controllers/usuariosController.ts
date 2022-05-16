import { Request, Response} from 'express';

import ServerSocket from '../server/server';
import { Socket } from 'socket.io';
import { usuarioConectados } from '../sockets/sockets';


//metodod para obtener los usuarios conectados via socket
export const getUsuarios=((req:Request,res:Response)=>{

    const server  =  ServerSocket.instance;
    const data:any[] = [];
    server.io.fetchSockets()
        .then(resp=>{
            for(let i in resp){
                data.push(resp[i].id);
              
            }   
            res.json({
                ok:true,
               dato:data
            })
        }).catch(function(e) {
            console.log('Error al mostra el id del usuarios:',e); // "oh, no!"
        });
});

//obtener usuarios por id y sus nombres
export const getUsuariosDetalles=((req:Request,res:Response)=>{

    res.json({
        ok:true,
        data:usuarioConectados.getLista()
    })
})





