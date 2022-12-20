import {Tweet, Mention} from "../models/index.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import CustomError from "../helpers/error/CustomError.js";
export const createTweet = async(req, res, next) =>
{
    try
    {
        const {content} = req.body;
        const fileName = imageUploader(req, next);
        if(content == null && fileName == null)
        return next(new CustomError(400, "Content or File must be provided"));
        const tweet = await Tweet.create({content:content,UserId:req.user.id, image:fileName});
        res.status(200).json({success:true, data:tweet});
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
        const tweet = await Tweet.findByPk(tweet_id);
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
        const tweet = await Tweet.findByPk(tweet_id);
        await tweet.update({isVisible: false, hidByUser:true});
        //When a tweet deleted, the mentions belong to tweet will be deleted too.
        const mentions = await Mention.findAll({where:{TweetId:tweet_id}});
        mentions.forEach(mention =>
            {
                mention.update({isVisible:false});
            });
        res.status(200).json({success:true, message:"Your tweet has been deleted"});
    }
    catch(err)
    {
        return next(err);
    }
}



