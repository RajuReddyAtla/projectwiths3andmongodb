import validator from "validator";
import mongoose, { model, Schema } from "mongoose";

// const crypto = require("crypto");
// const bcrypt = require("bcrypt");

const currentDate = new Date();

const adminSchema =  new mongoose.Schema({

  email: 
  {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'Please Provide a valid email',
      },
      unique: true,
    },

  password: 
  {
    type: String,
    required: [false, "Please Provide a password"],
    minLength: [8, "Password should be atleast 8 characters"],
  },
  createdAt: {
    type: Date,
   default: currentDate,
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
});


const Admin = model("admin", adminSchema);
export default Admin;
