import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/notification");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/notification/markAsRead/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to mark as read");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.put("/notification/markAllAsRead");
      toast.success("All notifications marked as read");
      // After making all read, re-fetch to update counts correctly or rely on backend return
      // Ideally backend returns updated list, but if not we might need to fetch. 
      // Based on previous code, backend returns success message. Let's assume we re-fetch helps or we manually update state.
      // Actually the user's controller for markAllAsRead returns just a message.
      // So we should re-fetch notifications to be safe and update UI.
      thunkAPI.dispatch(getNotifications());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to mark all as read");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/notification/deleteNotification/${id}`);
      toast.success("Notification deleted");
      // Re-fetch to sync state perfectly
      thunkAPI.dispatch(getNotifications());
      return response.data; // Note: verify if backend returns the deleted item or updated list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete notification");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    unreadCount: 0,
    readCount: 0,
    highPriorityMessages: 0,
    thisWeekNotifications: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || {};
        state.list = data.notifications || [];
        state.unreadCount = data.unreadOnly || 0;
        state.readCount = data.readOnly || 0;
        state.highPriorityMessages = data.highPriority || 0;
        state.thisWeekNotifications = data.thisWeekNotifications || 0;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Individual mark read - usually returns updated notification or list
      // User's controller returns { data: { notification } }
      .addCase(markAsRead.fulfilled, (state, action) => {
        // Optimistically update the list if we have the updated notification
        const updatedNotification = action.payload?.data?.notification;
        if (updatedNotification) {
          const index = state.list.findIndex(n => n._id === updatedNotification._id);
          if (index !== -1) {
            state.list[index] = updatedNotification;
            // Recalculate counts locally
            state.unreadCount = Math.max(0, state.unreadCount - 1);
            state.readCount += 1;
          }
        }
      })

      .addCase(markAllAsRead.fulfilled, (state) => {
        // If we dispatch getNotifications, that will handle the update.
        // But purely locally:
        // state.list.forEach(n => n.isRead = true);
        // state.unreadCount = 0;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        // Handled by re-fetch mostly, but can do optimistic filtering
        // User controller returns { data: { notification } } (the deleted one)
      });
  },
});

export default notificationSlice.reducer;
