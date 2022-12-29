import { Op } from "sequelize";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import sequelize from "../helpers/database/dbConnection.js";
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
        const response = [];
        const following = await Follow.findAll({attributes:["FollowerId"], where: {FollowingId:req.user.id}});
        for(var follow of following)
        {
            followingUsers.push(follow.FollowerId);
        }
        const tweets = await Tweet.findAll({attributes:["id", "content", "image", "createdAt", "UserId"], where: {UserId: {[Op.in]:followingUsers}}, order:sequelize.literal('createdAt desc'), limit:20});
        for(var tweet of tweets)
        {
            const user = await User.findOne({attributes:["firstName", "lastName", "username"], where: {id:tweet.UserId}});
            const obj = {"tweet":tweet, "user":user};
            response.push(obj);
        }
        res.status(200).json({success:true, data:response});
    }
    catch(err)
    {
        return next(err);
    }
    
}