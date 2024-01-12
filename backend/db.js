
const mongoose=require('mongoose');

const mongoURI="mongodb://localhost:27017/enotebook?readPreference=primary&directConnection=true";

const connectDB=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("SucessFully Connected to mongoose")
    })
}

module.exports=connectDB;



