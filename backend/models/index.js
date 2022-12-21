import Tweet from "./Tweet.js";
import User from "./User.js"
import Mention from "./Mention.js"
import Favorite from "./Favorite.js";
import Retweet from "./Retweet.js";
import Bookmark from "./Bookmark.js";

Tweet.belongsTo(User, {
    foreignKey: {
        allowNull:false,
    },
    onDelete:"CASCADE"
});

Mention.belongsTo(Tweet, {
    foreignKey: {
        allowNull:false
    },
    onDelete:"CASCADE"
});

Mention.belongsTo(User, {
    foreignKey: {
        allowNull:false
    },
    onDelete:"CASCADE"
});

Favorite.belongsToMany(Tweet, {
    foreignKey:{
        allowNull:false,
    },
    through: "FavoriteUser",
    onDelete:"CASCADE",
});

Favorite.belongsToMany(User, {
    foreignKey:{
        allowNull:false,
    },
    through: "FavoriteTweet",
    onDelete:"CASCADE"
});

Favorite.belongsToMany(Mention, {
    foreignKey:{
        allowNull:false,
    },
    through: "FavoriteMention",
    onDelete:"CASCADE"

});

Retweet.belongsToMany(User, {
        foreignKey:{
            allowNull:false,
        },
        through: "RetweetUser",
        onDelete:"CASCADE"

});

Retweet.belongsToMany(Mention, {
    foreignKey:{
        allowNull:false,
    },
    through: "RetweetMention",
    onDelete:"CASCADE"

});

Retweet.belongsToMany(Tweet, {
    foreignKey:{
        allowNull:false,
    },
    through:"RetweetTweet",
    onDelete:"CASCADE"
});

Bookmark.belongsTo(User, {
        foreignKey:{
            allowNull:false
        },
        through:"BookmarkUser",
    onDelete:"CASCADE"
});

Bookmark.belongsTo(Tweet, {
    foreignKey:{
        allowNull:false
    },
    through:"BookmarkTweet",
    onDelete:"CASCADE"
});

Bookmark.belongsTo(Mention, {
    foreignKey:{
        allowNull:false
    },
    through:"BookmarkMention",
    onDelete:"CASCADE"
});

export {Mention, Tweet, User, Favorite, Retweet, Bookmark}