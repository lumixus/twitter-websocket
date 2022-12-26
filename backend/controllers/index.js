import { Op } from "sequelize";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import sequelize from "../helpers/database/dbConnection.js";
export const search = async(req, res, next) =>
{
    //tweet dönüyor
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
        const data = [];
        const response = [];
        const following = await Follow.findAll({attributes:["FollowerId"], where: {FollowingId:req.user.id}});
        for(var follow of following)
        {
            data.push(follow.FollowerId);
        }
        const tweets = await Tweet.findAll({where: {UserId: {[Op.in]:data}}, order:sequelize.literal('createdAt desc')});
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