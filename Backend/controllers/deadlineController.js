import asyncHandler from "../middleware/asyncHandler.js";
import { ErrorHandler } from "../middleware/error.js";
import DeadLine from "../models/deadline.js";
import Project from "../models/project.js";
import { getProjectById } from "../services/projectService.js";

export const createDeadline = asyncHandler(async (req, res, next) => {
    const { name, dueDate } = req.body;
    const { id } = req.params;

    console.log("Create Deadline Request:", { body: req.body, params: req.params, user: req.user._id });

    if (!name || !dueDate) {
        return next(new ErrorHandler("Name and dueDate are required", 400));
    }

    // Use findById directly instead of getProjectById to avoid error throwing
    const project = await Project.findById(id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    const deadlineData = {
        name,
        dueDate: new Date(dueDate),
        project: project._id,
        createdBy: req.user._id
    };

    const deadline = await DeadLine.create(deadlineData);

    // Update project with deadline
    await Project.findByIdAndUpdate(project._id, { deadline: dueDate }, { new: true, runValidators: true });

    res.status(201).json({
        success: true,
        message: "Deadline created successfully",
        deadline
    });
});

export const getAllDeadlines = asyncHandler(async (req, res, next) => {
    const deadlines = await DeadLine.find()
        .populate({
            path: "project",
            select: "title student supervisor deadline",
            populate: [
                { path: "student", select: "name email" },
                { path: "supervisor", select: "name email" }
            ]
        })
        .populate("createdBy", "name email")
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        deadlines
    });
});