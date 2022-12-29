import CustomError from "../../helpers/error/CustomError.js";
import Mention from "../../models/Mention.js";
import Tweet from "../../models/Tweet.js";
import User from "../../models/User.js";

export const isUserExist = async (req, res, next) => {
  const value  = req.body.username || req.body.user_id;
  try 
  {
    const user = await User.findOne({where: {username:value},attributes:["id"]}) || await User.findOne({where: {id:value},attributes:["id"]});
    if (!user) {
      return next(new CustomError(500, "There is no user like this"));
    }
  } 
  catch (err) 
  {
    return next(err);
  }
  return next();
};

export const isTweetExist = async(req, res, next) =>
{
    const {tweet_id} = req.body;
    if(!tweet_id)
    {
        return next(new CustomError(400, "Mention must be belong to a tweet"));
    }
    const tweet = await Tweet.findOne({where:{id:tweet_id}, attributes:["id"]});
    if(!tweet)
    {
        return next(new CustomError(400, "There is no tweet with that id"));
    }
    next();
}

export const isMentionExist = async(req, res, next) =>
{
    const {tweet_id, mention_id} = req.body;
    const mention = await Mention.findOne({where:{TweetId:tweet_id, id: mention_id}});
    if(!mention)
    {
        return next(new CustomError(400, "There is no mention with that id"));
    }
    next();
}