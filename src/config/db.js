// import dotenv from "dotenv";
// dotenv.config();
const mongoose  = require("mongoose");
// import { MONGO_URI } from "./env.js";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/unify";

exports.connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[DB] MongoDB Connected...");
    } catch (error) {
        console.error("[DB ERROR] Failed to connect:", error);
        process.exit(1);
    }
};



mongoose.connection.on('disconnected', () => {
    console.log('[DB] Mongoose disconnected');
});

