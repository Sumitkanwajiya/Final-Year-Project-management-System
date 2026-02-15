import * as ProjectService from "../services/projectService.js";
import * as fileService from "../services/fileServices.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ErrorHandler } from "../middleware/error.js";


export const getAllProjects = asyncHandler(async (req, res) => {
    const { projects, totalProjects } = await ProjectService.getAllProjects();
    res.status(200).json({
        success: true,
        data: { projects, totalProjects },
    });
});

export const downloadFile = asyncHandler(async (req, res, next) => {
    const { projectId, fileId } = req.params;
    const user = req.user;

    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }
    const userRole = (user.role || "").toLowerCase();
    const userId = user._id?.toString() || user._id;
    const hasAccess = userRole === "admin" || project.student._id.toString() === userId || (project.supervisor && project.supervisor._id.toString() === userId);

    if (!hasAccess) {
        return next(new ErrorHandler("You are not authorized to download this project", 403));
    }

    const file = project.files.id(fileId);
    if (!file) {
        return next(new ErrorHandler("File not found", 404));
    }

    fileService.streamDownload(file.fileUrl, file.originalName, res);
});