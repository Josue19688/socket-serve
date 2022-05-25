
import { Request, Response} from 'express';
import bcryptjs from 'bcryptjs';
import ServerSocket from '../server/server';
import { Usuario } from '../classes/usuario';
import MySQL from '../mysql/mysql';


export const getLogin = (req:Request, res:Response)=>{
    let data:string[]=[];
    const {correo, password}= req.body;
    const escapeCorreo = MySQL.instancia.cnn.escape(correo);
    

    //verificar si existe el correo

    const existeCorreo = `
    SELECT * FROM usuarios WHERE correo = ${ escapeCorreo}`;

    const user =MySQL.ejecutarQuery(existeCorreo,(err:any,usuario:any)=>{
        if(err){
            res.status(400).json({
                ok:false,
                error:err
            })
        }else{
          data.push(usuario);
          console.log(data);
           
        }
        
    })

    console.log(data),


    res.json({
        ok:true,
        data
    })


    // console.log(user);


    // //encriptar la contraseña

    // const salt = bcryptjs.genSaltSync(15);
    // const encriptada  = bcryptjs.hashSync(password,salt);

    // res.json({
    //     ok:true,
    //     correo,
    //    user
      
    // })
}