import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    selected: null,
  },
  reducers: {},
  extraReducers: (builder) => { },
});


export const getProject = createAsyncThunk(
  "project/getProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/projects/${projectId}`, data);
      toast.success("Project updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadProjectFile = createAsyncThunk(
  "project/downloadProjectFile",
  async ({ projectId, fileId, fileName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/project/download/${projectId}/${fileId}`, {
        responseType: "blob",
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      toast.error("Failed to download file");
      return rejectWithValue(error.message);
    }
  }
);

export default projectSlice.reducer;
