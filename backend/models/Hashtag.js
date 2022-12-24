import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";

const Hashtag = sequelize.define("Hashtag",
{
    keyword: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    TweetId: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdAt: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
});

await sequelize.sync().then(()=> console.log("Hashtag sync")).catch(err=>console.log(err));
export default Hashtag;