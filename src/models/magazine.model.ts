import mongoose,{model,Schema} from "mongoose";

const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type Magazine ={
  MagazineTitle:string;
  description:string;
  pdfKey:string;
  BannerKey:String;
  pdf:String
  Banner_location:String;
  createdAt: Date;
  updatedAt: String;
}


const magazine = new mongoose.Schema<Magazine>({
  MagazineTitle:String,
  description:String,
  pdfKey:String,
  BannerKey:String,
  pdf:String,
  Banner_location:String,
  createdAt: {
    type: Date,
   default: currentDate,
  },
  updatedAt: {
    type: String,
  },
});
magazine.pre("save", function (this: Magazine & mongoose.Document, next) {
  this.updatedAt = new Date() + curr_date;
  next();
});

 
const Magazine = mongoose.model("Magazine", magazine);

export default Magazine;
