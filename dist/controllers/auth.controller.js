"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogin = void 0;
const mysql_1 = __importDefault(require("../mysql/mysql"));
const getLogin = (req, res) => {
    let data = [];
    const { correo, password } = req.body;
    const escapeCorreo = mysql_1.default.instancia.cnn.escape(correo);
    //verificar si existe el correo
    const existeCorreo = `
    SELECT * FROM usuarios WHERE correo = ${escapeCorreo}`;
    const user = mysql_1.default.ejecutarQuery(existeCorreo, (err, usuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        else {
            data.push(usuario);
            console.log(data);
        }
    });
    console.log(data),
        res.json({
            ok: true,
            data
        });
    // console.log(user);
    // //encriptar la contraseña
    // const salt = bcryptjs.genSaltSync(15);
    // const encriptada  = bcryptjs.hashSync(password,salt);
    // res.json({
    //     ok:true,
    //     correo,
    //    user
    // })
};
exports.getLogin = getLogin;
