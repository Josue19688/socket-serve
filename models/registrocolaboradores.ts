
import { DataTypes } from "sequelize";
import db from "../mysql/connection";


const UsuarioTelegramcolaborador = db.define('T01_usuariosTelegramactualizacion',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    idTelegram:{
        type:DataTypes.STRING
    },
    numero:{
        type:DataTypes.STRING
    },
    nombre:{
        type:DataTypes.STRING
    },
    created_at: {
        type:DataTypes.DATE   
    },
   
},{
    timestamps: false
});

export default UsuarioTelegramcolaborador;