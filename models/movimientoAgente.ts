
import { DataTypes } from "sequelize";
import db from "../mysql/connection";


const MovimientoAgente = db.define('T10_movimientoAgente',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    accion:{
        type:DataTypes.STRING
    },
    estado:{
        type:DataTypes.INTEGER
    },
    fechasalida:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
        
    }
});

export default MovimientoAgente