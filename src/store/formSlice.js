// formSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    companyName: "",
    registrationNumber: "",
    totalEmployees: "",
    OwnerName: "",
    yearOfEstablishment: "",
    businessType: "",
  },
  contactInfo: {
    companyEmail: "",
    contactNumber: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    resetFormState: (state) => initialState,
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateContactInfo: (state, action) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
  },
});

export const { updateFormData, updateContactInfo, resetFormState } =
  formSlice.actions;
export default formSlice.reducer;
