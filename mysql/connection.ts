

import  {Sequelize} from 'sequelize';



const db = new Sequelize('digici_full','rescobar','rescobar123',{
    host:'192.168.0.29',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
});


export default db;