import mongoose from "mongoose";
const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type Message ={
  MessageTitle:string;
    description:string;
    File_Location:String;
    YouTube_Url:String;
    BannerKey:String,
    Banner_Location:String,
    createdAt: Date;
    updatedAt: String;
  }

const messageSchema = new mongoose.Schema({
  MessageTitle: String,
  description: String,
  File_Location: String,
  YouTube_Url: String,
    // Banner:String,
    BannerKey:String,
    Banner_Location:String,
    
    createdAt: {
      type: Date,
     default: currentDate,
    },
      updatedAt: {
        type: String,
      },
    });
    messageSchema.pre("save", function (this: Message & mongoose.Document, next) {
      this.updatedAt = new Date() + curr_date;
      next();
    });


const Message = mongoose.model("message",messageSchema)
export default Message;