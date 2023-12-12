import mongoose, { Schema, model } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const currentDate = new Date();

  
type UserDocument = {
    name:String;
    phone: String;
    email:String;
    password:String;
    role:String,
  forgetPasswordToken: string;
  forgetPasswordExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  refreshToken: string;
  accessToken: string;
  recentlyplayed:[{type:Schema.Types.ObjectId,ref:'songs'}]
  // methods
  setPassword: (password: string) => void;
  checkValidPassword: (userSendPassword: string) => Promise<boolean>;
  getJwtToken: () => Promise<string>;
  getForgetPasswordToken: () => Promise<string>;
  getForgetPasswordLink: () => Promise<string>;
  };
  
  export const userSchema = new Schema<UserDocument>({
    name: {
      type: String,
      required: [true, 'Please Provide a name'],
      maxLength: [50, 'Name should be under 50 characters'],
    },
  
    phone: {
      type: String,
      required: [true, 'Please Provide a phone number'],
      unique: true,
    },

    email: {
        type: String,
        validate: {
          validator: validator.isEmail,
          message: 'Please Provide a valid email',
        },
        unique: true,
      },

    password: {
        type: String,
        required: [true, 'password atleast 6 characters'],
        unique: true,
      },

      role: {
        type: String,
        enum: ["user"],
        default: "user",
      },


      forgetPasswordToken: {
        type: String,
      },
      forgetPasswordExpiry: {
        type: Date,
      },
      createdAt: {
        type: Date,
       default: currentDate,
      },
      updatedAt: {
        type: Date,
      },
      provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local',
      },
      refreshToken: {
        type: String,
      },
      accessToken: {
        type: String,
      },
  });
 
  const User = model('users', userSchema);
export default User;