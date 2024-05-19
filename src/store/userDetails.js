
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  userImg: "",
  departments: [],
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      const { firstName, lastName, email, userImg, departments } =
      action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.userImg = userImg;
      if (departments) {
        state.departments = departments.map((dept) => ({
          departmentName: dept.departmentName,
          companyId: dept.companyId,
        }));
      } else {
        state.departments = []
      }
    },
    clearUserDetails: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
