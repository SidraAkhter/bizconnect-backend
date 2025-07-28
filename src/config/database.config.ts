import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to Mongo database");
  } catch (error: any) {
    console.error("❌ Error connecting to Mongo database:", error.message);
    process.exit(1); // Stops the app if DB connection fails
  }
};

export default connectDatabase;
