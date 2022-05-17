

import {Router, Request, Response} from 'express';
import {getMensajes,mensajes,postMensajes} from '../controllers/mensajesController';
import { getUsuarios,getUsuariosDetalles,getUsuariosDB } from '../controllers/usuariosController';


export const router = Router();

router.post('/mensajes',mensajes);
router.get('/mensajes',getMensajes);
router.post('/mensajes/:id',postMensajes);

router.get('/usuarios',getUsuarios);
router.get('/usuarios/detalle',getUsuariosDetalles);
router.get('/userdb',getUsuariosDB);



