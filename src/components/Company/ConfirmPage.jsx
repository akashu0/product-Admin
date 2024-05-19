import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  resetFormState,
  updateContactInfo,
  updateFormData,
} from "../../store/formSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PdfViewer from "../PdfViewer";
import { FaFilePdf } from "react-icons/fa";

function ConfirmPage({ onBack, files: initialFiles }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token.token);
  const apiURL = process.env.REACT_APP_API_URL;
  const formData = useSelector((state) => state.form.formData);
  const contactData = useSelector((state) => state.form.contactInfo);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const [files, setFiles] = useState(initialFiles);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleDeleteFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleClosePdfViewer = () => {
    setSelectedPdf(null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload at least one valid file.");
      return;
    }
    const Data = new FormData();

    Data.append("formData", JSON.stringify(formData));
    Data.append("contactData", JSON.stringify(contactData));

    files.forEach((file, index) => {
      Data.append(`documents`, file);
    });
    try {
      const response = await axios.post(
        `${apiURL}/admin/createNewCompany`,
        Data,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Company Registered Successfully");
        dispatch(resetFormState());
        setTimeout(() => {
          navigate("/");

        },1000)
      }
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-2">
      <div className="w-full max-w-6xl bg-white rounded-xl overflow-auto shadow-lg p-5 space-y-5">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompanyDetails
            formData={formData}
            isEditing={isEditing}
            toggleEdit={() => setIsEditing(!isEditing)}
          />
          <ContactDetails
            contactData={contactData}
            isEditing={isEditingContact}
            toggleEdit={() => setIsEditingContact(!isEditingContact)}
          />
        </div>
        <Documents
          closePdf={handleClosePdfViewer}
          selectedPdf={selectedPdf}
          setSelectedPdf={setSelectedPdf}
          files={files}
          onDeleteFile={handleDeleteFile}
        />
        <ActionButtons onBack={onBack} onSubmit={submitHandler} />
        <ToastContainer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-left font-semibold text-blue-900">
      <h1 className="text-2xl">Confirm Details</h1>
      <p className="text-sm text-gray-500">Please confirm your details below</p>
    </div>
  );
}

function CompanyDetails({ formData, isEditing, toggleEdit }) {
  const dispatch = useDispatch();
  const handleChange = (e, field) => {
    dispatch(updateFormData({ ...formData, [field]: e.target.value }));
  };

  return (
    <DetailSection
      title="Company Details"
      data={formData}
      isEditing={isEditing}
      handleChange={handleChange}
      toggleEdit={toggleEdit}
    />
  );
}

function ContactDetails({ contactData, isEditing, toggleEdit }) {
  const dispatch = useDispatch();
  const handleChange = (e, field) => {
    dispatch(updateContactInfo({ ...contactData, [field]: e.target.value }));
  };

  return (
    <DetailSection
      title="Contact Details"
      data={contactData}
      isEditing={isEditing}
      handleChange={handleChange}
      toggleEdit={toggleEdit}
    />
  );
}

function DetailSection({ title, data, isEditing, handleChange, toggleEdit }) {
  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-santoshi text-gray-600 font-semibold">
          {title}
        </h2>
        <button
          onClick={toggleEdit}
          className={`px-4 py-2 rounded font-santoshi font-semibold ${
            isEditing ? "bg-blue-900 text-white" : "bg-blue-200 text-blue-900 "
          } `}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      {isEditing ? (
        <EditingForm data={data} handleChange={handleChange} />
      ) : (
        <DisplayData data={data} />
      )}
    </div>
  );
}

function Documents({
  closePdf,
  selectedPdf,
  setSelectedPdf,
  onDeleteFile,
  files,
}) {
  const handleDelete = (index) => {
    onDeleteFile(index);
    // dispatch(removeDocument(index));
  };

  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">Documents Uploaded</h2>
      <div className="flex overflow-x-auto gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <IoMdCloseCircleOutline
              className="absolute right-0 top-0  cursor-pointer text-xl text-blue-900 hover:text-red-500 transform hover:scale-110 ease-out duration-300"
              onClick={() => handleDelete(index)}
            />
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)} // Corrected
                alt={`Document ${index}`}
                className="w-32 h-32 object-contain"
              />
            ) : (
              <button
                onClick={() => setSelectedPdf(URL.createObjectURL(file))}
                className="flex flex-col items-center justify-center"
              >
                <FaFilePdf className="text-red-500 mb-2" size="3em" />
                <span>View PDF</span>
              </button>
            )}
          </div>
        ))}
        {selectedPdf && (
          <PdfViewer
            file={`data:application/pdf;base64,${selectedPdf.split(",")[1]}`}
            onClose={closePdf}
          />
        )}
      </div>
    </div>
  );
}

function EditingForm({ data, handleChange }) {
  return (
    <div>
      {Object.entries(data).map(([key, value], index) => (
        <div key={index} className="flex items-center space-x-3 my-2">
          <label className="w-1/3 font-semibold capitalize">
            {key.replaceAll("_", " ")}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e, key)}
            className="flex-1 p-2 border rounded"
          />
        </div>
      ))}
    </div>
  );
}

function DisplayData({ data }) {
  return (
    <div>
      {Object.entries(data).map(([key, value], index) => (
        <div
          key={index}
          className="flex justify-between items-center space-x-3 my-2"
        >
          <label className="w-1/3 font-semibold font-santoshi text-gray-500 capitalize">
            {key.replaceAll("_", " ")}
          </label>
          <span className="font-santoshi">{value}</span>
        </div>
      ))}
    </div>
  );
}

function ActionButtons({ onBack, onSubmit }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row justify-between items-stretch mt-4">
      <button
        onClick={onBack}
        className="px-4 py-2 border font-santoshi border-gray-400 hover:bg-blue-100 rounded"
      >
        Back
      </button>
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-700 font-santoshi text-white rounded hover:bg-blue-800"
      >
        Submit
      </button>
    </div>
  );
}

export default ConfirmPage;
