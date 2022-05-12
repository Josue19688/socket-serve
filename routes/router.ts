

import {Router, Request, Response} from 'express';
import {getMensajes} from '../controllers/mensajesController';


export const router = Router();


router.get('/mensajes',getMensajes)