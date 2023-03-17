import CustomError from "../helpers/error/CustomError.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import Mention from "../models/Mention.js";
import Tweet from "../models/Tweet.js";

export const getMentionsByTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;

        const mentions = await Tweet.findAll({
            where:{
                parentId: tweet_id, 
                isVisible: true
            }, 
            attributes: ["id", "UserId" ,"content", "image"]
        });
        
        res.status(200).json({success:true, mentions: mentions});
    }
    catch(err)
    {
        return next(err);
    }
}
