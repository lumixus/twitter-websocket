import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../../models/User.js";
import random from "random-numbers"
import CustomError from "../error/CustomError.js";

export const createRandomToken = () =>
{
    const str = crypto.randomBytes(15).toString("hex");
    const token = crypto.createHash("SHA256").update(str).digest("hex");
    return token;
}
export const createResetPasswordToken = async(user, next) =>
{
    try
    {
        const resetPasswordToken = createRandomToken();
        await user.update({resetPasswordToken:resetPasswordToken, resetPasswordTokenExpires:new Date(Date.now() + 1 * 60 * 60 * 1000)});
        return user.resetPasswordToken;
    }
    catch(err)
    {
        return next(err);
    }
}

export const createVerificationCode = async() =>
{
    try
    {
        const emailConfirmationCode = random.create(111111,999999);
        return emailConfirmationCode;
    }
    catch(err)
    {
        return next(err);
    }
} 

export const hashPassword = (password) =>
{
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);
    return hash;
}

