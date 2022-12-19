import Tweet from "./Tweet.js";
import User from "./User.js"
import Mention from "./Mention.js"
import Favorite from "./Favorite.js";
import Retweet from "./Retweet.js";
import Bookmark from "./Bookmark.js";

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

Retweet.belongsToMany(User, {
        foreignKey:{
            allowNull:false,
        },
        through: "RetweetUser"
});

Retweet.belongsToMany(Mention, {
    foreignKey:{
        allowNull:false,
    },
    through: "RetweetMention"
});

Retweet.belongsToMany(Tweet, {
    foreignKey:{
        allowNull:false,
    },
    through:"RetweetTweet"
});

Bookmark.belongsTo(User, {
        foreignKey:{
            allowNull:false
        },
        through:"BookmarkUser"
});

Bookmark.belongsTo(Tweet, {
    foreignKey:{
        allowNull:false
    },
    through:"BookmarkTweet"
});

Bookmark.belongsTo(Mention, {
    foreignKey:{
        allowNull:false
    },
    through:"BookmarkMention"
});

export {Mention, Tweet, User, Favorite, Retweet, Bookmark}