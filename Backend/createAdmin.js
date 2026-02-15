import connectDB from "./config/db.js";
import User from "./models/user.js";
import { config } from "dotenv";

config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (adminExists) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const admin = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123", // Assuming you have password hashing in your User model pre-save hook
            department: "Administration",
            role: "Admin",
        });

        console.log("Admin created successfully");
        console.log({
            email: admin.email,
            password: "password123",
        });
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
