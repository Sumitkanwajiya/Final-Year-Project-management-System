import Project from "../models/project.js";
import { ErrorHandler } from "../middleware/error.js";

export const getProjectByStudentId = async (studentId) => {
    return await Project.findOne({ student: studentId })
        .populate("supervisor", "name email")
        .sort({ createdAt: -1 });
};

export const createProject = async (projectData) => {
    const project = new Project(projectData);
    await project.save();
    return project;
};

export const getProjectById = async (projectId) => {
    const project = await Project.findById(projectId)
        .populate("student", "name email")
        .populate("supervisor", "name email");

    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }

    return project;
};

export const uploadFile = async (projectId, files) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }

    const categoryMap = {
        'reportFile': 'Report',
        'presentationFile': 'Presentation',
        'codeFiles': 'Code'
    };

    const fileMetaData = files.map(file => ({
        fileType: file.mimetype,
        fileUrl: file.path,
        originalName: file.originalname,
        category: categoryMap[file.fieldname] || 'Other',
        uploadedAt: Date.now(),
    }));



    project.files.push(...fileMetaData);
    await project.save();

    return project;
};

export const getAllProjects = async () => {
    const projects = await Project.find().populate("student", "name email").populate("supervisor", "name email").sort({ createdAt: -1 });
    const totalProjects = await Project.countDocuments();
    return { projects, totalProjects };
};



export const addFeedback = async (projectId, feedback) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    project.feedback.push(feedback);
    await project.save();
    return project;
};

export const markAsComplete = async (projectId) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    project.status = "Completed";
    await project.save();
    return project;
};

export const getProjectsBySupervisor = async (supervisorId) => {
    const projects = await Project.find({ supervisor: supervisorId }).populate("student", "name email").populate("supervisor", "name email").sort({ createdAt: -1 });
    const totalProjects = await Project.countDocuments({ supervisor: supervisorId });
    return { projects, totalProjects };
};


