


import { Request, Response} from 'express';


export const getMensajes=((req:Request,res:Response)=>{
    res.json({
        ok:true,
        msg:'Mi primer ruta get'
    })
})




