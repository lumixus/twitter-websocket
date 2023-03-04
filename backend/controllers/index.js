import { Op, Sequelize } from "sequelize";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";

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
        
        const following = await Follow.findAll({
            attributes:["FollowingId"], 
            where: {FollowerId: req.user.id}, 
            raw:true,
        });

        for(var follow of following)
        {
            followingUsers.push(follow.FollowingId);
        }

        console.log(following);

        const query = await Tweet.findAll({
            attributes:["id", "content", "createdAt", "favoriteCount", "mentionCount"],
            where: {
                UserId:followingUsers,
                isVisible:true
            },  
            raw:true, 
            include: [{
                model:User,
                attributes:["id", "name", "username", "profilePicture", "isVerified", "isVerifiedByTwitter"]
            }]
        });

        res.status(200).json({success:true, data:query});
    }
    catch(err)
    {
        return next(err);
    }
    
}