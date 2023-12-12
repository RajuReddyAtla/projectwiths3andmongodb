import mongoose, { model } from 'mongoose';

const contactSchema = new mongoose.Schema({
Name:{
    type:String,
    required: true
},
Mobile:{
    type:String,
    required:true
},
Message:{
    type:String,
    required:true
}
});

const ContactUs = model("ContactUs", contactSchema);
export default ContactUs;
