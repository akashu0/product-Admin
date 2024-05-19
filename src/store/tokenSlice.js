import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  role: "",
  userId: "",
  user: false,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userId = action.payload.id;
      state.user = true;
    },
    clearToken: (state, action) => {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.user = false;
    },
  },
});

export const { setToken, clearToken, setRole } = tokenSlice.actions;
export default tokenSlice.reducer;
