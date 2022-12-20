import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";

const Follow = sequelize.define("Follow", {
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    FollowerId: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    FollowingId: {
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

export default Follow;
await sequelize.sync().then(()=>console.log("Follow model sync")).catch(err=>console.log(err));