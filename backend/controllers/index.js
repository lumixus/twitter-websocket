import { Op, Sequelize } from "sequelize";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import sequelize from "../helpers/database/dbConnection.js";
import Favorite from "../models/Favorite.js";

export const search = async(req, res, next) =>
{
    const {search} = req.query;
    const users = await User.findAll({where:{username: {[Op.substring]: search}}});
    const tweets = await Tweet.findAll({where: {content:{[Op.substring]:search}}});
    const mentions = await Mention.findAll({where: {content: {[Op.substring]:search}}});
    res.status(200).json({success:true, users:users, tweets: tweets, mentions: mentions});
}

export const feed = async (req, res, next) =>
{
    try
    {
        const followingUsers = [];
        const following = await Follow.findAll({attributes:["FollowerId"], where: {followingId: req.user.id}, raw:true});
        for(var follow of following)
        {
            followingUsers.push(follow.FollowerId);
        }
        const response = await sequelize.query(`select 
        Tweets.id, Tweets.content, Tweets.image, Tweets.favoriteCount, Tweets.mentionCount, Tweets.createdAt,
        Users.username, Users.name, Users.profilePicture
        from Tweets 
        left join Users on Tweets.UserId = Users.id 
        where Tweets.UserId in (${followingUsers.toString()})`, { type: Sequelize.QueryTypes.SELECT });
        res.status(200).json({success:true, data:response});
    }
    catch(err)
    {
        return next(err);
    }
    
}