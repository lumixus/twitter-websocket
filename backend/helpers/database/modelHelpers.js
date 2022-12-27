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

// export const exampleName = async(tweets,next)=>
// {
//     //Beklemeden arrayını döndürüyor async işlemlerle ilgili bir durum var
//     try
//     {
//         const response = [];
//         for(var tweet of tweets)
//         {
//             const user = await User.findOne({attributes:["firstName", "lastName", "username"], where: {id:tweet.UserId}});
//             const obj = {"tweet":tweet, "user":user};
//             response.push(obj);
//         }
//         return response;
//     }
//     catch(err)
//     {
//         return next(err);
//     }
// }

// {
//     "firstName":"Tumer",
//     "lastName": "Altunbas",
//     "username" : "tumer3",
//     "email":"tumeraltunbass3@gmail.com",
//     "role":"user",
//     "password" : "tumer1234",
//     "dateOfBirth" : "2002-10-03"
// }