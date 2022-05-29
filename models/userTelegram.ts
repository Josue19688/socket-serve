
import { DataTypes } from "sequelize";
import db from "../mysql/connection";


const UsuarioTelegram = db.define('T10_usuarioTelegram',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    telefono:{
        type:DataTypes.STRING
    },
    fechaCreacion:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
        
    }
});

export default UsuarioTelegram;