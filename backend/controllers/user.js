import { Op, Sequelize } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";
import CustomError from "../helpers/error/CustomError.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";
import Mention from "../models/Mention.js";
import Favorite from "../models/Favorite.js";
import Bookmark from "../models/Bookmark.js";
import Retweet from "../models/Retweet.js";
import Follow from "../models/Follow.js";


export const editProfile = async(req, res, next) =>
{
    try
    {
        const {username,location, biography, website} = req.body;
        if(await User.findOne({where:{username:username}})){
            return next(new CustomError(400, "This username is already exists. Choose another one"));
        }
        const user = await User.findOne({where: {id:req.user.id}, attributes:["id", "username" ,"location", "biography", "website"]});
        await user.update({username:username,location: location, biography:biography, website:website});
        res.status(200).json({success:true, data:user,message:"Update process successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}

//--

export const profile = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.body;
    
        const user = await User.findOne({
            where: {
                isActive:true, 
                username:user_id
            }, 
            attributes:[
                "id",
                "name",
                "username",
                "dateOfBirth",
                "createdAt",
                "profilePicture",
                "location",
                "biography",
                "website"
            ]
        });

        const tweets = await Tweet.findAll({
            where: {
                UserId: user.id, 
                isVisible:true
            },
            order:[
                ['createdAt', 'DESC']
            ],
            attributes:[
                "id", 
                "content",
                "retweetCount",
                "favoriteCount",
                "mentionCount",
                "image",
                "createdAt"
            ],
            include: [{
                model:User,
                attributes:["id", "name", "username", "profilePicture", "isVerified", "isVerifiedByTwitter"]
            }]
        });
        
        const retweets = await Retweet.findAll({
            where:{
                UserId:user_id
            },
            raw:true,
            include: [
                {
                    model:Tweet
                }
            ]
        });

        res.status(200).json({success:true,user:user, tweets:tweets,retweets:retweets});
    }
    catch(err)
    {
        return next(err);
    }
}
export const follow = async (req, res, next) =>
{
    try
    {
        const {user_id} = req.body;

        const query = await Follow.findOne({
            where: {
                FollowerId:user_id, 
                FollowingId: req.user.id
            }
        });
        
        if(query){
            return next(new CustomError(400, "You are already following this user"));
        }
        
        if(user_id == req.user.id) {
            return next(new CustomError(400, "You can not follow yourself"));
        }

        const follow = await Follow.create({
            FollowerId: user_id, 
            FollowingId:req.user.id
        });
        
        res
        .status(200)
        .json({success:true, data:follow});
    }
    catch(err)
    {
        return next(err);
    }
}

export const unfollow = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.body;

        const query = await Follow.findOne({
            where: {
                FollowerId:user_id, 
                FollowingId: req.user.id
            }
        });
        
        if(!query){
            return next(new CustomError(400, "You are already not following this user"));
        }

        if(user_id == req.user.id) {
            return next(new CustomError(400, "You can not unfollow yourself"));
        }

        await Follow.destroy({
            where:{ 
                FollowerId: user_id, 
                FollowingId:req.user.id
            }
        });
        
        res
        .status(200)
        .json({success:true, message:"Unfollow successfull"});

    }
    catch(err)
    {
        return next(err);
    }
}

export const getMentions = async(req ,res ,next) => {
    try{
        const {user_id} = req.body;

        const mentions = await Mention.findAll({
            attributes:[
                "id",
                "content",
                "image",
                "UserId",
                "TweetId",
                "favoriteCount",
                "createdAt"
            ],
            where: {
                UserId:user_id
            },
            include: {
                model:User,
                attributes: [
                    "id",
                    "name",
                    "username",
                    "profilePicture",
                ]
            }
        });

        return res.status(200).json({success:true, mentions:mentions});
    }
    catch(err){
        return next(err);
    }
}

export const uploadPhoto = async(req, res, next) =>
{
    try
    {
        if(!req.files)
        return next(new CustomError(400, "You did not provide an image to upload"));
        const fileName = imageUploader(req, next);
        const user = await User.findOne({where: {id:req.user.id},attributes:["id", "profilePicture"]});
        await user.update({profilePicture:fileName});
        res.status(200).json({success:true, message:"Profile Photo Uploaded"});
    }
    catch(err)
    { 
        return next(err);
    }
}

export const removePicture = async (req, res, next) =>
{
    try
    {
        const user = await User.findOne({where:{id:req.user.id}, attributes:["id", "profilePicture"]});
        await user.update({profilePicture:"default.png"});
        res.status(200).json({success:true, message:"Your profile picture has been deleted"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const bookmarks = async(req, res, next)=>
{
    try
    {
        const tweetIds = [];
        const mentionIds= [];
        const bookmarks = await Bookmark.findAll({where:{UserId: req.user.id}, attributes:["id", "MentionId", "TweetId"]});
        for(var bookmark of bookmarks)
        {
            tweetIds.push(bookmark.TweetId);
            mentionIds.push(bookmark.MentionId);
        }
        const tweets = await Tweet.findAll({where: {id: {[Op.in]: tweetIds}}, attributes:["id","content", "image", "createdAt"]});
        const mentions = await Mention.findAll({where: {id:{[Op.in]:mentionIds}}, attributes:["id", "content", "image","createdAt"]});
        res.status(200).json({success:true, data:{tweets:tweets, mentions:mentions}});
    }
    catch(err)
    {
        return next(err);
    }
}

//--
export const favorites = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.body;

        const favorites = await Favorite.findAll({
            where: {
                UserId:user_id
            },
            raw:true,
            include: {
                model:Tweet,
            }
        });

        res.status(200).json({success:true, data:favorites});

    }   
    catch(err)
    {
        return next(err);
    }
}