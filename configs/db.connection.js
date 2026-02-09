
const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Mongoose Connected!");
    } catch (error){
        console.log("❌ Mongoose Connected Failed!");
        console.error("Mongo connection failed ", error.message)
        process.exit(1);
    }
}
module.exports = connectDB;