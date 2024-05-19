import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Pricing from "./Pricing";
import ProductDetails from "./ProductDetails";
import B2BDetails from "./B2BDetails";
import Confirm from "./Confirm";
import Social from "./Social";

function AddProduct() {
  const token = useSelector((state) => state.token.token);
  const apiURL = process.env.REACT_APP_API_URL;
  const [type, setType] = useState([]);
  const [questions, setQuestions] = useState();
  const [categoryName, setCategoryName] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/category/getAllCategory-types`
        );
        setType(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/category/getCategory-Names/${selectedProductType}`
        );
        setCategoryName(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    if (selectedProductType) {
      fetchData();
    }
  }, [selectedProductType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/category/getSubCategory-Names/${selectedProductType}/${selectedCategoryName}`
        );
        const data = response.data?.subCategoryNames;
        const questions = response.data?.questions;
        setSubCategoryName(data);
        setQuestions(questions);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    if (selectedCategoryName && selectedProductType) {
      fetchData();
    }
  }, [selectedProductType, selectedCategoryName]);

  const handleProductTypeChange = (productId) => {
    setSelectedProductType(productId);
    setSelectedCategoryName("");
    setSelectedSubCategoryName("");
    setCategoryName([]);
    setSubCategoryName([]);
  };

  const handleFormSubmit = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const steps = [
    {
      component: (
        <ProductDetails onSubmit={handleFormSubmit} questions={questions} selectedProductType={selectedProductType} currentIndex={currentIndex}/>
      ),
      description: "Product Details",
    },
    {
      component: <Pricing onSubmit={handleFormSubmit} onBack={handleBack} />,
      description: "Pricing",
    },
    {
      component: <B2BDetails onSubmit={handleFormSubmit} onBack={handleBack} />,
      description: "B2B Details",
    },
    {
      component: <Social onSubmit={handleFormSubmit} onBack={handleBack} />,
      description: "B2B Details",
    },
    {
      component: <Confirm onBack={handleBack} />,
      description: "Confirm",
    },
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
    <div className="w-full bg-blue-50 pt-20 px-5 pb-10 min-h-screen">
      <div className="flex w-4/5 justify-center items-center bg-white rounded-2xl py-8 mx-auto">
        <div className="w-4/5 bg-white">
          <div className=" bg-white rounded-xl">
            <h3 className="text-lg font-semibold mb-2 bg-white font-santoshi">
              Select Type
            </h3>
            <div className="flex flex-col md:flex-row md:space-x-16 bg-white">
              {type.map((product, index) => (
                <label
                  key={index}
                  className="inline-flex items-center bg-white"
                >
                  <input
                    type="radio"
                    className="form-radio text-blue-500 bg-white cursor-pointer"
                    name="radio-option"
                    value={product?._id}
                    onClick={() => handleProductTypeChange(product?._id)}
                  />
                  <span className="ml-2 bg-white capitalize">
                    {product?._id}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white flex space-x-4">
            <div className="flex-1 bg-white">
              <label className="block font-semibold text-sm mb-1 bg-white capitalize">
                {selectedProductType} Category
              </label>
              <select
                className="w-full h-9 text-sm px-3 mt-1 focus:outline-none border border-gray-300 rounded-md bg-white"
                value={selectedCategoryName}
                onChange={(e) => setSelectedCategoryName(e.target.value)}
              >
                <option value="">Select Category</option>
                {categoryName.map((item, index) => (
                  <option key={index} value={item.category}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 bg-white">
              <label className="block font-semibold text-sm mb-1 bg-white capitalize">
                {selectedProductType} Subcategory
              </label>
              <select
                className="w-full h-9 text-sm px-3 mt-1 focus:outline-none border border-gray-300 rounded-md bg-white"
                value={selectedSubCategoryName}
                onChange={(e) => setSelectedSubCategoryName(e.target.value)}
              >
                <option value="">Select Subcategory</option>
                {subCategoryName.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {questions && selectedSubCategoryName ? (
        <>
          <div className="flex justify-between items-center mt-5 md:mx-20  bg-transparent rounded-md flex-wrap">
            {steps.map((step, index) => (
              <StepIndicator step={step} index={index} key={index} />
            ))}
          </div>
          
            {steps[currentIndex].component}
        </>
      ) : null}

      <ToastContainer />
    </div>
  );
}

export default AddProduct;
