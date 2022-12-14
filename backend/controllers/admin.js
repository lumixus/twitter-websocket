import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js"

export const blockUser = async(req, res, next) =>
{
    try
    {
        //If user's blocked status already false 
        const {user_id} = req.body;
        const user = await User.findByPk(user_id);
        if(user.blocked == true)
        {
            return next(new CustomError(500, "This user already blocked"));
        }
        user.blocked = true;
        await user.save();
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
        const user = await User.findByPk(user_id);
        if(user.blocked == false)
        {
            return next(new CustomError(500, "This user already did not block"));
        }
        user.blocked = false;
        await user.save();
        res.status(200).json({success:true, message:`The user's block status ${user.blocked}`});
    }
    catch(err)
    {
        return next(err);
    }
}