import {Sequelize} from "sequelize"; //Getting Sequelize class from sequelize package
import dotenv from "dotenv"; //importing dotenv module. It gonna allow us to reach config's contents on process.env

dotenv.config({path:"./config/config.env"}); //specifying the path of config file

let {DB_USER, DB_PASS, DB_HOST, DB_NAME, DB_PORT} = process.env;

if(process.env.NODE_ENV == 'development'){
    DB_USER = process.env.LOCAL_DB_USER;
    DB_PASS = process.env.LOCAL_DB_PASS;
    DB_HOST = process.env.LOCAL_DB_HOST;
    DB_NAME = process.env.LOCAL_DB_NAME;
    DB_PORT = process.env.LOCAL_DB_PORT;
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "mysql",
    port: DB_PORT
});

try
{
    await sequelize.authenticate();
    console.log("Database connection successfull");
}
catch(err)
{
    console.log(`Error: ${err}`);
}

export default sequelize;
