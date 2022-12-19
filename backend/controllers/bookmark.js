import CustomError from "../helpers/error/CustomError.js";
import Bookmark from "../models/Bookmark.js";

export const addBookmark = async (req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        if(await Bookmark.findOne({where:{TweetId:tweet_id, UserId:req.user.id}}))
        {
            return next(new CustomError(400, "You already marked this tweet"));
        }
        const bookmark = await Bookmark.create({UserId: req.user.id, TweetId: tweet_id});
        res.status(200).json({success:true, data:bookmark});
    }
    catch(err)
    {
        return next(err);
    }
    
}
export const addBookmarkMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id, mention_id} = req.body;
        if(await Bookmark.findOne({where:{TweetId:tweet_id, UserId:req.user.id, MentionId:mention_id}}))
        {
            return next(new CustomError(400, "You already marked this mention"));
        }
        const bookmark = await Bookmark.create({UserId: req.user.id, TweetId: tweet_id, MentionId: mention_id});
        res.status(200).json({success:true, data:bookmark});
    }
    catch(err)
    {
        return next(err);
    }
}

export const undoBookmark = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        if(!await Bookmark.findOne({where:{TweetId:tweet_id, UserId:req.user.id}}))
        {
            return next(new CustomError(400, "You already did not mark this tweet"));
        }
        await Bookmark.destroy({where:{TweetId:tweet_id, UserId:req.user.id}});
        res.status(200).json({success:true, message: "Undo bookmark successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const undoBookmarkMention = async(req, res, next) =>
{
    try
    {
        const {tweet_id, mention_id} = req.body;
        if(!await Bookmark.findOne({where:{TweetId:tweet_id, UserId:req.user.id, MentionId:mention_id}}))
        {
            return next(new CustomError(400, "You already did not mark this mention"));
        }
        await Bookmark.destroy({where:{TweetId:tweet_id, UserId:req.user.id, MentionId:mention_id}});
        res.status(200).json({success:true, message: "Undo mention bookmark successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}