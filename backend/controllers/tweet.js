import {Tweet, User} from "../models/index.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import CustomError from "../helpers/error/CustomError.js";
import { createHashtag } from "./hashtag.js";
export const createTweet = async(req, res, next) =>
{
    try
    {
        const {content, parentId} = req.body;
        
        const fileName = imageUploader(req, next);
        
        if(content == null && fileName == null) {
            return next(new CustomError(400, "Content or File must be provided"));
        }

        const tweet = await Tweet.create({
            content:content,
            parentId: parentId ?? 0,
            UserId:req.user.id,
            image:fileName
        });

        const response = await Tweet.findOne({
            where: {id:tweet.id}, 
            attributes:[
                "id",
                "content", 
                "image", 
                "UserId", 
                "createdAt"
            ],
            include: [{
                model:User,
                attributes:["id", "name", "username", "profilePicture", "isVerified", "isVerifiedByTwitter"]
            }]
        });

        
        createHashtag(tweet, next);
        
        res.status(200).json({success:true, data:response});
    }
    catch(err)
    {
        return next(err);
    }
}

export const getTweetById = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        
        const tweet = await Tweet.findOne({
            where: {id:tweet_id}, 
            attributes:[
                "id",
                "content", 
                "image", 
                "UserId", 
                "createdAt"
            ],
            include: [{
                model:User,
                attributes:["id", "name", "username", "profilePicture", "isVerified", "isVerifiedByTwitter"]
            }]
        });
        
        res.status(200).json({success:true, data:tweet});
    }
    catch(err)
    {
        return next(err);
    }
}

export const deleteTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;

        const tweet = await Tweet.findOne({
            where: {id:tweet_id}, 
            attributes:[
                "id", 
                "isVisible", 
                "hidByUser"
            ]
        });

        await tweet.update({isVisible: false, hidByUser:true});

        res.status(200).json({success:true, message:"Your tweet has been deleted"});
    }
    catch(err)
    {
        return next(err);
    }
}
