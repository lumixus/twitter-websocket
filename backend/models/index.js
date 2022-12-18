import Tweet from "./Tweet.js";
import User from "./User.js"
import Mention from "./Mention.js"



Tweet.belongsTo(User, {
    foreignKey: {
        allowNull:false
    }
});



Mention.belongsTo(Tweet, {
    foreignKey: {
        allowNull:false
    }
});

Mention.belongsTo(User, {
    foreignKey: {
        allowNull:false
    }
});



export {Mention, Tweet, User}



