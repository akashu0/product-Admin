import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IoMdCloseCircleOutline } from "react-icons/io";

const PdfViewer = ({ file, onClose }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();

  if (!file) return null;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goPrevPage = () => {
    setPageNumber((prevPageNumber) =>
      prevPageNumber > 1 ? prevPageNumber - 1 : 1
    );
  };

  const goNextPage = () => {
    setPageNumber((prevPageNumber) =>
      prevPageNumber < numPages ? prevPageNumber + 1 : numPages
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-5xl max-h-5xl bg-white p-5 overflow-auto">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-2xl transform hover:scale-110 ease-out duration-300"
        >
          <IoMdCloseCircleOutline />
        </button>
        <div className="flex justify-center items-center h-full">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-full h-full flex flex-col justify-center items-center gap-10 overflow-y-hidden"
          >
            <Page
              pageNumber={pageNumber}
              className="shadow-xl overflow-y-auto"
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
        {numPages > 1 && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center">
            <button
              onClick={goPrevPage}
              className="mr-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
            >
              Previous
            </button>
            <p className="text-lg">
              Page {pageNumber} of {numPages}
            </p>
            <button
              onClick={goNextPage}
              className="ml-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
