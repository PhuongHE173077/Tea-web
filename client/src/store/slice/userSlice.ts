import axiosCustomize from "@/services/axios.customize";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

export const LoginUserAPIs = createAsyncThunk(
  "user/login",
  async (userData: any) => {
    const result = await axiosCustomize.post("/login", userData);
    return result.data
  }
);

export const fetchUserAPIs = createAsyncThunk(
  "user/fetchUser",
  async () => {
    const result = await axiosCustomize.get("/user/me");
    return result.data
  }
);

export const logoutUserAPIs = createAsyncThunk("user/logout", async () => {
  const result = await axiosCustomize.delete("/logout");
  return result.data
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUserAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(logoutUserAPIs.fulfilled, (state, action) => {
      state.currentUser = null;
    });
  },
});

export const selectCurrentUser = (state: any) => state.user.currentUser;

export const userReducer = userSlice.reducer;
