import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { updateContactInfo } from "../../store/formSlice";
import { contactInfo } from "../../util/formvalidation";

// Hardcoded data for Indian states and their cities

function ContactInfo({ onBack, onSubmit }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.contactInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    resolver: yupResolver(contactInfo),
  });

  const submitHandler = (formData) => {
    dispatch(updateContactInfo(formData));
    onSubmit();
  };

  return (
    <div className="px-4 sm:px-8 lg:px-28 w-full flex flex-col">
      <h1 className="text-lg sm:text-xl font-semibold text-blue-800">
        Contact Details
      </h1>
      <p className="text-sm text-gray-500">Enter your contact details</p>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mt-5 w-full grid  md:grid-flow-row md:grid-cols-2 gap-x-2 "
      >
        <FormField
          label="Company Email Address"
          error={errors.companyEmail?.message}
        >
          <input
            type="email"
            placeholder="Enter your company email"
            {...register("companyEmail")}
            className="input bg-white focus:outline-none w-full px-3 h-9 font-santoshi text-sm focus:ring-2 focus:ring-blue-600"
          />
        </FormField>

        <FormField label="Contact Number" error={errors.contactNumber?.message}>
          <input
            type="text"
            placeholder="Enter contact number"
            {...register("contactNumber")}
            className="input bg-white focus:outline-none w-full px-3 h-9 font-santoshi text-sm focus:ring-2 focus:ring-blue-600"
          />
        </FormField>
        <FormField label="Address Line 1" error={errors.address1?.message}>
          <input
            type="text"
            placeholder="Address line 1"
            {...register("address1")}
            className="input bg-white focus:outline-none w-full px-3 h-9 font-santoshi text-sm focus:ring-2 focus:ring-blue-600"
          />
        </FormField>
        <FormField label="Address Line 2" error={errors.address2?.message}>
          <input
            type="text"
            placeholder="Address line 2"
            {...register("address2")}
            className="input bg-white focus:outline-none w-full px-3 h-9 font-santoshi text-sm focus:ring-2 focus:ring-blue-600"
          />
        </FormField>
        <FormField label="State" error={errors.state?.message}>
          <input
            {...register("state")}
            placeholder="Enter state"
            className="input bg-white focus:outline-none w-full px-3 h-9 font-santoshi text-sm focus:ring-2 focus:ring-blue-600"
          />
        </FormField>

      
       
        <FormField label="City" error={errors.city?.message}>
          <input
            {...register("city")}
            placeholder="Enter city"
            className="input bg-white focus:outline-none w-full px-3 h-9 font-santoshi text-sm focus:ring-2 focus:ring-blue-600"
          />
        </FormField>

        {/* <div className="flex flex-col lg:flex-row justify-between items-stretch mt-4"> */}
        <div className="w-full ">
          <button
            className=" w-full md:w-44  py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition duration-300 mb-4 lg:mb-0"
            onClick={onBack}
          >
            Back
          </button>
        </div>
        <div className="w-full  flex justify-end items-end">
          <button
            type="submit"
            className="w-full md:w-44 px-1 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition duration-300"
          >
            Save and Continue
          </button>
        </div>
        {/* </div> */}
      </form>
    </div>
  );
}

function FormField({ label, children, error }) {
  return (
    <div className="w-full mb-4 ">
      <label className="mb-1 text-sm font-semibold font-santoshi text-gray-600">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default ContactInfo;
