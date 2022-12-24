import { Op, Sequelize } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";
import Hashtag from "../models/Hashtag.js";

export const createHashtag = async(tweet, next) =>
{
    try
    {
        const letters = tweet.content.split(" ");
        for(var letter of letters)
        {
            if(letter.charAt(0) == '#')
            {
                await Hashtag.create({keyword: letter, TweetId: tweet.id});
            }
        }
    }
    catch(err)
    {
        return next(err);
    }

}

export const trends = async(req, res, next) =>
{
    try
    {
        const hashtags = await sequelize.query(`select keyword, count(*) from Hashtags where createdAt between SUBDATE(NOW(),1) and NOW() group by keyword order by count(*) desc;`,{ type: Sequelize.QueryTypes.SELECT });
        res.status(200).json({success:true, hashtags:hashtags});
    }
    catch(err)
    {
        return next(err);
    }
}