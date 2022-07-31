


import { DataTypes,Sequelize } from "sequelize";
import db from "../mysql/connection";


const Capacitaciones = db.define('T09_asistenciacapacitaciones',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    mensaje:{
        type:DataTypes.STRING
    },
    created_at: {
        type:DataTypes.DATE
    },
   
},{
    timestamps: false
});

export default Capacitaciones;