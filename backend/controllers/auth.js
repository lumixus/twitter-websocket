import User from "../models/User.js";
import {sendJwtToCookie} from "../helpers/jwt/tokenHelpers.js";
import CustomError from "../helpers/error/CustomError.js";
import { comparePasswords, validateLoginInputs } from "../helpers/input/inputHelpers.js";
import path from "path";
import { createEmailConfirmationToken, createResetPasswordToken, hashPassword } from "../helpers/database/modelHelpers.js";
import { mailHelper } from "../helpers/mailHelper/mailHelper.js";

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
        if(!validateLoginInputs(username, password))
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
        const file = req.files.file //the name of file input = file
        // let uploadPath = path.join(path.dirname(require.main.filename), "/public/uploads", file.name);
        // let uploadPath = path.join(require.main.filename,"/public/uploads", file.name);
        let uploadPath = path.join(path.dirname("index.js"), "/public/uploads", file.name);
        const allowedMimetypes = ["image/png", "image/jpg", "image/jpeg"];
        if(!allowedMimetypes.includes(file.mimetype))
        return next(new CustomError(400, "Unsupported file type"));
        file.mv(uploadPath, function(err)
        {
            if(err)
            return next(err);
        });
        const user = await User.findByPk(req.user.id);
        user.profilePicture = file.name;
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
        //if there is a user in req. He will not access to this route
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
        await user.update({password:password, resetPasswordToken:null, resetPasswordTokenExpires:null});
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
        const {oldPassword,password} = req.body;
        const user = await User.findByPk(req.user.id);
        if(!comparePasswords(oldPassword, user.password))
        {
            return next(new CustomError(400, "Old password is not correct"));
        }
        await user.update({password: password});
        res.status(200).json({success:true, message: "Your password has been changed"});
        // logout(); //After password changing, fresh login.
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
        const user = await User.findOne({where: {isActive:true, id:req.user.id}});
        if(!user)
        {
            return next(new CustomError(400, "Your profile already deactived"));
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