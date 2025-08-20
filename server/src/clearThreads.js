import mongoose from "mongoose";
import dotenv from "dotenv";
import Thread from "./models/Thread.js";   // relative path (inside src)

dotenv.config();

async function clearThreads() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Thread.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} threads`);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error deleting threads:", err);
    process.exit(1);
  }
}

clearThreads();
