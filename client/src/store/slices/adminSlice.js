import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";


export const createStudent = createAsyncThunk(
  "createStudent",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/create-student", data);
      toast.success(res.data.message || "Student created sucessfully");
      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "failed to create Student"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)

export const updateStudent = createAsyncThunk(
  "updateStudent",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/update-student/${id}`, data);
      toast.success(res.data.message || "Student updated sucessfully");
      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update Student"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)

export const deleteStudent = createAsyncThunk(
  "deleteStudent",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/delete-student/${id}`);
      toast.success(res.data.message || "Student deleted sucessfully");
      return id;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete Student"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)

export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/admin/get-all-users`);
      toast.success(res.data.message || "Users fetched sucessfully");
      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch users"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)

export const createTeacher = createAsyncThunk(
  "createTeacher",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/create-teacher", data);
      toast.success(res.data.message || "Teacher created sucessfully");
      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "failed to create Teacher"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)

export const updateTeacher = createAsyncThunk(
  "updateTeacher",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/update-teacher/${id}`, data);
      toast.success(res.data.message || "Teacher updated sucessfully");
      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update Teacher"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)

export const deleteTeacher = createAsyncThunk(
  "deleteTeacher",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/delete-teacher/${id}`);
      toast.success(res.data.message || "Teacher deleted sucessfully");
      return id;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete Teacher"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)



export const getAllProjects = createAsyncThunk(
  "admin/getAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/get-all-projects");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch projects" });
    }
  }
);

export const approveProject = createAsyncThunk(
  "admin/approveProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/projects/${projectId}/approve`);
      toast.success("Project approved successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve project");
      return rejectWithValue(error.response?.data || { message: "Failed to approve project" });
    }
  }
);

export const rejectProject = createAsyncThunk(
  "admin/rejectProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/projects/${projectId}/reject`);
      toast.success("Project rejected successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject project");
      return rejectWithValue(error.response?.data || { message: "Failed to reject project" });
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/dashboard-stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch dashboard stats" });
    }
  }
);


export const assignSupervisor = createAsyncThunk(
  "admin/assignSupervisor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/assign-supervisor", data);
      toast.success("Supervisor assigned successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign supervisor");
      return rejectWithValue(error.response?.data || { message: "Failed to assign supervisor" });
    }
  }
);

// Get pending supervisor requests
export const getSupervisorRequests = createAsyncThunk(
  "admin/getSupervisorRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/supervisor-requests");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch supervisor requests");
      return rejectWithValue(error.response?.data || { message: "Failed to fetch supervisor requests" });
    }
  }
);

// Approve supervisor request
export const approveSupervisorRequest = createAsyncThunk(
  "admin/approveSupervisorRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/admin/approve-supervisor-request/${requestId}`);
      toast.success("Supervisor request approved successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
      return rejectWithValue(error.response?.data || { message: "Failed to approve request" });
    }
  }
);

// Reject supervisor request
export const rejectSupervisorRequest = createAsyncThunk(
  "admin/rejectSupervisorRequest",
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/admin/reject-supervisor-request/${requestId}`, { reason });
      toast.success("Supervisor request rejected");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
      return rejectWithValue(error.response?.data || { message: "Failed to reject request" });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    students: [],
    teachers: [],
    projects: [],
    users: [],
    stats: null,
    supervisorRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get All Users
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.students = action.payload.users.filter(user => user.role === "Student" || user.role === "student");
      state.teachers = action.payload.users.filter(user => user.role === "Teacher" || user.role === "teacher");
      state.admins = action.payload.users.filter(user => user.role === "Admin" || user.role === "admin");
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Student
    builder.addCase(createStudent.fulfilled, (state, action) => {
      state.students.push(action.payload);
      state.users.push(action.payload);
    });

    // Update Student
    builder.addCase(updateStudent.fulfilled, (state, action) => {
      state.students = state.students.map((student) =>
        student._id === action.payload._id ? action.payload : student
      );
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    });

    // Delete Student
    builder.addCase(deleteStudent.fulfilled, (state, action) => {
      state.students = state.students.filter((student) => student._id !== action.meta.arg);
      state.users = state.users.filter((user) => user._id !== action.meta.arg);
    });

    // Create Teacher
    builder.addCase(createTeacher.fulfilled, (state, action) => {
      state.teachers.push(action.payload);
      state.users.push(action.payload);
    });

    // Update Teacher
    builder.addCase(updateTeacher.fulfilled, (state, action) => {
      state.teachers = state.teachers.map((teacher) =>
        teacher._id === action.payload._id ? action.payload : teacher
      );
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    });

    // Delete Teacher
    builder.addCase(deleteTeacher.fulfilled, (state, action) => {
      state.teachers = state.teachers.filter((teacher) => teacher._id !== action.meta.arg);
      state.users = state.users.filter((user) => user._id !== action.meta.arg);
    });

    // Project Actions (from original file)
    builder.addCase(getAllProjects.fulfilled, (state, action) => {
      state.projects = action.payload.projects;
    });
    builder.addCase(approveProject.fulfilled, (state, action) => {
      state.projects = state.projects.map((project) =>
        project._id === action.payload.project._id ? action.payload.project : project
      );
    });
    builder.addCase(rejectProject.fulfilled, (state, action) => {
      state.projects = state.projects.map((project) =>
        project._id === action.payload.project._id ? action.payload.project : project
      );
    });
    builder.addCase(getDashboardStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    builder.addCase(assignSupervisor.fulfilled, (state, action) => {
      state.projects = state.projects.map((project) =>
        project._id === action.payload.project._id ? action.payload.project : project
      );
    });

    builder.addCase(assignSupervisor.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Get Supervisor Requests
    builder.addCase(getSupervisorRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSupervisorRequests.fulfilled, (state, action) => {
      state.loading = false;
      state.supervisorRequests = action.payload;
    });
    builder.addCase(getSupervisorRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Approve Supervisor Request
    builder.addCase(approveSupervisorRequest.fulfilled, (state, action) => {
      state.supervisorRequests = state.supervisorRequests.filter(
        req => req._id !== action.payload._id
      );
    });

    // Reject Supervisor Request
    builder.addCase(rejectSupervisorRequest.fulfilled, (state, action) => {
      state.supervisorRequests = state.supervisorRequests.filter(
        req => req._id !== action.payload._id
      );
    });



  },
});




export default adminSlice.reducer;
