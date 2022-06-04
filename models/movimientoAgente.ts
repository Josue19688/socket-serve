
import { DataTypes,Sequelize } from "sequelize";
import db from "../mysql/connection";


const MovimientoAgente = db.define('T10_movimientoAgente',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    unico:{
        type:DataTypes.STRING
    },
    accion:{
        type:DataTypes.STRING
    },
    estado:{
        type:DataTypes.INTEGER
    },
    ingreso:{
        type:DataTypes.INTEGER
    },
    created_at: {
        type:DataTypes.DATE
       
    },
    updated_at: {
        type:DataTypes.DATE
       
    },
   
},{
    timestamps: false
});

export default MovimientoAgente