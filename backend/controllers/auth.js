import User from "../models/User.js";
import {createJwt, sendJwtToCookie} from "../helpers/jwt/tokenHelpers.js";
import CustomError from "../helpers/error/CustomError.js";
import { comparePasswords, validateInputs } from "../helpers/input/inputHelpers.js";
import { createVerificationCode, createResetPasswordToken } from "../helpers/database/modelHelpers.js";
import { createMailOptions, mailHelper } from "../helpers/mailHelper/mailHelper.js";
import { Op } from "sequelize";
import { sendSms } from "../helpers/smsHelper/smsHelper.js";
import jsonwebtoken from "jsonwebtoken";
import { createUsername } from "../helpers/database/createUsername.js";

export const firstOnBoarding = async(req, res, next) =>
{
    try
    {
        let {name, dateOfBirth, phone, email} = req.body;

        if(!validateInputs(name, dateOfBirth, phone || email)) {
            return next(new CustomError(400, "Sure to filled all fields"))
        }

        const key = phone||email; //email or phone gonna be passed into this variable

        const user = await User.findOne({where: {phone:key}}) || await User.findOne({where:{email:key}});

        if(user && user.isRegisterCompleted == false) {
        
            const verificationCode = await createVerificationCode();
        
            if(user.email != null) {
                mailHelper(createMailOptions(email, 'Email Confirmation', `Your email confirmation code is ${verificationCode}`));
            }
            else {
                sendSms(phone, `Your phone verification code is ${verificationCode}`)
            }
        
            await user.update({verificationCode:verificationCode, verificationCodeExpires: new Date(Date.now() + 1 * 5 * 60 * 1000)});
        }
        else{
           
            const verificationCode = await createVerificationCode();
           
            await User.create({
                name: name, 
                dateOfBirth:dateOfBirth, 
                phone:phone, 
                email: email, 
                verificationCode:verificationCode, 
                verificationCodeExpires: new Date(Date.now() + 1 * 5 * 60 * 1000)
            });

            if(!phone)
            {
                if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
                
                    return next(new CustomError(400, "Email invalid"));
                }
                
                mailHelper(createMailOptions(email, 'Email Confirmation', `Your email confirmation code is ${verificationCode}`));
            }
            else
            {
                if(!/^([+]\d{2})?\d{10}$/.test(phone)){

                    return next(new CustomError(400, "Phone is invalid"));
                }
                
                sendSms(phone, `Your phone verification code is ${verificationCode}`)
            }
        }

        res
        .status(200)
        .json({success:true});
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

        const key = email||phone;
        
        if(!key){
        
            return next(new CustomError(400, "Email and phone must be provided"));
        }
        
        const user = await User.findOne({where: {phone:key}}) || await User.findOne({where:{email:key}});
        
        if(!user) {
        
            return next(new CustomError(400, "There is no user with provided email or phone"))
        }
        
        if(user.verificationCode != verificationCode || user.verificationCodeExpires < Date.now()) {
        
            return next(new CustomError(400, "Your verification code wrong or expired"));
        };

        await user.update({
            isVerified:true, 
            verificationCode:null, 
            verificationCodeExpires:null
        });
        
        const verifyToken = createJwt(user);
        
        res
        .status(200)
        .json({success:true, verifyToken:verifyToken});
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
        const {password, verifyToken} = req.body;

        if(!validateInputs(password, verifyToken)){
            return next(new CustomError(400, "Fill the all fields"));
        }

        jsonwebtoken.verify(verifyToken, process.env.JWT_SECRET_KEY, async function(err, decoded){
            if(err){
                return next(err);
            }
        
            const user = await User.findByPk(decoded.id);
        
            if(!user) {
                return next(new CustomError(400, "Wrong Verification Token"));
            }

            const username = await createUsername(user.name);

            await user.update({
                username:username, 
                password:password, 
                isRegisterCompleted:true
            });

            sendJwtToCookie(user, res);
        });
    }
    catch(err)
    {
        return next(err);
    }
}


export const login = async(req, res, next) =>
{
    try
    {
        const {key, password} = req.body;

        if(!validateInputs(key, password))
        {
            return next(new CustomError(500, "Please provide an username and password"));
        }
        
        const user = await User.findOne({
            where: {[Op.or]: 
                [
                    {username:key}, 
                    {email:key}, 
                    {phone:key}
                ]}, 

            attributes: [
                "id",
                "username", 
                "email",
                "name",
                "profilePicture", 
                "phone", 
                "password", 
                "isActive"
            ]
        });
        
        if(!user) {
            return next(new CustomError(400, "There is not user with provided information"));
        }

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
    res
    .cookie("access_token", null, {httpOnly:true})
    .status(200)
    .json({success:true, message:"You successfully logged out"});
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
        
        const user = await User.findOne({
            where: {email:email}, 
            attributes:["id","resetPasswordToken",]
        });
        
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
        
        res
        .status(200)
        .json({success:true, message:`Reset password link sent to ${email}`});
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

        const user = await User.findOne({
            where: {
                resetPasswordToken:resetPasswordToken, 
                resetPasswordTokenExpires:{[Op.gte]:Date.now()}
            }, 
            attributes: [
                "id",
                "password", 
                "resetPasswordToken",
                "resetPasswordTokenExpires"
            ]
        });

        if(!user) {
            return next(new CustomError(500, "Invalid reset password token or token expired"));
        }

        await user.update({
            password:password, 
            resetPasswordToken:null, 
            resetPasswordTokenExpires:null
        });
        
        res
        .status(200)
        .json({success:true, message: "Reset password successfull"});
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

        const user = await User.findOne({
            where: {id:req.user.id}, 
            attributes:["id", "password"]
        });
        
        if(!validateInputs(oldPassword, password)) {
            return next(new CustomError(400, "Old password and new password can not be null"));
        }
        if(!comparePasswords(oldPassword, user.password)) {
            return next(new CustomError(400, "Old password is not correct"));
        }

        await user.update({password: password});
        
        res
        .cookie("access_token", null)
        .status(200)
        .json({success:true, message:"Your password has been changed"});
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

        const user = await User.findOne({
            where: {isActive:true, id:req.user.id}, 
            attributes:[
                "id",
                "password", 
                "isActive"
            ]
        });
        
        if(!user)
        {
            return next(new CustomError(400, "Your profile already deactived"));
        }

        if(!comparePasswords(password, user.password))
        {
            return next(new CustomError(400, "Check your credentials"))

        }

        await user.update({isActive:false});

        res
        .cookie("access_token", null)
        .status(200)
        .json({success:true, message:"Your account has been deactivated"});
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

        const user = await User.findOne({
            where: {
                emailConfirmationToken:confirmToken, 
                emailConfirmationTokenExpires:{[Op.gte]:Date.now()}
            }, 
            attributes:[
                "id", 
                "isVerified", 
                "emailConfirmationToken", 
                "emailConfirmationTokenExpires"
            ]
        });

        if(!user){
            return next(new CustomError(500, "Invalid email confirmation token or token expired"));
        }

        await user.update({
            isVerified:true, 
            emailConfirmationToken:null,
            emailConfirmationTokenExpires:null
        });

        res
        .status(200)
        .json({success:true, message:"Your email has been verified"});
    }
    catch(err)
    {
        return next(err);
    }
}


export const getUserWithCookie = async (req, res, next) => {
    try {    
        res.status(200).json({success: true, user: req.user});
    } catch (err) {
        return next(err);
    }
}