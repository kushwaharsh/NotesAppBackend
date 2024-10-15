// const mongoose = require("mongoose")

// mongoose.connect("mongodb+srv://harshkushwaha1806:TrwdMtJ16u7Y4Dsc@cluster0.gqq0m.mongodb.net/notesapp?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
//     console.log("db connected")
// }).catch((err)=>{
//     console.log(err.message)
// })


const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
