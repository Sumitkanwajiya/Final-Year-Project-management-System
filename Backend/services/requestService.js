import SupervisorRequest from "../models/supervisorRequest.js";
import Project from "../models/project.js";

export const createRequest = async (requestData) => {
    const existingRequest = await SupervisorRequest.findOne({
        student: requestData.student,
        supervisor: requestData.supervisor,
        status: "Pending",
    });
    if (existingRequest) {
        throw new Error("You have already requested this supervisor. Please wait for the response.");
    }
    const request = new SupervisorRequest(requestData);
    await request.save();
    return request;
};

export const getAllRequests = async (filter) => {
    const requests = await SupervisorRequest.find(filter).populate("student", "name email");
    const totalRequests = requests.length;
    return { requests, totalRequests };
};

export const acceptRequest = async (requestId, teacherId) => {
    const request = await SupervisorRequest.findById(requestId).populate("student", "name email");
    if (!request) {
        throw new Error("Request not found");
    }
    if (request.status !== "Pending") {
        throw new Error("Request is not pending");
    }
    if (request.supervisor.toString() !== teacherId.toString()) {
        throw new Error("Unauthorized");
    }

    // Check if student has an approved project
    const approvedProject = await Project.findOne({
        student: request.student._id,
        status: "Approved"
    });

    if (!approvedProject) {
        throw new Error("Student must have an approved project before you can accept their supervisor request");
    }

    request.status = "Approved";
    await request.save();
    return request;
};

export const rejectRequest = async (requestId, teacherId) => {
    const request = await SupervisorRequest.findById(requestId).populate("student", "name email");
    if (!request) {
        throw new Error("Request not found");
    }
    if (request.status !== "Pending") {
        throw new Error("Request is not pending");
    }
    if (request.supervisor.toString() !== teacherId.toString()) {
        throw new Error("Unauthorized");
    }
    request.status = "Rejected";
    await request.save();
    return request;
};
