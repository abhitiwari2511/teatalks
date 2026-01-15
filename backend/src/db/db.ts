import mongoose from "mongoose"

const DB_NAME = "teatalks"

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`DB connected successfully !! DB host: ${connection.connection.host}`);
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}

export default connectDB;