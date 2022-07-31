
import {Router} from 'express';
import {check} from 'express-validator';
import { getLogin } from '../controllers/auth.controller';
import {getMensajes,mensajes,postMensajes} from '../controllers/mensajesController';
import { registroMovimiento } from '../controllers/registrosSeguridadController';
import { getUsuarios,getUsuariosDetalles,getUsuariosDB } from '../controllers/usuariosController';
import { validarCampos } from '../middlewares/validator-campos';


export const router = Router();



/**authenticacion de usuarios */

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail().notEmpty(),
    check('password','La contraseña es obligatoria minimo de 6 digitos.').notEmpty(),
    validarCampos],
    getLogin
);

router.post('/mensajes',mensajes);
router.get('/mensajes',getMensajes);
router.post('/mensajes/:id',postMensajes);

router.get('/usuarios',getUsuarios);
router.get('/usuarios/detalle',getUsuariosDetalles);
router.get('/userdb',getUsuariosDB);

/*Rutas para los registros de seguridad */
router.post('/registroseg',registroMovimiento);

