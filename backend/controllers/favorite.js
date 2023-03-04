import CustomError from "../helpers/error/CustomError.js";
import Favorite  from "../models/Favorite.js";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";

export const favoriteTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;

        const tweet = await Tweet.findOne({
            attributes:["id"], 
            where:{id:tweet_id}
        });
        
        const query = await Favorite.findOne({
            where: {
                UserId:req.user.id, 
                TweetId:tweet_id
            }
        });

        if(query){
            return next(new CustomError(400, "You already liked this tweet"));
        }

        const favorite = await Favorite.create({
            UserId: req.user.id, 
            TweetId:tweet_id
        });

        const favoriteCount = (await Favorite.findAll({
            where:{TweetId:tweet.id, isVisible:true}
        }
        )).length
        
        tweet.update({favoriteCount: favoriteCount})
        
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

        const mention = await Mention.findOne({
            attributes:["id", 'TweetId'], 
            where:{
                id:mention_id, 
                TweetId:tweet_id
            }
        });
        
        const query = await Favorite.findOne({where: {UserId:req.user.id, TweetId:tweet_id, MentionId: mention_id}}) 
        
        if(query){
            return next(new CustomError(400, "You already liked this mention"));
        }

        const favorite = await Favorite.create({
            UserId: req.user.id, 
            TweetId:tweet_id, 
            MentionId: mention_id
        });
        
        const favoriteCount = (await Favorite.findAll({
            where: {
                MentionId: mention.id,
                TweetId: mention.TweetId,
                isVisible:true}
            }
        )).length

        await mention.update({favoriteCount:favoriteCount});

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

        const tweet = await Tweet.findOne({
            attributes:["id"], 
            where:{id:tweet_id}
        });

        const query = await Favorite.findOne({
            where: {
                UserId:req.user.id,
                TweetId:tweet_id
            }
        });
        
        if(!query){
            return next(new CustomError(400, "You already did not like this tweet"));
        }

        await Favorite.destroy({
            where:{
                UserId: req.user.id,
                TweetId:tweet_id
            }
        });

        const favoriteCount = (await Favorite.findAll({
            where:{
                TweetId:tweet.id,
                isVisible:true
            }}
        )).length;
        
        tweet.update({favoriteCount:favoriteCount});

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

        const mention = await Mention.findOne({
            attributes:["id", 'TweetId'],
            where:{
                id:mention_id,
                TweetId:tweet_id
            }
        });
        

        const query = await Favorite.findOne({
            where: {
                UserId:req.user.id, 
                TweetId:tweet_id, 
                MentionId:mention_id
            }
        });

        if(!query){
            return next(new CustomError(400, "You already did not like this mention"));
        }

        await Favorite.destroy({
            where:{
                UserId: req.user.id,
                TweetId:tweet_id, 
                MentionId:mention_id
            }
        });
        
        const favoriteCount = (await Favorite.findAll({
            where: {
                MentionId: mention.id, 
                TweetId: mention.TweetId, 
                isVisible:true
            }
        })).length

        await mention.update({favoriteCount:favoriteCount});
        
        res.status(200).json({success:true, message: "Undo Favorite Successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}