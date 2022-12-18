import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";
// import User from "./User.js";

const Tweet = sequelize.define("Tweet", {
    content: {
        type: DataTypes.STRING,
        allowNull:true,
        validate:{
            len:{
                args:[1, 280],
                msg:["Tweet have to between 1-280 characters"]
            },
        },
    },
    image: {
        type: DataTypes.STRING,
        allowNull:true
    },
    createdAt : {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    },
    UserId: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    isVisible: {
        type:DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull:false
    },
    hidByUser: {
        type:DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
    }
});




await sequelize.sync().then(()=> console.log("Tweet sync done")).catch(err=>console.log(err));


export default Tweet;