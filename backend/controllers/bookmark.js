import CustomError from "../helpers/error/CustomError.js";
import Bookmark from "../models/Bookmark.js";

export const addBookmark = async (req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;

        let {mention_id} = req.body;
        
        if(mention_id === undefined){
            mention_id=null;
        }

        const query = await Bookmark.count({
            where: {
                UserId:req.user.id, 
                TweetId: tweet_id, 
                MentionId:mention_id
            }
        });

        if(query)
        {
            return next(new CustomError(400, "This is already bookmarked"));
        }

        const bookmark = await Bookmark.create({
            UserId:req.user.id, 
            TweetId:tweet_id, 
            MentionId:mention_id
        });

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
     
        let {mention_id} = req.body;
     
        if(mention_id === undefined){
            mention_id=null;
        }

        const query = await Bookmark.count({where: {UserId: req.user.id, TweetId:tweet_id, MentionId:mention_id}})

        if(!query)
        {
            return next(new CustomError(400, "You already did not bookmarked it"));
        }

        await Bookmark.destroy({
            where: {
                UserId: req.user.id, 
                TweetId:tweet_id, 
                MentionId:mention_id
            }
        });

        res.status(200).json({success:true, data:"Undo Bookmark Successfull"});
    
    }
    catch(err)
    {
        return next(err);
    }
}
