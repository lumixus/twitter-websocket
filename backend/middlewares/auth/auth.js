import CustomError from "../../helpers/error/CustomError.js";
import { getToken, isTokenProvided } from "../../helpers/jwt/tokenHelpers.js";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/User.js";
import Tweet from "../../models/Tweet.js";
import Mention from "../../models/Mention.js";

export const isAuth = (req, res, next) =>
{
    if(!isTokenProvided(req))
    {
        return next(new CustomError(500, "You have to provide a token to access this route"));
    }
    const {JWT_SECRET_KEY} = process.env;
    const token = getToken(req);
    jsonwebtoken.verify(token, JWT_SECRET_KEY, async(err, decoded)=>
    {
        if(err)
        {
            return next(err);
        }
        else
        {
            req.user = {
                id: decoded.id,
                username: decoded.username,
            };
            const user = await User.findOne({where:{username:req.user.username}});
            if(!user)
            {
                return next(new CustomError(401, "There is no username in the database"));
            }
            return next();
        }
    });
}

export const adminAccess = async (req, res, next) =>
{
    const user = await User.findOne({where:{id:req.user.id}});
    if(user.role != "admin")
    {
        return next(new CustomError(403, "Only admins can access to this route"));
    }
    next();
} 

export const profileOwnerAccess = async(req, res, next) =>
{
    const {user_id} = req.body;
    const user = await User.findOne({where:{id:user_id, isActive:true}});
    if(user.id != req.user.id)
    {
        return next(new CustomError(403, "You are not authorized to access this route"));
    }
    next();
}

export const isTweetExist = async(req, res, next) =>
{
    const {tweet_id} = req.body;
    if(!tweet_id)
    {
        return next(new CustomError(400, "Mention must be belong to a tweet"));
    }
    const tweet = await Tweet.findByPk(tweet_id);
    if(!tweet)
    {
        return next(new CustomError(400, "There is no tweet with that id"));
    }
    next();
}

export const getTweetOwnerAccess = async(req, res, next) =>
{
    const {tweet_id} = req.body;
    const tweet = await Tweet.findByPk(tweet_id); //will be refactored || same code with line 53
    if(!tweet)
    {
        return next(new CustomError(400, "There is no tweet with that id"));
    }
    if(tweet.UserId != req.user.id)
    {
        return next(new CustomError(403, "You are not owner of this tweet"));
    }
    next();
}

export const isMentionExist = async(req, res, next) =>
{
    const {tweet_id, mention_id} = req.body;
    const mention = await Mention.findOne({where:{TweetId:tweet_id, id: mention_id}});
    if(!mention)
    {
        return next(new CustomError(400, "There is no mention with that id"));
    }
    next();
}