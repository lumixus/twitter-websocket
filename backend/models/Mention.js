import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";
import Tweet from "./Tweet.js";
import User from "./User.js";

const Mention = sequelize.define("Mention", {
    content: {
        type: DataTypes.STRING,
        allowNull:true,
        validate: {
            len: {
                args:[1, 280],
                msg:["Tweet have to between 1-280 characters"]
            }
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull:true
    },
    UserId:
    {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    TweetId:
    {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    favoriteCount: {
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    createdAt : {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    },
    isVisible: {
        type:DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull:false
    },
    hidByUser: {
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
});


await sequelize.sync().then(()=> console.log("Mention Sync")).catch(err => console.log(err));
export default Mention;