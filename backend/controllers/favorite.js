import CustomError from "../helpers/error/CustomError.js";
import Favorite  from "../models/Favorite.js";

export const favoriteTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        // const isFavoriteExists = await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id}});
        if(await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id}}))
        {
            return next(new CustomError(400, "You already liked this tweet"));
        }
        const favorite = await Favorite.create({UserId: req.user.id, TweetId:tweet_id});
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
        if(await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id, MentionId: mention_id}}))
        {
            return next(new CustomError(400, "You already liked this mention"));
        }
        const favorite = await Favorite.create({UserId: req.user.id, TweetId:tweet_id, MentionId: mention_id});
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
        if(!await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id}}))
        {
            return next(new CustomError(400, "You already did not like this tweet"));
        }
        await Favorite.destroy({where:{UserId: req.user.id, TweetId:tweet_id}});
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
        if(!await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id, MentionId:mention_id}}))
        {
            return next(new CustomError(400, "You already did not like this mention"));
        }
        await Favorite.destroy({where:{UserId: req.user.id, TweetId:tweet_id, MentionId:mention_id}});
        res.status(200).json({success:true, message: "Undo Favorite Successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}