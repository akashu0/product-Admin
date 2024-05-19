import * as yup from "yup";

export const userRegisterValidationSchema = yup.object().shape({
  firstname: yup
    .string()
    .required("Name is required")
    .trim()
    .matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/, "Enter a valid name"),
  lastname: yup
    .string()
    .required("Name is required")
    .trim()
    .matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/, "Enter a valid name"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: yup
    .string()
    .trim()
    .required("Re-enter the password to confirm ")
    .oneOf([yup.ref("password")], "Password does not match"),
});

export const userLoginValidationSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password must be at least 6 character long"),
});

export const oppertunityForm = yup.object().shape({
  firstName: yup
    .string()
    .required("Name is required")
    .trim()
    .matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/, "Enter a valid name"),
  lastName: yup
    .string()
    .trim()
    .required("Name is required")
    .matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/, "Enter a valid name"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email"),
  mobileNumber: yup.string().trim().required("Contact number is required"),
  address: yup.string().trim().required("Address is required "),
  yearsOfExperience: yup.string().trim().required("Experience is required"),
  productsDealtWith: yup.string().trim().required("Product Deal with required"),
});
