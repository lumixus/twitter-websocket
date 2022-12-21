import CustomError from "../helpers/error/CustomError.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import Mention from "../models/Mention.js";

export const getMentionsByTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        const mentions = await Mention.findAll({where:{TweetId:tweet_id, isVisible:true}});
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
        const fileName = imageUploader(req, next);
        if(content == null && fileName == null)
        return next(new CustomError(400, "Content or File must be provided"));
        const mention = await Mention.create({content:content, image:fileName, TweetId: tweet_id, UserId:req.user.id});
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
        const {mention_id} = req.body;
        const mention = await Mention.findByPk(mention_id);
        await mention.update({isVisible:false, hidByUser:true});
        res.status(200).json({success:true, message: "Your mention has been deleted"});
    }
    catch(err)
    {
        return next(err)
    }
}