import randomstring from "randomstring";
import bcryptjs from "bcryptjs";
import crypto from "crypto";


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
        const {RESET_PASSWORD_TOKEN_EXPIRES} = process.env;
        const resetPasswordToken = createRandomToken();
        await user.update({resetPasswordToken:resetPasswordToken, resetPasswordTokenExpires:RESET_PASSWORD_TOKEN_EXPIRES});
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
        const {EMAIL_CONFIRMATION_TOKEN_EXPIRES} = process.env;
        const emailConfirmationToken = createRandomToken();
        await user.update({emailConfirmationToken:emailConfirmationToken, emailConfirmationTokenExpires:EMAIL_CONFIRMATION_TOKEN_EXPIRES});
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

