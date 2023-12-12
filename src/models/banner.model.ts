import mongoose from "mongoose";

const currentDate = new Date();

type Banner ={
  bannerKey:string,
    Banner_location: string,
    status: string,
    createdAt: Date;
}

 
const BannerSchema = new mongoose.Schema<Banner>({
 
  Banner_location: String,
  bannerKey:String,
  status: {
    type: String,
    enum: ["Offline", "Online"],
    default: "Online",
  },
  createdAt: {
    type: Date,
   default: currentDate,
  },
});

 
const Banner = mongoose.model("Banner", BannerSchema);

export default Banner;
