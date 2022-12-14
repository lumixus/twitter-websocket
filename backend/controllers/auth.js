import User from "../models/User.js";
import {sendJwtToCookie} from "../helpers/jwt/tokenHelpers.js";
import CustomError from "../helpers/error/CustomError.js";
import { comparePasswords, validateLoginInputs } from "../helpers/input/inputHelpers.js";

export const register = async(req, res, next) =>
{
    try{
        const {firstName, lastName, username, email, password, dateOfBirth, role} = req.body;
        const user = await User.create({firstName:firstName, lastName:lastName, username:username, email:email, password:password, dateOfBirth:dateOfBirth, role:role});
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
