import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";

const Favorite = sequelize.define("Favorite", {
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TweetId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MentionId: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

export default Favorite

