import sequelize from "../helpers/database/dbConnection.js";
import { DataTypes, ValidationError } from "sequelize";
import bcryptjs from "bcryptjs";
import { hashPassword } from "../helpers/database/modelHelpers.js";
// import Tweet from "./Tweet.js";
import Mention from "./Mention.js";
import Tweet from "./Tweet.js";
import Favorite from "./Favorite.js";


const validatePhone = (phone) => {
    var re = /^([+]\d{2})?\d{10}$/;
    return re.test(String(phone));
}

const User = sequelize.define("User",
{
    //ID Column will be added automatically
    name: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
           len:{
            args : [3, 50],
            msg: ["Please provide a name between 3-35 characters"]
           },
           notNull: {
            args: [true],
            msg:"You have to provide a name"
           },
           notEmpty: true
        },
    },
    username : {
        type: DataTypes.STRING,
        unique:true,
        validate: {
            len:{
                args: [3,35],
                msg:["Please provide a username between 3-35 characters"],
            },
        },
    },
    email: {
        type:DataTypes.STRING,
        unique:true,
        // validate:{
        //     isEmail:{
        //         msg: "Please provide a valid email"
        //     },
        //     notEmpty:false
        // },
        allowNull: true
    },
    phone: {
        type:DataTypes.STRING,
        unique:true,
        allowNull:true
    },
    password: {
        type: DataTypes.STRING,
        validate:{
            len: {
                args:[8, 255],
                msg: "Please provide a password between 8 - 255 characters"
            },
        }
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull:false,
        validate: {
            notNull: {
                args: [true],
                msg:"You have to provide a birth date"
            },
            notEmpty:true,
        }
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: "default.jpg"
    },
    role: {
        type: DataTypes.STRING,
        defaultValue:"user"
    },
    location: {
        type: DataTypes.STRING,
    },
    biography : {
        type: DataTypes.STRING,   
    },
    website : {
        type: DataTypes.STRING,
        validate:{
            isUrl:{
                msg: "Please enter a valid url"
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resetPasswordToken: {
        type:DataTypes.STRING,
        defaultValue:null
    },
    resetPasswordTokenExpires: {
        type:DataTypes.DATE,
        defaultValue:null
    },
    verificationCode:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    verificationCodeExpires: {
        type:DataTypes.DATE,
        defaultValue:null
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue:false,
    },
    isVerifiedByTwitter: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    isRegisterCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

User.addHook("afterUpdate", async function(user)
{
    if(user.changed("isActive"))
    {
        const tweets = await Tweet.findAll({where: {hidByUser:false, UserId:user.id}}); //boş dizi geliyor
        tweets.forEach(async tweet=>
            {
                await tweet.update({isVisible:user.isActive});
            });
        const mentions = await Mention.findAll({where: {hidByUser:false,UserId:user.id}});
        mentions.forEach(async mention =>
            {
                await mention.update({isVisible:user.isActive});
            });
        const favorites = await Favorite.findAll({where: {UserId: user.id}})
        favorites.forEach(async favorite => 
            {
                await favorite.update({isVisible:user.isActive})
            });
    }
});

User.addHook("beforeUpdate",async function(user)
{
    if(user.changed("password"))
    {
        const hash = hashPassword(user.password)
        user.password = hash;
    }
});

await sequelize.sync().then(()=> console.log("User sync done")).catch(err=>console.log(err));

export default User;