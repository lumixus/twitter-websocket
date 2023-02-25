import User from "../models/User.js";
import {createJwt, sendJwtToCookie} from "../helpers/jwt/tokenHelpers.js";
import CustomError from "../helpers/error/CustomError.js";
import { comparePasswords, validateInputs } from "../helpers/input/inputHelpers.js";
import { createVerificationCode, createResetPasswordToken } from "../helpers/database/modelHelpers.js";
import { createMailOptions, mailHelper } from "../helpers/mailHelper/mailHelper.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import Follow from "../models/Follow.js";
import Bookmark from "../models/Bookmark.js";
import Favorite from "../models/Favorite.js";
import Tweet from "../models/Tweet.js";
import Mention from "../models/Mention.js";
import { Op, Sequelize } from "sequelize";
import sequelize from "../helpers/database/dbConnection.js";
import { sendSms } from "../helpers/smsHelper/smsHelper.js";
import jsonwebtoken from "jsonwebtoken";

export const firstOnBoarding = async(req, res, next) =>
{
    try
    {
        let {name, dateOfBirth, phone, email} = req.body;
        if(!validateInputs(name, dateOfBirth, phone || email)) {
            return next(new CustomError(400, "Sure to filled all fields"))
        }

        const user = await User.findOne({where: {phone:phone||null}}) || await User.findOne({where:{email:email||null}});

        if(user && user.isRegisterCompleted == false) {
            const verificationCode = await createVerificationCode();
            mailHelper(createMailOptions(email, 'Email Confirmation', `Your email confirmation code is ${verificationCode}`));
            await user.update({verificationCode:verificationCode, verificationCodeExpires: new Date(Date.now() + 1 * 5 * 60 * 1000)});
        }
        else{
            const verificationCode = await createVerificationCode();
            await User.create({name: name, dateOfBirth:dateOfBirth, phone:phone, email: email, verificationCode:verificationCode, verificationCodeExpires: new Date(Date.now() + 1 * 5 * 60 * 1000)});

            if(!phone)
            {
                phone = null;
                if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
                    return next(new CustomError(400, "Email invalid"));
                mailHelper(createMailOptions(email, 'Email Confirmation', `Your email confirmation code is ${verificationCode}`));
            }
            else
            {
                email=null;
                if(!/^([+]\d{2})?\d{10}$/.test(phone))
                    return next(new CustomError(400, "Phone is invalid"));
                sendSms(phone, `Your phone verification code is ${verificationCode}`)
            }
        }
        res.status(200).json({success:true});
    }
    catch(err)
    {
        return next(err)
    }
}

export const verify = async(req, res, next) =>
{
    try
    {
        const {verificationCode, email, phone} = req.body;
        const user = await User.findOne({where: {phone:phone||null}}) || await User.findOne({where:{email:email||null}});
        if(!user) {
            return next(new CustomError(400, "There is no user with provided email or phone"))
        }
        if(user.verificationCode != verificationCode || user.verificationCodeExpires < Date.now()) {
            return next(new CustomError(400, "Your verification code wrong or expired"));
        };
        await user.update({isVerified:true, verificationCode:null, verificationCodeExpires:null});
        const verifyToken = createJwt(user);
        res.status(200).json({success:true, verifyToken:verifyToken});
    }
    catch(err)
    {
        return next(err);
    }
}

export const finalOnBoarding = async(req, res, next) =>
{
    try
    {
        const {username, password, verifyToken} = req.body;
        if(!validateInputs(username, password)){
            return next(new CustomError(400, "Fill the all fields"));
        }
        
        jsonwebtoken.verify(verifyToken, process.env.JWT_SECRET_KEY, async function(err, decoded){
            if(err){
                return next(err);
            }
            const user = await User.findByPk(decoded.id);
            await user.update({username:username, password:password, isRegisterCompleted:true});
            return res.status(200).json({success:true})
        });
    }
    catch(err)
    {
        return next(err);
    }
}


export const login = async(req, res, next) =>
{

    // attributes: { exclude: ['password'] }
    try
    {
        const {username, password} = req.body;
        if(!validateInputs(username, password))
        {
            return next(new CustomError(500, "Please provide an username and password"));
        }
        const user = await User.findOne({where: {username:username}, attributes:["id","username", "password", "isActive"], });
        if(!comparePasswords(password, user.password))
        {
            return next(new CustomError(500, "Check your credentials"));
        }
        if(user.isActive == false)
        {
            await user.update({isActive:true});
        }
        sendJwtToCookie(user,res);    
    }
    catch(err)
    {
        return next(err);
    }
}

export const logout = (req, res, next) =>
{
    res.cookie("access_token", null, {httpOnly:true})
    .status(200)
    .json({success:true, message:"You successfully logged out"});
}

export const editProfile = async(req, res, next) =>
{
    try
    {
        const {location, biography, website} = req.body;
        const user = await User.findOne({where: {id:req.user.id}, attributes:["id","location", "biography", "website"]});
        await user.update({location: location, biography:biography, website:website});
        res.status(200).json({success:true, data:user,message:"Update process successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const profile = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.body;
        const user = await User.findOne({where: {isActive:true, id:user_id}, attributes:["id","firstName","lastName", "username","dateOfBirth","createdAt","profilePicture", "location", "biography","website"]});
        const tweets = await Tweet.findAll({where: {UserId: user_id, isVisible:true}, attributes:["id", "content", "image","createdAt"]});
        const mentions = await Mention.findAll({where: {UserId: user_id, isVisible:true}, attributes:["id", "content", "image", "createdAt", "TweetId"]});
        const favorites = await sequelize.query(` 
        select 
        Tweets.id as TweetId, Tweets.content as TweetContent, Tweets.image as TweetImage, Tweets.mentionCount, Tweets.favoriteCount as TweetFavCount,
        Mentions.id as MentionId, Mentions.image as MentionImage, Mentions.content as MentionContent, Mentions.favoriteCount as MentionFavCount
        from Favorites 
        left join Tweets on Tweets.Id = Favorites.TweetId 
        left join Mentions on Mentions.Id = Favorites.MentionId
        where Favorites.UserId = ${user.id}`, { type: Sequelize.QueryTypes.SELECT });
        const retweets = await sequelize.query(`
        select
        Tweets.id as TweetId, Tweets.content as TweetContent, Tweets.image as TweetImage, 
        Users.firstName as FirstName, Users.lastName as LastName, Users.username as Username, Users.profilePicture as ProfilePicture
        from Retweets
        left join Tweets on Tweets.Id = Retweets.TweetId
        left join Users on Users.id = Tweets.UserId
        where Retweets.UserId = ${user.id}`, { type: Sequelize.QueryTypes.SELECT })
        res.status(200).json({success:true,user:user, tweets:tweets, mentions:mentions,favorites:favorites, retweets:retweets});
    }
    catch(err)
    {
        return next(err);
    }
}

export const uploadPhoto = async(req, res, next) =>
{
    try
    {
        if(!req.files)
        return next(new CustomError(400, "You did not provide an image to upload"));
        const fileName = imageUploader(req, next);
        const user = await User.findOne({where: {id:req.user.id},attributes:["id", "profilePicture"]});
        await user.update({profilePicture:fileName});
        res.status(200).json({success:true, message:"Profile Photo Uploaded"});
    }
    catch(err)
    { 
        return next(err);
    }
}

export const forgotPassword = async(req, res, next) =>
{
    try
    {
        if(req.cookies.access_token) //if there is no token in the cookie, user did not authorized to access this route.
        {
            return next(new CustomError(400, "You can not access to this route because you already logged in."));
        }
        const {email} = req.body;
        const user = await User.findOne({where:{email:email}, attributes:["id","resetPasswordToken",]});
        if(!user)
        {
            return next(new CustomError(500, "There is no user with that email"));
        }
        createResetPasswordToken(user, next);
        const url = `http://localhost:8080/auth/resetpassword?resetPasswordToken=${user.resetPasswordToken}`;
        //mail options can add to a function
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "About reset password",
            html : `<a href='${url}'>Link</a>`
        };
        mailHelper(mailOptions);
        res.status(200).json({success:true, message:`Reset password link sent to ${email}`});
    }
    catch(err)
    {
        //make reset password token and expires null
        return next(err);
    }
}

export const resetPassword = async(req,res,next) =>
{
    try
    {
        const {resetPasswordToken} = req.query;
        const {password} = req.body;
        const user = await User.findOne({where: {resetPasswordToken:resetPasswordToken, resetPasswordTokenExpires:{[Op.gte]:Date.now()}}, attributes:["id","password", "resetPasswordToken","resetPasswordTokenExpires"]}); //check date expires too.
        if(!user)
        return next(new CustomError(500, "Invalid reset password token or token expired"));
        await user.update({password:password, resetPasswordToken:null, resetPasswordTokenExpires:null})
        res.status(200).json({success:true, message: "Reset password successfull"});
    }   
    catch(err)
    {
        //make reset password token and expires null
        return next(err);
    }
}

export const changePassword = async(req, res, next) =>
{
    try
    {
        const {oldPassword,password} = req.body;
        const user = await User.findOne({where: {id:req.user.id}, attributes:["id", "password"]});
        if(!validateInputs(oldPassword, password))
        return next(new CustomError(400, "Old password and new password can not be null"));
        if(!comparePasswords(oldPassword, user.password))
        return next(new CustomError(400, "Old password is not correct"));
        await user.update({password: password});
        // logout(req, res ,next); //fresh login
        res.status(200).json({success:true, message: "Your password has been changed"});
    }
    catch(err)
    {
        return next(err);
    }    
}

export const deactiveAccount = async(req, res, next) =>
{
    try
    {
        const {password} = req.body;
        const user = await User.findOne({where: {isActive:true, id:req.user.id}, attributes:["id","password", "isActive"]});
        if(!user)
        {
            return next(new CustomError(400, "Your profile already deactived"));
        }
        if(!comparePasswords(password, user.password))
        {
            return next(new CustomError(400, "Check your credentials"))
        }
        await user.update({isActive:false});
        res.status(200).json({success:true, message:"Your account deactivated"});
        // logout(req, res,next);
    }
    catch(err)
    {
        return next(err);
    }
}

export const emailConfirmation = async(req, res, next) =>
{
    try
    {
        const {confirmToken} = req.query;
        const user = await User.findOne({where: {emailConfirmationToken:confirmToken, emailConfirmationTokenExpires:{[Op.gte]:Date.now()}}, attributes:["id", "isVerified", "emailConfirmationToken", "emailConfirmationTokenExpires"]});
        if(!user)
        return next(new CustomError(500, "Invalid email confirmation token or token expired"));
        await user.update({isVerified:true, emailConfirmationToken:null,emailConfirmationTokenExpires:null});
        res.status(200).json({success:true, message:"Your email has been verified"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const removePicture = async (req, res, next) =>
{
    try
    {
        const user = await User.findOne({where:{id:req.user.id}, attributes:["id", "profilePicture"]});
        await user.update({profilePicture:"default.png"});
        res.status(200).json({success:true, message:"Your profile picture has been deleted"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const follow = async (req, res, next) =>
{
    try
    {
        const {user_id} = req.body;
        if(await Follow.findOne({where: {FollowerId:user_id, FollowingId: req.user.id}}))
        return next(new CustomError(400, "You are already following this user"));
        if(user_id == req.user.id)
        return next(new CustomError(400, "You can not follow yourself"));
        const follow = await Follow.create({FollowerId: user_id, FollowingId:req.user.id});
        res.status(200).json({success:true, data:follow});
    }
    catch(err)
    {
        return next(err);
    }
}

export const unfollow = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.body;
        if(!await Follow.findOne({where: {FollowerId:user_id, FollowingId: req.user.id}}))
        return next(new CustomError(400, "You are already not following this user"));
        if(user_id == req.user.id)
        return next(new CustomError(400, "You can not unfollow yourself"));
        await Follow.destroy({where:{ FollowerId: user_id , FollowingId:req.user.id}});
        res.status(200).json({success:true, message:"Unfollow successfull"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const bookmarks = async(req, res, next)=>
{
    try
    {
        const tweetIds = [];
        const mentionIds= [];
        const bookmarks = await Bookmark.findAll({where:{UserId: req.user.id}, attributes:["id", "MentionId", "TweetId"]});
        for(var bookmark of bookmarks)
        {
            tweetIds.push(bookmark.TweetId);
            mentionIds.push(bookmark.MentionId);
        }
        const tweets = await Tweet.findAll({where: {id: {[Op.in]: tweetIds}}, attributes:["id","content", "image", "createdAt"]});
        const mentions = await Mention.findAll({where: {id:{[Op.in]:mentionIds}}, attributes:["id", "content", "image","createdAt"]});
        res.status(200).json({success:true, data:{tweets:tweets, mentions:mentions}});
    }
    catch(err)
    {
        return next(err);
    }
}

export const favorites = async(req, res, next) =>
{
    try
    {
        const tweetIds = [];
        const mentionIds= [];
        const favorites = await Favorite.findAll({where: {UserId:req.user.id}, attributes:["id", "UserId", "MentionId", "TweetId"]});
        for(var favorite of favorites)
        {
            tweetIds.push(favorite.TweetId);
            mentionIds.push(favorite.MentionId);
        }
        const tweets = await Tweet.findAll({where: {id: {[Op.in]: tweetIds}}, attributes:["id","content", "image", "createdAt"]});
        const mentions = await Mention.findAll({where: {id:{[Op.in]:mentionIds}}, attributes:["id", "content", "image","createdAt"]});
        res.status(200).json({success:true, data:{tweets:tweets, mentions:mentions}});
    }   
    catch(err)
    {
        return next(err);
    }
}