import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getAllDeadlines = createAsyncThunk(
  "deadline/getAllDeadlines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/deadline/get-all-deadlines");
      return response.data.deadlines;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch deadlines");
    }
  }
);

export const createDeadline = createAsyncThunk(
  "deadline/createDeadline",
  async ({ id, ...deadlineData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/deadline/create-deadline/${id}`, deadlineData);
      toast.success("Deadline created successfully");
      return response.data.deadline; // Backend returns { success: true, message: "...", deadline: {...} }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create deadline");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const deadlineSlice = createSlice({
  name: "deadline",
  initialState: {
    deadlines: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDeadlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeadlines.fulfilled, (state, action) => {
        state.loading = false;
        state.deadlines = action.payload;
      })
      .addCase(getAllDeadlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDeadline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeadline.fulfilled, (state, action) => {
        state.loading = false;
        state.deadlines.push(action.payload);
      })
      .addCase(createDeadline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deadlineSlice.reducer;
