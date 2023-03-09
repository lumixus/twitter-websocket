import CustomError from "../helpers/error/CustomError.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";

export const getMentionsByTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;

        const mentions = await Mention.findAll({
            where:{
                TweetId:tweet_id, 
                isVisible:true
            }, 
            attributes: ["id","TweetId", "UserId" ,"content", "image"]
        });
        
        res.status(200).json({success:true, mentions: mentions});
    }
    catch(err)
    {
        return next(err);
    }
}

export const createMention = async(req, res, next) =>
{
    try 
    {
        const {tweet_id, content} = req.body;

        const tweet = await Tweet.findOne({
            attributes:['id', "mentionCount"], 
            where: {
                id:tweet_id
            }
        })
        
        const fileName = imageUploader(req, next);

        if(content == null && fileName == null){
            return next(new CustomError(400, "Content or File must be provided"));
        }
        
        const mention = await Mention.create({
            content:content, 
            image:fileName, 
            TweetId: tweet_id, 
            UserId:req.user.id
        });
        
        await tweet.update({
            mentionCount: (await Mention.findAll({
                attributes:['id'], 
                where:{
                    TweetId:tweet.id, 
                    isVisible:true
                }}
            )).length});
        
        res.status(200).json({success:true, data:mention});
    }
    catch(err)
    {
        return next(err);
    }
}

export const deleteMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id,mention_id} = req.body;

        const mention = await Mention.findOne({
            where:{
                id:mention_id
            }, 
            attributes:["id", "isVisible", "hidByUser"]
        });
        const tweet = await Tweet.findOne({
            attributes:['id','mentionCount'],
            where: {
                id:tweet_id
            }
        });
        
        await mention.update({isVisible:false, hidByUser:true});

        await tweet.update({
            mentionCount: (await Mention.findAll({
                attributes:['id'], 
                where:{
                    TweetId:tweet.id, 
                    isVisible:true
                }}
            )).length});
        
        res.status(200).json({success:true, message: "Your mention has been deleted"});
    }
    catch(err)
    {
        return next(err)
    }
}