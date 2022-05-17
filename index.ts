import ServerSocket from "./server/server";
import { router } from "./routes/router";
import express from 'express';
import cors from "cors";
import MySQL from "./mysql/mysql";



const server = ServerSocket.instance;


server.app.use(express.json())

server.app.use(cors());


server.app.use('/',router);






server.start(()=>{
    console.log(`Servidor corriendo en el puerto ${server.port}`);
})