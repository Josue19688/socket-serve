import express from 'express';
import { SERVER_PORT } from '../global/enviroments';
import { Server } from "socket.io";
import http from 'http';

import * as socket from '../sockets/sockets';


export default class ServerSocket{

    private static _instance:ServerSocket;

    public app:express.Application;
    public port:number;

    public io:Server;
    private httpServer:http.Server;

    private constructor(){
        this.app=express();
        this.port=SERVER_PORT;

        this.httpServer=new http.Server(this.app);
        this.io = new Server(this.httpServer,{
            cors: {
              origin: "http://localhost:4200",
              allowedHeaders: ["my-custom-header"],
              credentials: true
            }
          });

        this.escucharSockets();
    }

    public static get instance(){
        return this._instance || (this._instance=new this());
    }

    private escucharSockets(){
       

        this.io.on('connection',cliente=>{
            /**
             * Configurar usuario
             */

            socket.conectarClinte(cliente,this.io);
             socket.loginWS(cliente,this.io);


            //obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);




            //aqui iran todos los metodos que quiero emitir 
            //o escuchar de los sockets
            socket.desconectar(cliente,this.io);
            socket.mensaje(cliente,this.io);
          


        })
    }


    start(callback:any){
        this.httpServer.listen(this.port,callback);
    }





    //visitar esta pagina para la documentacion del cors con socketio
    //https://socket.io/docs/v4/handling-cors/
}