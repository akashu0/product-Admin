import React, { useState } from "react";
import CompanyForm from "./ComapnyForm";
import ContactInfo from "./ContactInfo";
import UploadSection from "./UploadSection";
import ConfirmPage from "./ConfirmPage";

function CompanyComponents() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [files, setFiles] = useState([]);

  const handleFormSubmit = (files) => {
    setFiles(files);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const steps = [
    {
      component: <CompanyForm onSubmit={handleFormSubmit} />,
      description: "Company Details",
    },
    {
      component: (
        <ContactInfo onSubmit={handleFormSubmit} onBack={handleBack} />
      ),
      description: "Contact Info",
    },
    {
      component: (
        <UploadSection onSubmit={handleFormSubmit} onBack={handleBack} />
      ),
      description: "Upload Documents",
    },
    { component: <ConfirmPage files={files} onBack={handleBack} />, description: "Confirm" },
  ];

  const StepIndicator = ({ step, index }) => {
    const isActive = index === currentIndex;
    const isCompleted = index <= currentIndex;

    return (
      <div
        key={index}
        className={`flex-1 mx-2 ${isActive ? "block" : "hidden sm:block"}`}
      >
        <div
          className={`rounded-full h-2 mb-2  ${
            isActive
              ? "bg-blue-900"
              : isCompleted
              ? "bg-blue-900"
              : "bg-gray-400"
          }`}
        ></div>
        <div className="text-left">
          <span
            className={`block text-xs font-semibold font-santoshi ${
              isActive
                ? "text-blue-900"
                : isCompleted
                ? "text-blue-900"
                : "text-gray-400"
            }`}
          >
            STEP {index + 1}
          </span>
          <span
            className={`block text-sm font-semibold font-santoshi ${
              isActive
                ? "text-blue-900"
                : isCompleted
                ? "text-blue-900"
                : "text-gray-400"
            }`}
          >
            {step.description}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen  w-full pt-16 bg-blue-50">
      <div className="text-center py-3">
        <span className="text-2xl font-santoshi text-blue-900 font-bold ">
          Welcome to Prolio
        </span>
        <span className="text-lg text-gray-600 font-santoshi py-2 block">
          Let's set up your business account
        </span>
        <div className="flex justify-center sm:justify-between items-center px-4 sm:px-20 py-3 rounded-md">
          {steps.map((step, index) => (
            <StepIndicator step={step} index={index} key={index} />
          ))}
        </div>
      </div>
      {steps[currentIndex].component}
    </div>
  );
}

export default CompanyComponents;
