// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Thread from "./models/Thread.js"; // adjust path if needed

// dotenv.config();

// async function clearThreads() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");

//     // Delete all threads
//     const result = await Thread.deleteMany({});
//     console.log(`🗑️ Deleted ${result.deletedCount} threads`);

//   } catch (err) {
//     console.error("❌ Error deleting threads:", err);
//   } finally {
//     // Ensure the connection is closed
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected from MongoDB");
//     process.exit(0);
//   }
// }

// clearThreads();
