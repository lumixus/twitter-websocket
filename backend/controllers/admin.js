import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js"

export const blockUser = async(req, res, next) =>
{
    try
    { 
        const {user_id} = req.body;
        const user = await User.findOne({where: {id:user_id}, attributes:["id", "blocked", "isActive"]});
        if(user.blocked == true)
        {
            return next(new CustomError(500, "This user already blocked"));
        }
        await user.update({isActive:false, blocked:true});
        res.status(200).json({success:true, message:`The user's block status ${user.blocked}`});
    }
    catch(err)
    {
        return next(err);
    }
}

export const unblockUser = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.body;
        const user = await User.findOne({where: {id:user_id}, attributes:["id", "blocked", "isActive"]});
        if(user.blocked == false)
        {
            return next(new CustomError(500, "This user already did not block"));
        }
        await user.update({isActive:true, blocked:false});
        res.status(200).json({success:true, message:`The user's block status ${user.blocked}`});
    }
    catch(err)
    {
        return next(err);
    }
}

export const getAllUsers = async (req, res, next) =>
{
    try
    {
        const users = await User.findAll({attributes:["id","firstName", "lastName", "username", "email", "dateOfBirth", "profilePicture", "role", "createdAt", "isActive"]});
        res.status(200).json({success:true, data:users});
    }
    catch(err)
    {
        return next(err);
    }
}