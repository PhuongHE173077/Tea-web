import mongoose from "mongoose";

const { env } = require("./environment");

const CONNECT_DB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 50
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

export default CONNECT_DB;