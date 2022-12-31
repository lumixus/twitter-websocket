import { DataTypes } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";
import Mention from "./Mention.js";
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
    favoriteCount: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    mentionCount: {
        type: DataTypes.INTEGER,
        defaultValue:0
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


Tweet.addHook("beforeUpdate", async function(tweet)
{
    if(tweet.changed("isVisible"))
    {
        const mentions = await Mention.findAll({where:{TweetId:tweet.id}});
        mentions.forEach(mention =>
            {
                mention.update({isVisible:tweet.isVisible});
            });
    }
});

await sequelize.sync().then(()=> console.log("Tweet sync done")).catch(err=>console.log(err));


export default Tweet;