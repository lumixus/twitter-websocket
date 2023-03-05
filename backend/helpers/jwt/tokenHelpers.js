import jsonwebtoken from "jsonwebtoken";
import CustomError from "../error/CustomError.js";

const createJwt = (user) =>
{
    const {JWT_SECRET_KEY, JWT_EXPIRES} = process.env;
    const payload = {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
        email: user.email,
        name: user.name
    };
    return jsonwebtoken.sign(payload, JWT_SECRET_KEY, {expiresIn:JWT_EXPIRES});
}

const sendJwtToCookie = (user, res) =>
{
    const {COOKIE_EXPIRES} = process.env;
    const token = createJwt(user);

    const userInformation = {
        name: user.name,
        profilePicture: user.profilePicture,
        username: user.username,
        email: user.email,
        phone: user.phone
    }

    res
    .cookie("access_token", token, {maxAge:COOKIE_EXPIRES * 60 * 1000, httpOnly:true})
    .status(200)
    .json({success:true, data: userInformation, access_token:token});
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