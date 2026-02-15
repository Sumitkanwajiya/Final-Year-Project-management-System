import mongoose from "mongoose";

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "fyp_management_system"
    })
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
}
export default connectDB;