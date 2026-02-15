import User from "../models/user.js";

export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

export const updateUser = async (id, updateData) => {
    try {

        return await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).select("-password");
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

export const deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    await user.deleteOne();
};

export const getAllUsers = async () => {
    const query = { role: { $ne: "Admin" } };
    const users = await User.find(query).select("-password -resetPasswordToken -resetPasswordExpire").sort({ createdAt: -1 });

    return users;
};

export const assignSupervisorDirectly = async (studentId, supervisorId) => {
    try {
        const student = await User.findById(studentId);
        const supervisor = await User.findById(supervisorId);

        if (!student || !supervisor) {
            throw new Error("Student or Supervisor not found");
        }

        if (student.role.toLowerCase() !== "student") {
            throw new Error("User is not a student");
        }

        if (supervisor.role.toLowerCase() !== "teacher") {
            throw new Error("User is not a teacher");
        }

        if (!supervisor.hasCapacity()) {
            throw new Error("Supervisor has reached maximum capacity");
        }

        student.supervisor = supervisorId;
        supervisor.assignedStudents.push(studentId);
        await Promise.all([student.save(), supervisor.save()]);

        return { student, supervisor };
    } catch (error) {
        throw new Error(`Error assigning supervisor: ${error.message}`);
    }
};
