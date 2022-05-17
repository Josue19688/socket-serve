"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class MySQL {
    constructor() {
        this.conectado = false;
        this.cnn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'socket'
        });
        this.conectarDB();
    }
    static get instancia() {
        return this._instance || (this._instance = new this());
    }
    //podremos ejecutar cualquier query |insert|update|select|delete y mas
    static ejecutarQuery(query, callback) {
        this.instancia.cnn.query(query, (err, results, fields) => {
            if (err) {
                console.log('Error al ejecutar la consulta');
                console.log(err.message);
                return callback(err);
            }
            if (results.length === 0) {
                callback('El registro solicitado no existe..');
            }
            else {
                callback(null, results);
            }
        });
    }
    conectarDB() {
        this.cnn.connect((err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            this.conectado = true;
            console.log('Base datos online');
        });
    }
}
exports.default = MySQL;
