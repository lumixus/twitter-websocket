import CustomError from "../helpers/error/CustomError.js";
import Favorite  from "../models/Favorite.js";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";

export const favoriteTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        const tweet = await Tweet.findOne({attributes:["id"], where:{id:tweet_id}});
        if(await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id}}))
        {
            return next(new CustomError(400, "You already liked this tweet"));
        }
        const favorite = await Favorite.create({UserId: req.user.id, TweetId:tweet_id});
        tweet.update({favoriteCount: (await Favorite.findAll({where:{TweetId:tweet.id}})).length})
        res.status(200).json({success:true, data:favorite});
    }
    catch(err)
    {
        return next(err);
    }
}

export const favoriteMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id, mention_id} = req.body;
        const mention = await Mention.findOne({attributes:["id", 'TweetId'], where:{id:mention_id, TweetId:tweet_id}});
        if(await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id, MentionId: mention_id}}))
        {
            return next(new CustomError(400, "You already liked this mention"));
        }
        const favorite = await Favorite.create({UserId: req.user.id, TweetId:tweet_id, MentionId: mention_id});
        // await mention.update({favoriteCount:  (await Favorite.findAll({where: {TweetId: mention.TweetId, MentionId: mention.id}}).length)});
        // console.log(await Favorite.findAll({where: {TweetId: mention.TweetId, MentionId: mention.id}}).length);
        await mention.update({favoriteCount:(await Favorite.findAll({where: {MentionId: mention.id, TweetId: mention.TweetId}})).length});
        res.status(200).json({success:true, data:favorite});
    }
    catch(err)
    {
        return next(err);
    }
}

export const undoFavoriteTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        const tweet = await Tweet.findOne({attributes:["id"], where:{id:tweet_id}});
        if(!await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id}}))
        {
            return next(new CustomError(400, "You already did not like this tweet"));
        }
        await Favorite.destroy({where:{UserId: req.user.id, TweetId:tweet_id}});
        tweet.update({favoriteCount: (await Favorite.findAll({where:{TweetId:tweet.id}})).length})
        res.status(200).json({success:true, message: "Undo Favorite Successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const undoFavoriteMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id, mention_id} = req.body;
        const mention = await Mention.findOne({attributes:["id", 'TweetId'], where:{id:mention_id, TweetId:tweet_id}});
        if(!await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id, MentionId:mention_id}}))
        {
            return next(new CustomError(400, "You already did not like this mention"));
        }
        await Favorite.destroy({where:{UserId: req.user.id, TweetId:tweet_id, MentionId:mention_id}});
        await mention.update({favoriteCount:(await Favorite.findAll({where: {MentionId: mention.id, TweetId: mention.TweetId}})).length});
        res.status(200).json({success:true, message: "Undo Favorite Successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}