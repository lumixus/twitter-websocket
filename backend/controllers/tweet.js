import {Tweet, Mention, User} from "../models/index.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import CustomError from "../helpers/error/CustomError.js";
import { createHashtag } from "./hashtag.js";
export const createTweet = async(req, res, next) =>
{
    try
    {
        //tweet dönüyor
        const {content} = req.body;
        const fileName = imageUploader(req, next);
        if(content == null && fileName == null)
        return next(new CustomError(400, "Content or File must be provided"));
        const tweet = await Tweet.create({content:content,UserId:req.user.id, image:fileName});
        createHashtag(tweet, next);
        res.status(200).json({success:true, data:tweet});
    }
    catch(err)
    {
        return next(err);
    }
}

export const getTweetById = async(req, res, next) =>
{
    //tweet dönüyor
    try
    {
        const {tweet_id} = req.body;
        const tweet = await Tweet.findByPk(tweet_id);
        res.status(200).json({success:true, data:tweet});
    }
    catch(err)
    {
        return next(err);
    }
}

export const deleteTweet = async(req, res, next) =>
{
    try
    {
        const {tweet_id} = req.body;
        const tweet = await Tweet.findByPk(tweet_id);
        await tweet.update({isVisible: false, hidByUser:true});
        res.status(200).json({success:true, message:"Your tweet has been deleted"});
    }
    catch(err)
    {
        return next(err);
    }
}
