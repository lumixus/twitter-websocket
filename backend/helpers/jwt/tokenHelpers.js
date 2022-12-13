import randomstring from "randomstring";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
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
    res.cookie("access_token", token, {maxAge:COOKIE_EXPIRES, httpOnly:true})
    .status(200)
    .json({success:true, data:user, access_token:token});
}

export {createJwt,sendJwtToCookie}