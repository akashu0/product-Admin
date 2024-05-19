import React, { useRef, useState } from "react";
import { FaFilePdf, FaPlus } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PdfViewer from "../PdfViewer"; // Ensure this is the correct path to your PdfViewer component

function UploadSection({ onBack, onSubmit }) {
  // const documents = useSelector((state) => state.form.documents);
  const [files, setFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e, index) => {
    // console.log(e);
    const file = e.target.files[0];
    if (!file) return;

    const fileSize = file.size / 1024; // size in KB
    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    const isImage = allowedImageTypes.includes(file.type);
    const isPDF = file.type === "application/pdf";

    if (!isImage && !isPDF) {
      toast.error("Only PNG, JPEG, JPG, and PDF files are allowed.");
      return;
    }

    if ((isImage || isPDF) && fileSize > 300) {
      toast.error("File must be under 300KB.");
      return;
    }

    setFiles([...files, file]);
  };

  const handleDelete = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClosePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handleOnSubmit = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one valid file.");
      return;
    }

    onSubmit(files);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-28 w-full flex flex-col">
      <h1 className="text-lg sm:text-xl font-semibold text-blue-800">
        Upload Documents
      </h1>
      <p className="text-sm text-gray-500">Upload the required documents.</p>

      <div className="flex flex-wrap justify-center sm:justify-start -mx-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="p-2 w-full sm:w-52 h-44 relative border-2 border-dashed border-black rounded mt-5 flex flex-col justify-center items-center mx-2"
          >
            <label
              htmlFor={`fileUpload-${index}`}
              className="cursor-pointer text-center text-sm"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
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
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2"
              >
                <IoMdCloseCircleOutline className="text-xl" />
              </button>
            </label>
          </div>
        ))}
        {files.length < 4 && (
          <div className="p-2 w-full sm:w-52 h-44 border-2 border-dashed border-black rounded-md mt-5 flex flex-col justify-center items-center mx-2  cursor-pointer">
            <label
              htmlFor={`fileUpload-${files.length}`}
              className="cursor-pointer text-center text-sm"
            >
              <FaPlus className="text-4xl mx-2" />
              <span>Add New</span>
              <input
                id={`fileUpload-${files.length}`}
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
      {selectedPdf && (
        <PdfViewer file={selectedPdf} onClose={handleClosePdfViewer} />
      )}
      <div className="flex flex-col lg:flex-row justify-between items-stretch mt-6">
        <button
          className="px-8 py-2 bg-blue-900 font-santoshi text-white rounded hover:bg-blue-800 transition duration-300 mb-4 lg:mb-0"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-2 bg-blue-900 font-santoshi text-white rounded hover:bg-blue-800 transition duration-300"
          onClick={handleOnSubmit}
        >
          Save and Continue
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UploadSection;
