import CustomError from "../../helpers/error/CustomError.js";
import { getToken, isTokenProvided } from "../../helpers/jwt/tokenHelpers.js";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/User.js";

export const isAuth = (req, res, next) =>
{
    if(!isTokenProvided(req))
    {
        return next(new CustomError(500, "You have to provide a token to access this route"));
    }
    const {JWT_SECRET_KEY} = process.env;
    const token = getToken(req);
    jsonwebtoken.verify(token, JWT_SECRET_KEY, (err, decoded)=>
    {
        if(err)
        {
            return next(err);
        }
        else
        {
            req.user = {
                id: decoded.id,
                username: decoded.username,
            };
            return next();
        }
    });
}

export const adminAccess = async (req, res, next) =>
{
    const user = await User.findOne({where:{id:req.user.id}});
    if(user.role != "admin")
    {
        return next(new CustomError(403, "Only admins can access to this route"));
    }
    next();
} 