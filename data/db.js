const mysql = require("mysql2");
const config = require("../config/config.js");

const Sequelize=require("sequelize");

const sequelize=new Sequelize(config.db.database,config.db.user,config.db.password,{
    dialect:"mysql",
    host:config.db.host,
    define: {
        timestamps: false
    },
    storage:"./session.mysql"
})
async function connect(){
    try{
    await sequelize.authenticate();
    console.log("Mysqle bağlandı")
    }
    catch(err){
        console.log("Bağlanılamadı",err);
    }
}
connect();
module.exports=sequelize; 
