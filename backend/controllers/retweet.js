import Retweet from "../models/Retweet.js";
import CustomError from "../helpers/error/CustomError.js";
import Tweet from "../models/Tweet.js";

export const reTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id, content} = req.body;

        let {mention_id} = req.body;
        
        if(mention_id === undefined){
            mention_id = null;
        }

        const reTweetCheck = await Retweet.count({
            where: {
                TweetId:tweet_id, 
                MentionId:mention_id, 
                UserId: req.user.id
            }
        });

        if(reTweetCheck){
            return next(new CustomError(400, "You already retweeted this"));
        }

        const reTweet = await Retweet.create({
            TweetId:tweet_id, 
            MentionId:mention_id, 
            UserId:req.user.id, 
            content:content
        });

        const tweet = await Tweet.findOne({
            where:{
                id:tweet_id
            },
            attributes:["id", "retweetCount"]
        });
        
        tweet.retweetCount += 1;
        await tweet.save();

        res.status(200).json({success:true, data:reTweet});
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

        let {mention_id} = req.body;
        
        if(mention_id===undefined){
            mention_id=null
        }

        const query = await Retweet.count({where: {UserId:req.user.id, TweetId:tweet_id, MentionId: mention_id}})

        if(!query){
            return next(new CustomError(400, "You already did not retweet this"));
        } 

        await Retweet.destroy({where: {
            UserId:req.user.id,
            TweetId:tweet_id,
            MentionId: mention_id
        }});

        const tweet = await Tweet.findOne({
            where:{
                id:tweet_id
            },
            attributes:["id", "retweetCount"]
        });
        
        tweet.retweetCount -= 1;
        await tweet.save();
        
        res.status(200).json({success:true, message:"Undo retweet successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}
