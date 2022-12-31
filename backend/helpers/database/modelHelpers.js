import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../../models/User.js";

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

export const createEmailConfirmationToken = async(user, next) =>
{
    try
    {
        const emailConfirmationToken = createRandomToken();
        await user.update({emailConfirmationToken:emailConfirmationToken, emailConfirmationTokenExpires:new Date(Date.now() + 1 *60 * 60 * 1000)});
        return user.emailConfirmationToken;
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

