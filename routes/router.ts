

import {Router, Request, Response} from 'express';
import {getMensajes,mensajes,postMensajes} from '../controllers/mensajesController';
import { getUsuarios } from '../controllers/usuariosController';


export const router = Router();

router.post('/mensajes',mensajes);
router.get('/mensajes',getMensajes);
router.post('/mensajes/:id',postMensajes);

router.get('/usuarios',getUsuarios);