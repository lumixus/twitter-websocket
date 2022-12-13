import sequelize from "../helpers/database/dbConnection.js";
import { DataTypes } from "sequelize";
import bcryptjs from "bcryptjs";

const User = sequelize.define("User",
{
    //ID Column will be added automatically
    firstName: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
           len:{
            args : [3, 35],
            msg: ["Please provide a name between 3-35 characters"]
           },
           notNull: {
            args: [true],
            msg:"You have to provide a first name"
           },
           notEmpty: true
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            len: {
                args: [2, 35],
                msg: ["Please provide a last name between 2-35 characters"],
            },
            notNull: {
                args: [true],
                msg:"You have to provide a last name"
            },
            notEmpty: true
        }
    },
    username : {
        type: DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate: {
            len:{
                args: [3,35],
                msg:["Please provide a username between 3-35 characters"],
            },
            notNull: {
                args: [true],
                msg:"You have to provide a username"
            },
            notEmpty: true
        },
    },
    email: {
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            isEmail:{
                msg: "Please provide a valid email"
            },
            notNull: {
                args: [true],
                msg:"You have to provide a username"
            },
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: {
                args:[8, 255],
                msg: "Please provide a password between 8 - 255 characters"
            },
            notNull: {
                args: [true],
                msg:"You have to provide a username"
            },
            notEmpty:true,
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
    }
});

User.addHook("beforeCreate", function(user)
{
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(user.password, salt);
    user.password = hash;
});

await sequelize.sync().then(()=> console.log("Sync done")).catch(err=>console.log(err));
// pay attention is active gonna have a default value
export default User;