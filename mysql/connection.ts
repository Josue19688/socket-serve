

import  {Sequelize} from 'sequelize';



const db = new Sequelize('xxxxx','xxxxxxx','xxxxxxxxx',{
    host:'xxxxxxxx',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
});


export default db;