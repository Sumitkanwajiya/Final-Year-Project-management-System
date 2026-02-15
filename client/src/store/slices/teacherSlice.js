import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getTeacherDashboardStats = createAsyncThunk(
  "teacher/getDashboardStats",
  async () => {
    try {
      const response = await axiosInstance.get("/teacher/dashboard-stats");
      return response.data.data;
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
      throw error;
    }
  }
);


export const getRequests = createAsyncThunk(
  "teacher/getRequests",
  async () => {
    try {
      const response = await axiosInstance.get("/teacher/requests");
      return response.data.data;
    } catch (error) {
      toast.error("Failed to fetch requests");
      throw error;
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "teacher/acceptRequest",
  async (requestId) => {
    try {
      const response = await axiosInstance.put(`/teacher/requests/${requestId}/accept`);
      return response.data.data;
    } catch (error) {
      toast.error("Failed to accept request");
      throw error;
    }
  }
);

export const rejectRequest = createAsyncThunk(
  "teacher/rejectRequest",
  async (requestId) => {
    try {
      const response = await axiosInstance.put(`/teacher/requests/${requestId}/reject`);
      return response.data.data;
    } catch (error) {
      toast.error("Failed to reject request");
      throw error;
    }
  }
);




export const getAssignedStudents = createAsyncThunk(
  "teacher/getAssignedStudents",
  async () => {
    try {
      const response = await axiosInstance.get("/teacher/assigned-students");
      return response.data.data;
    } catch (error) {
      // toast.error("Failed to fetch assigned students");
      throw error;
    }
  }
);

export const addFeedback = createAsyncThunk(
  "teacher/addFeedback",
  async ({ projectId, feedback }) => {
    try {
      const response = await axiosInstance.post(`/teacher/projects/${projectId}/feedback`, feedback);
      toast.success("Feedback added successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add feedback");
      throw error;
    }
  }
);

export const markAsComplete = createAsyncThunk(
  "teacher/markAsComplete",
  async (projectId) => {
    try {
      const response = await axiosInstance.put(`/teacher/projects/${projectId}/complete`);
      toast.success("Project marked as completed");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark project as complete");
      throw error;
    }
  }
);

export const getProjectFiles = createAsyncThunk(
  "teacher/getProjectFiles",
  async () => {
    try {
      const response = await axiosInstance.get(`/teacher/files`);
      return response.data.data;
    } catch (error) {
      toast.error("Failed to fetch project files");
      throw error;
    }
  }
);

export const downloadFile = createAsyncThunk(
  "teacher/downloadFile",
  async ({ projectId, fileId, fileName }) => {
    try {
      const response = await axiosInstance.get(`/teacher/projects/${projectId}/files/${fileId}/download`, {
        responseType: 'blob',
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'download'); // Use provided fileName or default
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      toast.error("Failed to download file");
      throw error;
    }
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    assignedStudents: [],
    files: [],
    pendingRequests: [],
    dashboardStats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getTeacherDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(acceptRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          (request) => request._id !== action.payload._id
        );
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          (request) => request._id !== action.payload._id
        );
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAssignedStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssignedStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedStudents = action.payload;
      })
      .addCase(getAssignedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        state.assignedStudents = state.assignedStudents.map(student => {
          if (student.project && updatedProject && student.project._id === updatedProject._id) {
            return { ...student, project: updatedProject };
          }
          if (Array.isArray(student.project) && updatedProject) {
            const projectIndex = student.project.findIndex(p => p._id === updatedProject._id);
            if (projectIndex !== -1) {
              const newProjects = [...student.project];
              newProjects[projectIndex] = updatedProject;
              return { ...student, project: newProjects };
            }
          }
          return student;
        });
      })
      .addCase(markAsComplete.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        state.assignedStudents = state.assignedStudents.map(student => {
          if (student.project && updatedProject && student.project._id === updatedProject._id) {
            return { ...student, project: updatedProject };
          }
          if (Array.isArray(student.project) && updatedProject) {
            const projectIndex = student.project.findIndex(p => p._id === updatedProject._id);
            if (projectIndex !== -1) {
              const newProjects = [...student.project];
              newProjects[projectIndex] = updatedProject;
              return { ...student, project: newProjects };
            }
          }
          return student;
        });
      })
      .addCase(getProjectFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(getProjectFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false;
        // File downloaded successfully, no state update needed
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default teacherSlice.reducer;
