

import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UserList } from "../classes/usuarios-lista";
import { Usuario } from "../classes/usuario";

export const usuarioConectados=new UserList();


export const conectarClinte=(cliente:Socket)=>{

    const usuario = new Usuario(cliente.id);
    usuarioConectados.agregar(usuario);
}

export const desconectar = (cliente:Socket)=>{
    cliente.on('disconnect',()=>{
        usuarioConectados.borrarUsuario(cliente.id);
    })
}

//escuchar mensjaes
export const mensaje=(cliente:Socket, io:socketIO.Server)=>{
    cliente.on('mensaje',(payload:{de:string, cuerpo:string})=>{
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo',payload);
    })
}

export const loginWS=(cliente:Socket,io:socketIO.Server)=>{
    cliente.on('configurar-usuario',(payload:{nombre:string}, callback:Function)=>{
        usuarioConectados.actualizarNombre(cliente.id,payload.nombre);
        callback({
            ok:true,
            mensaje:`Usuario ${payload.nombre}, configurado`
        })
    })
}