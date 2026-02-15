import asyncHandler from "../middleware/asyncHandler.js";
import { ErrorHandler } from "../middleware/error.js";
import User from "../models/user.js";
import Project from "../models/project.js";
import SupervisorRequest from "../models/supervisorRequest.js";
import Notification from "../models/notification.js";
import * as requestServices from "../services/requestService.js";
import * as projectServices from "../services/projectService.js";
import * as fileService from "../services/fileServices.js";
import sendEmail from "../services/emailService.js";
import { generateRequestAcceptTemplate, generateRequestRejectTemplate } from "../utils/emailTemplate.js";
import * as notificationServices from "../services/notificationService.js";
import * as userServices from "../services/userService.js";

// Get teacher dashboard stats
export const getTeacherDashboardStats = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;

    // Get pending supervisor requests for this teacher
    const pendingRequests = await SupervisorRequest.countDocuments({
        supervisor: teacherId,
        status: "Pending"
    });

    // Get assigned students (students who have this teacher as supervisor)
    const assignedStudents = await User.countDocuments({
        supervisor: teacherId,
        role: "Student"
    });

    // Get total projects supervised by this teacher
    const totalProjects = await Project.countDocuments({
        supervisor: teacherId
    });

    // Get completed projects
    const completedProjects = await Project.countDocuments({
        supervisor: teacherId,
        status: "Completed"
    });

    // Get pending projects
    const pendingProjects = await Project.countDocuments({
        supervisor: teacherId,
        status: "Pending"
    });

    // Get approved/active projects
    const activeProjects = await Project.countDocuments({
        supervisor: teacherId,
        status: "Approved"
    });

    // Get recent notifications (last 5)
    const recentNotifications = await Notification.find({
        recipient: teacherId
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("sender", "name");

    res.status(200).json({
        success: true,
        data: {
            pendingRequests,
            assignedStudents,
            totalProjects,
            completedProjects,
            pendingProjects,
            activeProjects,
            recentNotifications
        }
    });
});

export const getRequests = asyncHandler(async (req, res, next) => {

    // Get pending supervisor requests for this teacher
    const teacherId = req.user.id;

    const filter = {
        supervisor: teacherId,
        status: "Pending"
    };

    const { requests, totalRequests } = await requestServices.getAllRequests(filter);

    const updatedRequests = await Promise.all(requests.map(async (request) => {
        const requestData = request.toObject() || request;
        const student = await User.findById(request.student);
        requestData.student = student;

        // Fetch student's project to get approval status
        const project = await Project.findOne({ student: request.student });
        requestData.projectStatus = project ? project.status : null;

        return requestData;
    }));

    res.status(200).json({
        success: true,
        message: "Requests fetched successfully",
        data: updatedRequests,
        totalRequests
    });
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const teacherId = req.user.id;

    const request = await requestServices.acceptRequest(requestId, teacherId);

    if (!request) {
        return next(new ErrorHandler("Request not found or unauthorized", 404));
    }

    // Assign supervisor to student and update teacher's list
    await userServices.assignSupervisorDirectly(request.student._id, teacherId);

    // Update project supervisor
    const project = await Project.findOne({ student: request.student._id });
    if (project) {
        project.supervisor = teacherId;
        await project.save();
    }

    await notificationServices.notifyUser(
        request.student._id,
        `Your request to be supervised by this teacher has been accepted by ${req.user.name}.`,
        "Approval",
        project ? `/project/${project._id}` : "/students/status",
        "High"
    );

    // Use already populated student data
    const studentEmail = request.student.email;
    const message = generateRequestAcceptTemplate(req.user.name);
    await sendEmail({ email: studentEmail, subject: "FYP system - Your supervisor request has been accepted", html: message });

    res.status(200).json({
        success: true,
        message: "Request accepted successfully",
        data: request
    });
});


export const rejectRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const teacherId = req.user.id;

    const request = await requestServices.rejectRequest(requestId, teacherId);

    if (!request) {
        return next(new ErrorHandler("Request not found or unauthorized", 404));
    }


    await notificationServices.notifyUser(
        request.student._id,
        `Your request to be supervised by this teacher has been rejected by ${req.user.name}.`,
        "Rejection",
        "/students/status",
        "High"
    );

    // Use already populated student data
    const studentEmail = request.student.email;
    const message = generateRequestRejectTemplate(req.user.name);
    await sendEmail({ email: studentEmail, subject: "FYP system - Your supervisor request has been rejected", html: message });

    res.status(200).json({
        success: true,
        message: "Request rejected",
        data: request
    });
});

export const getAssignedStudents = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;
    // Find students where supervisor is the current teacher
    // Populate the project to show details. We assume a 1:1 or 1:N relationship where we just want the projects.

    const students = await User.find({ supervisor: teacherId })
        .populate("project")
        .select("-password")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Assigned students fetched successfully",
        data: students
    });
});

export const markComplete = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const teacherId = req.user.id;

    // We can use the service we just added, but we need to check authorization first
    const project = await Project.findById(projectId).populate("student");
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (project.supervisor.toString() !== teacherId) {
        return next(new ErrorHandler("Unauthorized to mark complete", 403));
    }



    project.status = "Completed";
    await project.save();

    await notificationServices.notifyUser(
        project.student._id,
        `Your project has been marked as complete by your supervisor ${req.user.name}.`,
        "General",
        `/project/${project._id}`,
        "Low"
    );

    res.status(200).json({
        success: true,
        data: project,
        message: "Project marked as complete successfully"
    });
});

export const addFeedback = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const teacherId = req.user._id;
    const { message, title, type, priority } = req.body;

    const project = await Project.findById(projectId).populate("student");
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (project.supervisor.toString() !== teacherId.toString()) {
        return next(new ErrorHandler("Unauthorized to add feedback", 403));
    }

    if (!message || !title || !type || !priority) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    const feedback = {
        supervisorId: teacherId,
        message,
        title,
        type,
        priority,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    project.feedback.push(feedback);
    await project.save();

    await notificationServices.notifyUser(
        project.student._id,
        `Your supervisor ${req.user.name} has added feedback to your project.`,
        "Feedback",
        `/project/${project._id}`,
        "Medium"
    );

    res.status(200).json({
        success: true,
        data: project,
        message: "Feedback added successfully"
    });
});


export const getTeacherFiles = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;

    const { projects, total } = await projectServices.getProjectsBySupervisor(teacherId);

    const allFiles = projects.flatMap((project) => {
        return project.files.map((file) => {
            const fileObj = file.toObject();
            return {
                ...fileObj,
                projectId: project._id,
                projectName: project.title,
                studentId: project.student._id,
                studentName: project.student.name,
                studentEmail: project.student.email,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }
        })
    })

    res.status(200).json({
        success: true,
        data: allFiles,
        total,
        message: "Files fetched successfully"
    });
});

export const downloadFile = asyncHandler(async (req, res, next) => {
    const { projectId, fileId } = req.params;
    const supervisorId = req.user._id;

    const project = await projectServices.getProjectById(projectId);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }
    if (!project.supervisor || project.supervisor._id.toString() !== supervisorId.toString()) {
        return next(new ErrorHandler("You are not authorized to download this file", 403));
    }

    const file = project.files.id(fileId);
    if (!file) {
        return next(new ErrorHandler("File not found", 404));
    }

    console.log("Download request for file:", file.originalName, "Path:", file.fileUrl);

    fileService.streamDownload(file.fileUrl, file.originalName, res);
})