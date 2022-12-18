import Tweet from "./Tweet.js";
import User from "./User.js"
import Mention from "./Mention.js"
import Favorite from "./Favorite.js";



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

Favorite.belongsToMany(Tweet, {
    foreignKey:{
        allowNull:false,
    },
    through: "FavoriteUser"
});

Favorite.belongsToMany(User, {
    foreignKey:{
        allowNull:false,
    },
    through: "FavoriteTweet"
});

Favorite.belongsToMany(Mention, {
    foreignKey:{
        allowNull:false,
    },
    through: "FavoriteMention"
});


export {Mention, Tweet, User, Favorite}



