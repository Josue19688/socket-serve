/*CON ESTO IRIA A LA BASE DE DATOS A TRAER EL REGISTRO REALIZADO TODO SE HARA EN EL CONTROLADOR */
import { DataTypes,Sequelize } from "sequelize";
import db from "../mysql/connection";


const MovimientoColaborador = db.define('T01_registrosColaboradoresVisitas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    numero_gafete:{
        type:DataTypes.STRING
    },
    sedeOrigen:{
        type:DataTypes.INTEGER
    },
    sedeIngreso:{
        type:DataTypes.INTEGER
    },
    fechaIngreso:{
        type:DataTypes.NOW
    },
    usuario:{
        type:DataTypes.STRING
    },
    id_ultimo_movimiento: {
        type:DataTypes.INTEGER
       
    },
    accion:{
        type:DataTypes.INTEGER
    }
   
},{
    timestamps: false
});

export default MovimientoColaborador;