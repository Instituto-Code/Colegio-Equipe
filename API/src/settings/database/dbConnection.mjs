import mongoose from "mongoose";
import dotenv from "dotenv"

const dbConnection = async (app) => {
    try {
        mongoose.connect(process.env.DB_URI);
        console.log("Conectado ao mongoose...");
    } catch (error) {
        console.log(error);
    }
};

export default dbConnection;
