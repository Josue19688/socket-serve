

import mysql = require('mysql');

export default class MySQL{


    private static _instance:MySQL;

    cnn:mysql.Connection;

    conectado:boolean=false;

    constructor(){
        
        this.cnn=mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'',
            database:'socket'
        });

        this.conectarDB();
    }

    public static get instancia(){
        return this._instance || (this._instance=new this());
    }

    //podremos ejecutar cualquier query |insert|update|select|delete y mas
    static ejecutarQuery(query:string, callback:any){
        this.instancia.cnn.query(query,(err,results,fields)=>{
            if(err){
                console.log('Error al ejecutar la consulta');
                console.log(err.message);
               
                return callback(err);
            }
            if(results.length===0){
                callback('El registro solicitado no existe..');
            }else{
                callback(null,results);
            }
           

        })
    }
    private conectarDB(){
        this.cnn.connect((err:mysql.MysqlError)=>{
            if(err){
                console.log(err.message);
                return;
            }
            this.conectado=true;
            console.log('Base datos online');
        })
    }





}