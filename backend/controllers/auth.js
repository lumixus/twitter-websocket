import User from "../models/User.js";
import {sendJwtToCookie} from "../helpers/jwt/tokenHelpers.js";
import CustomError from "../helpers/error/CustomError.js";
import { comparePasswords, validateInputs } from "../helpers/input/inputHelpers.js";
import { createEmailConfirmationToken, createResetPasswordToken } from "../helpers/database/modelHelpers.js";
import { mailHelper } from "../helpers/mailHelper/mailHelper.js";
import { imageUploader } from "../helpers/imageUploader/imageUploader.js";
import Follow from "../models/Follow.js";
import Bookmark from "../models/Bookmark.js";
import Favorite from "../models/Favorite.js";

export const register = async(req, res, next) =>
{
    try{
        const {firstName, lastName, username, email, password, dateOfBirth, role} = req.body;
        const user = await User.create({firstName:firstName, lastName:lastName, username:username, email:email, password:password, dateOfBirth:dateOfBirth, role:role});
        createEmailConfirmationToken(user,next);
        const url = `http://localhost:8080/auth/emailconfirmation?confirmToken=${user.emailConfirmationToken}`;
        const mailOptions = {
            from: process.env.SMTP_USER,
            to:email,
            subject: "Email confirmation",
            html: `<h1>This<a href='${url}'> link </a>provides a email confirmation</h1>`
        };
        mailHelper(mailOptions);
        sendJwtToCookie(user, res);
    }
    catch (err)
    {
        return next(err);
    }
}

export const login = async(req, res, next) =>
{
    try
    {
        const {username, password} = req.body;
        if(!validateInputs(username, password))
        {
            return next(new CustomError(500, "Please provide an username and password"));
        }
        const user = await User.findOne({where: {username:username}});
        if(!comparePasswords(password, user.password))
        {
            return next(new CustomError(500, "Check your credentials"));
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
        const {user_id, location, biography, website} = req.body;
        const user = await User.findByPk(user_id);
        await user.update({location: location, biography:biography, website:website});
        await user.save();
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
        const user = await User.findOne({where: {isActive:true, id:req.user.id}});
        res.status(200).json({success:true, data:user})
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
        const user = await User.findByPk(req.user.id);
        user.profilePicture = fileName;
        await user.save();
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
        if(req.headers.authorization) //if there is no token in the header, user did not login.
        {
            return next(new CustomError(400, "You can not access to this route because you already logged in."));
        }
        const {email} = req.body;
        const user = await User.findOne({where:{email:email}});
        if(!user)
        {
            return next(new CustomError(500, "There is no user with that email"));
        }
        createResetPasswordToken(user, next);
        const url = `http://localhost:8080/auth/resetpassword?resetPasswordToken=${user.resetPasswordToken}`;
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
        return next(err);
    }
}

export const resetPassword = async(req,res,next) =>
{
    try
    {
        const {resetPasswordToken} = req.query;
        const {password} = req.body;
        const user = await User.findOne({where: {resetPasswordToken:resetPasswordToken}}); //check date expires too.
        if(!user)
        return next(new CustomError(500, "There is no user with that reset password token"));
        await user.update({password:password, resetPasswordToken:null, resetPasswordTokenExpires:null})
        res.status(200).json({success:true, message: "Password change successfull"});
    }   
    catch(err)
    {
        return next(err);
    }
}

export const changePassword = async(req, res, next) =>
{
    try
    {
        //need to fresh login to access this route
        const {oldPassword,password} = req.body;
        const user = await User.findByPk(req.user.id);
        if(!validateInputs(oldPassword, password))
        return next(new CustomError(400, "Old password and new password can not be null"));
        if(!comparePasswords(oldPassword, user.password))
        return next(new CustomError(400, "Old password is not correct"));
        await user.update({password: password});
        logout(req, res ,next); //fresh login
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
        const user = await User.findOne({where: {isActive:true, id:req.user.id}});
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
        const user = await User.findOne({where: {emailConfirmationToken:confirmToken}}); //and expires date
        if(!user)
        return next(new CustomError(500, "There is no user with that confirm token"));
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
        const user = await User.findByPk(req.user.id);
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
        const user = await User.findByPk(user_id);
        if(await Follow.findOne({where: {FollowerId:user.id, FollowingId: req.user.id}}))
        return next(new CustomError(400, "You are already following this user"));
        if(user.id == req.user.id)
        return next(new CustomError(400, "You can not follow yourself"));
        const follow = await Follow.create({FollowerId: user.id , FollowingId:req.user.id});
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
        const user = await User.findByPk(user_id);
        if(!await Follow.findOne({where: {FollowerId:user.id, FollowingId: req.user.id}}))
        return next(new CustomError(400, "You are already not following this user"));
        if(user.id == req.user.id)
        return next(new CustomError(400, "You can not unfollow yourself"));
        await Follow.destroy({where:{ FollowerId: user.id , FollowingId:req.user.id}});
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
        const bookmarks = await Bookmark.findAll({where:{UserId: req.user.id}});
        res.status(200).json({success:true, data:bookmarks});
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
        const favorites = await Favorite.findAll({where: {UserId:req.user.id}});
        res.status(200).json({success:true, data:favorites});
    }   
    catch(err)
    {
        return next(err);
    }
}