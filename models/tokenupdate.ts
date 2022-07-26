
import { DataTypes } from "sequelize";
import db from "../mysql/connection";


const UsuarioToken = db.define('T01_tokenupdate',{
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
    token:{
        type:DataTypes.STRING
    },
    estado:{
        type:DataTypes.STRING
    },
    created_at: {
        type:DataTypes.DATE   
    },
    actualizado:{
        type:DataTypes.NOW
    }
   
},{
    timestamps: false
});

export default UsuarioToken;