import * as yup from "yup";

// Define validation schema using Yup
export const formvalidationSchema = yup.object().shape({
  companyName: yup.string().trim().required("Company name is required"),
  registrationNumber: yup
    .string()
    .trim()
    .required("Registration number is required"),
  totalEmployees: yup.string().trim().required("Total employees is required"),
  OwnerName: yup.string().trim().required("Owner name is required"),
  yearOfEstablishment: yup
    .string()
    .trim()
    .required("Year of establishment is required"),
  businessType: yup.string().trim().required("Business type is required"),
});

export const contactInfo = yup.object().shape({
  companyEmail: yup.string().trim().required("Company email is required"),
  contactNumber: yup.string().trim().required("Contact Number is required"),
  address1: yup.string().trim().required("Address is required"),
  // country: yup.string().required("Country is required"),
  state: yup.string().trim().required("State is required"),
  city: yup.string().trim().required("City is required"),
  // pincode: yup.string().required("Postal Code is required"),
});
