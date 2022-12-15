import randomstring from "randomstring";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const createResetPasswordToken = async(user, next) =>
{
    
    try
    {
        const {RESET_PASSWORD_TOKEN_EXPIRES} = process.env;
        const str = crypto.randomBytes(15).toString("hex");
        const hash = crypto.createHash("SHA256").update(str).digest("hex");
        await user.update({resetPasswordToken:hash, resetPasswordTokenExpires:RESET_PASSWORD_TOKEN_EXPIRES});
        return user.resetPasswordToken;
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
