import mongoose from "mongoose";
import project from "./project.js";

const supervisorRequestSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student ID is required"],
    },

    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Supervisor ID is required"],
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },

    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: [500, "Message cannot exceed 500 characters"],
    },





}, { timestamps: true });

//indexing or data query optimization
supervisorRequestSchema.index({ student: 1, supervisor: 1, status: 1 });


export default mongoose.model("SupervisorRequest", supervisorRequestSchema);
