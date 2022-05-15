import { Request, Response} from 'express';


export const getUsuarios=((req:Request,res:Response)=>{
    res.json({
        ok:true,
        msg:'Obtener todos los usuarios conectados'
    })
})
