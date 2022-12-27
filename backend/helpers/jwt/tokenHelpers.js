import jsonwebtoken from "jsonwebtoken";
import CustomError from "../error/CustomError.js";

const createJwt = (user) =>
{
    const {JWT_SECRET_KEY, JWT_EXPIRES} = process.env;
    const payload = {
        id: user.id,
        username: user.username
    };
    return jsonwebtoken.sign(payload, JWT_SECRET_KEY, {expiresIn:JWT_EXPIRES});
}

const sendJwtToCookie = (user, res) =>
{
    const {COOKIE_EXPIRES} = process.env;
    const token = createJwt(user);
    res.cookie("access_token", token, {maxAge:COOKIE_EXPIRES * 60 * 1000, httpOnly:true})
    .status(200)
    .json({success:true, data:user, access_token:token});
}


const isTokenProvided = (req) =>
{
    return req.cookies.access_token;
}

const getToken = (req) =>
{
    return req.cookies.access_token;
}

export {createJwt,sendJwtToCookie,isTokenProvided,getToken}