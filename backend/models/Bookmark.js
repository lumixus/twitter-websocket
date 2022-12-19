import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";

const Bookmark = sequelize.define("Bookmark", {
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
    }
});

await sequelize.sync().then(()=>console.log("Bookmark Sync")).catch(err=>console.log(err));
export default Bookmark;