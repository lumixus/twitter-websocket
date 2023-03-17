import CustomError from "../../helpers/error/CustomError.js";
import { getToken, isTokenProvided } from "../../helpers/jwt/tokenHelpers.js";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/User.js";
import Tweet from "../../models/Tweet.js";

export const isAuth = (req, res, next) =>
{
    const {JWT_SECRET_KEY} = process.env;
    const token = getToken(req);
    console.log("token is :" + token);
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
                profilePicture: decoded.profilePicture,
                name: decoded.name,
                email: decoded.email
            };
            const user = await User.findOne({
                where:{username:req.user.username},
                attributes:["id"]});
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
    const user = await User.findOne({
        where:{
            id:req.user.id
        }, 
        attributes:["role"]
    });
    
    if(user.role != "admin") {
        return next(new CustomError(403, "Only admins can access to this route"));
    }
    
    next();
} 

export const getTweetOwnerAccess = async(req, res, next) =>
{
    const {tweet_id} = req.body;

    const tweet = await Tweet.findOne({
        where: {
            id:tweet_id
        }, 
        attributes:["UserId"]
    });
    
    if(!tweet){
        return next(new CustomError(400, "There is no tweet with that id"));
    }

    if(tweet.UserId != req.user.id){
        return next(new CustomError(403, "You are not owner of this tweet"));
    }
    
    next();
}
