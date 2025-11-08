import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Connection error:", error);
  }
}
