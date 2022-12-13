import {Sequelize} from "sequelize"; //Getting Sequelize class from sequelize package

// const {DB_HOST, DB_USER, DB_PASS, DB_NAME} = process.env;


const sequelize = new Sequelize("twitter-websocket", "tumertw", "tumer", {
    host: "92.205.8.227",
    dialect: "mysql",
    port:"3306"
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
