import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";

const Retweet = sequelize.define("Retweet", {
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TweetId: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    MentionId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    content: {
        type:DataTypes.STRING,
        allowNull:true
    }
});

await sequelize.sync().then(()=> console.log("Retweet sync done")).catch(err=>console.log(err));
export default Retweet