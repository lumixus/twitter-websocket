import Retweet from "../models/Retweet.js";
import CustomError from "../helpers/error/CustomError.js";

export const reTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id,content} = req.body;
        const reTweet = await Retweet.create({TweetId:tweet_id, UserId: req.user.id, content:content});
        res.status(200).json({success:true, message: "Retweet successfull", data:reTweet});
    }
    catch(err)
    {
        return next(err);
    }
}

export const reTweetMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id, mention_id, content} = req.body;
        const reTweet = await Retweet.create({TweetId:tweet_id, UserId: req.user.id, MentionId:mention_id, content:content});
        res.status(200).json({success:true, message: "Retweet successfull", data:reTweet});
    }
    catch(err)
    {
        return next(err);
    }
}

export const undoReTweet = async (req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        if(!await Retweet.findOne({where:{TweetId:tweet_id, UserId: req.user.id}}))
        {
            return next(new CustomError(400, "You already did not retweet this tweet"));
        }
        await Retweet.destroy({where:{TweetId:tweet_id, UserId: req.user.id}});
        res.status(200).json({success:true, message: "Undo retweet successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}
export const undoReTweetMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id, mention_id} = req.body;
        if(!await Retweet.findOne({where:{TweetId: tweet_id, MentionId:mention_id, UserId:req.user.id}}))
        {
            return next(new CustomError(400, "You already did not retweet this mention"));
        }
        await Retweet.destroy({where: {TweetId: tweet_id, MentionId:mention_id, UserId:req.user.id}});
        res.status(200).json({success:true, message: "Undo retweet mention successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}