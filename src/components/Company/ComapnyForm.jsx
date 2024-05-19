import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { formvalidationSchema } from "../../util/formvalidation";
import { updateFormData } from "../../store/formSlice";

function CompanyForm({ onSubmit }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formvalidationSchema),
  });

  const submitHandler = async (data, event) => {
    event.preventDefault();
    dispatch(updateFormData(data));
    onSubmit();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  return (
    <div className="px-4 sm:px-10 lg:px-28 w-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-lg sm:text-xl font-santoshi font-semibold text-blue-800">
          Company Details
        </h1>
        <p className="text-sm font-santoshi text-gray-500">
          Setup your business account by following information
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-wrap md:flex-row  w-full  relative"
      >
        {/* <div className="w-full sm:w-1/2 p-2"> */}
        <div className="flex flex-col mb-4 w-full md:w-1/2 px-2">
          <label className="mb-1 text-sm font-semibold">Company Name</label>
          <input
            type="text"
            placeholder="Enter your company name"
            {...register("companyName")}
            value={formData.companyName}
            onChange={(e) => {
              dispatch(updateFormData({ companyName: e.target.value }));
            }}
            className="input bg-white px-2 focus:outline-none  h-9 text-sm focus:ring-2 focus:ring-blue-600"
          />
          {!formData.companyName.length && errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName.message}</p>
          )}
        </div>

        <div className="flex flex-col mb-4 w-full md:w-1/2 px-2">
          <label className="mb-1 text-sm font-semibold">Owner Name</label>
          <input
            type="text"
            placeholder="Enter company owner name"
            {...register("OwnerName")}
            value={formData.OwnerName}
            onChange={(e) => {
              dispatch(updateFormData({ OwnerName: e.target.value }));
            }}
            className="input bg-white focus:outline-none px-3 h-9 text-sm focus:ring-2 focus:ring-blue-600"
          />
          {!formData.OwnerName.length && errors.OwnerName && (
            <p className="text-red-500 text-sm">{errors.OwnerName.message}</p>
          )}
        </div>

        <div className="flex flex-col mb-4 w-full md:w-1/2 px-2 ">
          <label className="mb-1 text-sm font-semibold">Total Employees</label>

          <select
            {...register("totalEmployees")}
            value={formData.totalEmployees}
            onChange={(e) => {
              dispatch(updateFormData({ totalEmployees: e.target.value }));
            }}
            className="input bg-white focus:outline-none px-3 h-9 text-sm focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select total employees</option>
            <option value="0-100">0-100</option>
            <option value="100-200">100-200</option>
            <option value="200-300">200-300</option>
            <option value="300+">300 and above</option>
          </select>
          {!formData.totalEmployees.length && errors.totalEmployees && (
            <p className="text-red-500 text-sm">
              {errors.totalEmployees.message}
            </p>
          )}
        </div>
        {/* </div> */}
        {/* <div className="w-full sm:w-1/2 p-2"> */}

        <div className="flex flex-col w-full mb-4 md:w-1/2 px-2">
          <label className="mb-1 text-sm font-semibold">
            Business Registration Number
          </label>

          <input
            type="text"
            placeholder="Enter your registration number"
            {...register("registrationNumber")}
            value={formData.registrationNumber}
            onChange={(e) => {
              dispatch(updateFormData({ registrationNumber: e.target.value }));
            }}
            className="input bg-white focus:outline-none px-3 h-9 text-sm focus:ring-2 focus:ring-blue-600"
          />
          {!formData.registrationNumber.length && errors.registrationNumber && (
            <p className="text-red-500 text-sm">
              {errors.registrationNumber.message}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full mb-4 md:w-1/2 px-2">
          <label className="mb-1 text-sm font-semibold">
            Year of Establishment
          </label>

          <select
            {...register("yearOfEstablishment")}
            value={formData.yearOfEstablishment}
            onChange={(e) => {
              dispatch(updateFormData({ yearOfEstablishment: e.target.value }));
            }}
            className="input bg-white focus:outline-none px-3 h-9 text-sm focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select Year of Establishment</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {!formData.yearOfEstablishment.length &&
            errors.yearOfEstablishment && (
              <p className="text-red-500 text-sm">
                {errors.yearOfEstablishment.message}
              </p>
            )}
        </div>
        <div className="flex flex-col mb-4 w-full md:w-1/2 px-2">
          <label className="mb-1 text-sm font-semibold">Business Type</label>
          <input
            type="text"
            placeholder="Enter business type"
            {...register("businessType")}
            value={formData.businessType}
            onChange={(e) => {
              dispatch(updateFormData({ businessType: e.target.value }));
            }}
            className="input bg-white focus:outline-none px-3 h-9 text-sm focus:ring-2 focus:ring-blue-600"
          />
          {!formData.businessType.length && errors.businessType && (
            <p className="text-red-500 text-sm">
              {errors.businessType.message}
            </p>
          )}
        </div>
        <div className="flex w-full justify-end items-end mt-4">
   
          <button
            type="submit"
            className="w-full md:w-40 py-2      bg-blue-900 text-white rounded hover:bg-blue-800 transition duration-300"
          >
            Save and Continue
          </button>
        </div>
        {/* </div> */}
      </form>
    </div>
  );
}

export default CompanyForm;
