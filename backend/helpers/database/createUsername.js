import sequelize from "./dbConnection.js";
import { Sequelize } from "sequelize";
import randomInteger from "random-int";

export const createUsername = async(name) => {

    const chars = {
        'ü': 'u',
        'ö': 'o',
        'ı': 'i',
        'ş': 's',
        'ç': 'c',
        'g': 'ğ',
        "?": ""
    };

    let username = name.replaceAll(" ", "");
    username = String(username.replace(/[üöışçg?]/g, m=>chars[m])).toLowerCase();
    
    let check = true;
    while(check!=false){
        const query = await sequelize.query(
            `select username from Users where username like '${username}'`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        if(query.length == 0){
            check=false;
        }
        else {
            username = username + randomInteger(1111,9999);
        }
    }

    return username;
}