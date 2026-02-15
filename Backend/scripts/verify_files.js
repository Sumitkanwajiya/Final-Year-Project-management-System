import mongoose from "mongoose";
import Project from "../models/Project.js";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config();

const verifyFiles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017");
        console.log("Connected to MongoDB");

        const projects = await Project.find({ "files.0": { $exists: true } });
        console.log(`Found ${projects.length} projects with files.`);

        for (const project of projects) {
            console.log(`\nProject: ${project.title} (ID: ${project._id})`);
            for (const file of project.files) {
                let filePath = file.fileUrl;
                const exists = fs.existsSync(filePath);
                console.log(`  File: ${file.originalName}`);
                console.log(`  Path stored in DB: ${filePath}`);
                console.log(`  Exists: ${exists ? "YES" : "NO"}`);

                if (!exists) {
                    // Try resolving if relative
                    const resolvedPath = path.resolve(filePath);
                    const existsResolved = fs.existsSync(resolvedPath);
                    console.log(`  Resolved Path: ${resolvedPath}`);
                    console.log(`  Exists (Resolved): ${existsResolved ? "YES" : "NO"}`);
                }
            }
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

verifyFiles();
