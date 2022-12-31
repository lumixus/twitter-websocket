import { Op } from "sequelize";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import sequelize from "../helpers/database/dbConnection.js";
import Favorite from "../models/Favorite.js";
// import { exampleName } from "../helpers/database/modelHelpers.js";
export const search = async(req, res, next) =>
{
    const {search} = req.query;
    const users = await User.findAll({where:{username: {[Op.substring]: search}}});
    const tweets = await Tweet.findAll({where: {content:{[Op.substring]:search}}});
    const mentions = await Mention.findAll({where: {content: {[Op.substring]:search}}});
    res.status(200).json({success:true, users:users, tweets: tweets, mentions: mentions});
}

export const index = async (req, res, next) =>
{
    try
    {
        //too slow query
        const followingUsers = [];
        // const response = [];
        const following = await Follow.findAll({attributes:["FollowerId"], where: {FollowingId:req.user.id}});
        for(var follow of following)
        {
            followingUsers.push(follow.FollowerId);
        }
        // const tweets = await Tweet.findAll({attributes:["id", "content", "image", "createdAt", "UserId"], where: {UserId: {[Op.in]:followingUsers}}, order:sequelize.literal('createdAt desc'), limit:20});
        // for(var tweet of tweets)
        // {
        //     const user = await User.findOne({attributes:["firstName", "lastName", "username"], where: {id:tweet.UserId}});
        //     const favoriteCount = (await Favorite.findAll({where: {TweetId:tweet.id, isVisible:true}})).length
        //     const obj = {"tweet":tweet, "user":user, "favoriteCount":favoriteCount};
        //     response.push(obj);
        // }
        const response = await sequelize.query(`select * from Tweets left join Users on Tweets.UserId = Users.id left join Favorites on Tweets.Id = Favorites.TweetId where Tweets.UserID in (${followingUsers})`)
        res.status(200).json({success:true, data:response});
        // Tweets.id, Tweets.content, Tweets.image, Tweets.createdAt, Users.firstName, Users.lastName, Users.username, Users.profilePicture
    }
    catch(err)
    {
        return next(err);
    }
    
}