import mongoose from "mongoose";


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db connected");

    }
    catch(err){
        console.error("mongodb error",err.message);
        process.exit(1);
    }
}

export default connectDB;