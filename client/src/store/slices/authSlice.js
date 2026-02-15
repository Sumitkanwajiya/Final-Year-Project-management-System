import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const login = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data, {
      headers: { "Content-Type": "application/json" },

    });
    toast.success(res.data.message);
    return res.data.user;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    toast.error(errorMessage);
    return thunkAPI.rejectWithValue(errorMessage);
  }
})

export const register = createAsyncThunk("register", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success(res.data.message);
    return res.data.user;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    return thunkAPI.rejectWithValue(errorMessage);
  }
})

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/logout");
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Logout failed";
    toast.error(errorMessage);
    return thunkAPI.rejectWithValue(errorMessage);
  }
})

export const forgotPassword = createAsyncThunk("forgotPassword", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/forgot/password", data, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Request failed";
    toast.error(errorMessage);
    return thunkAPI.rejectWithValue(errorMessage);
  }
})

export const resetPassword = createAsyncThunk("resetPassword", async ({ token, password, confirmPassword }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/auth/reset/password/${token}`, { password, confirmPassword }, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Reset failed";
    toast.error(errorMessage);
    return thunkAPI.rejectWithValue(errorMessage);
  }
})

export const checkAuth = createAsyncThunk("checkAuth", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.user;
  } catch (error) {
    // Don't show toast error for checkAuth as it happens in background
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Not authenticated");
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoggingIn = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoggingIn = false;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isSigningUp = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isSigningUp = false;
      state.authUser = action.payload; // Assuming auto-login after register
    });
    builder.addCase(register.rejected, (state) => {
      state.isSigningUp = false;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.authUser = null;
    });

    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.isCheckingAuth = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isCheckingAuth = false;
      state.authUser = null;
    });
  },
});

export default authSlice.reducer;
