import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa6";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

function ProductAddingPage() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token.token);
  const apiURL = process.env.REACT_APP_API_URL;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [type, setType] = useState();
  const [questions, setQuestions] = useState();
  const [selectedProductType, setSelectedProductType] = useState();
  const [categoryName, setCategoryName] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState([]);
  const [selectedsubCategoryName, setSelectedSubCategoryName] = useState();
  const [images, setImages] = useState([]);
  const [name, setName] = useState();
  const [brandName, setBrandName] = useState();
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleImageChanges = (e, index) => {
    if (images.length > 3) {
      toast.info("Only 4 Images is allowed");
      return;
    }

    const file = e.target.files[0];

    if (file) {
      const fileSize = file.size / 1024; // in KB
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      const fileType = file.type;

      if (fileSize <= 300 && allowedTypes.includes(fileType)) {
        setImages((prevImages) => [...prevImages, file]);

        if (fileUploadRef.current) {
          fileUploadRef.current.value = "";
        }
      } else {
        if (fileSize > 300) {
          toast.error("File size exceeds 300KB limit.");
        }
        if (!allowedTypes.includes(fileType)) {
          toast.error(
            "File type not supported. Please upload a PNG, JPEG, or JPG image."
          );
        }
      }
    }
  };

  const handleCloseVerify = () => {
    setShowVerifyModal(false);
  };

  const handleOnClickVerify = () => {
    setShowVerifyModal(true);
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/category/getAllCategory-types`
      );
      // console.log(response.data, "data");
      setType(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/category/getCategory-Names/${selectedProductType}`
        );
        const data = response.data;
        setCategoryName(data);
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

  const handleAddAttribute = (questionId) => {
    const currentStep = questions.steps[currentIndex]; // Assuming currentIndex is your current step index
    const question = currentStep.questions.find((q) => q.id === questionId);

    if (question) {
      const newAttribute = { name: "", value: "" };
      question.attributes.push(newAttribute);

      setQuestions({ ...questions });
    }
  };

  const handleInputChange = (e, questionId, fieldType, fieldIndex = null) => {
    const value = e.target.value;
    // console.log(value, "typezzz");
    console.log(questionId);

    const currentStep = questions.steps[currentIndex];
    const question = currentStep.questions.find((q) => q.id === questionId);
    console.log(question, "ffffffffffffff");
    if (question) {
      console.log(fieldType, "asdnhjisanjcbn");

      if (fieldType === "text" || fieldType === "textarea") {
        question.value = value;
      } else if (fieldType === "radio") {
        question.value = value;
      } else if (fieldType === "select") {
        question.value = value;
      } else if (fieldType === "number") {
        question.value = parseFloat(value);
      } else if (fieldType === "attributes") {
        if (e.target.name === `attribute_${fieldIndex}`) {
          question.attributes[fieldIndex].name = value;
        } else if (e.target.name === `attribute_value_${fieldIndex}`) {
          question.attributes[fieldIndex].value = value;
        }
      } else if (fieldType === "file") {
        console.log("entered file");
        handleImageChange(e, question, fieldIndex);
      } else if (
        fieldType === "card" &&
        question.cards &&
        fieldIndex !== null
      ) {
        // Find the card by index
        const card = question.cards[fieldIndex];

        if (card) {
          if (card.type === "text") {
            card.value = value; // Update text value
          } else if (card.type === "select") {
            card.value = value; // Update select value
          } else if (card.type === "number") {
            card.value = value;
          }
        }
      }
      setQuestions({ ...questions });
    }
    console.log(questions, "updated");
  };

  const fileUploadRef = useRef(null);

  // To add images
  const handleImageChange = (e, question) => {
    console.log("entered Image");

    const files = e.target.files[0];

    if (files) {
      // Check file size and type
      const fileSize = files.size / 1024; // in KB
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      const fileType = files.type;

      if (fileUploadRef.current) {
        fileUploadRef.current.value = "";
      }

      if (fileSize <= 300 && allowedTypes.includes(fileType)) {
        // Add the file to the question.images array
        if (question.images.length < 4) {
          question.images.push({ files });
        }
      } else {
        if (fileSize > 300) {
          toast.error("File size exceeds 300KB limit.", {
            className: "bg-white",
          });
        }
        if (!allowedTypes.includes(fileType)) {
          toast.error(
            "File type not supported. Please upload a PNG, JPEG, or JPG image."
          );
        }
      }

      setQuestions({ ...questions });
    }
  };

  // Remove Images
  const handleRemoveImages = (index) => {
    const updatedFiles = [...images];
    updatedFiles.splice(index, 1);
    setImages(updatedFiles);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  const handleRemoveImage = (questionId, index) => {
    const updatedQuestions = { ...questions };
    const currentStep = updatedQuestions.steps[currentIndex];
    const question = currentStep.questions.find((q) => q.id === questionId);
    if (question && Array.isArray(question.images)) {
      question.images.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };
  const handleSubmit = async () => {
    try {
      const formData = {
        type: selectedProductType,
        category: selectedCategoryName,
        subcategories: selectedsubCategoryName,
        questions: questions,
      };
      console.log(formData);
      const response = await axios.post(
        `${apiURL}/product/create-product`,
        { formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/admin/products");
      }, 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error submitting form:", error);
    }
  };

  const handleNext = () => {
    // const data = questions?.steps[currentIndex]?.questions
    //   .filter((question) => question.status)
    //   .map((question) => question.description);

    // console.log(data, "sdvvddjhs");
    // console.log(formData, "formData");

    // const isDescriptionPresent = data.every((description) =>
    //   formData.hasOwnProperty(description)
    // );

    // console.log(isDescriptionPresent);

    // if (!isDescriptionPresent) {
    //   toast.error("Please fill all the fields before proceeding.");
    //   return;
    // }
    setCurrentIndex((prev) => prev + 1);
  };

  // .........................Variants....................................................................

  const [formData, setFormData] = useState({});

  const handleFormData = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const fileList = Array.from(files); // Convert FileList to Array
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      // Filter files by size and type
      const filteredFiles = fileList.filter((file) => {
        const fileSize = file.size / 1024; // in KB
        const fileType = file.type;
        return fileSize <= 300 && allowedTypes.includes(fileType);
      });

      fileUploadRef.current.value = "";

      if (filteredFiles.length === 0) {
        toast.error(
          "Please upload PNG, JPEG, or JPG images with size less than 300KB."
        );
        return;
      }
      setFormData((prevState) => ({
        ...prevState,
        [name]: [...(prevState[name] || []), ...filteredFiles],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    console.log(formData, "Formdata");
  }, [formData]);
  const handleVariant = (e, questionId, questionType, cardIndex) => {
    handleInputChange(e, questionId, questionType, cardIndex);
    // handleFormData(e);
  };

  

  return (
    <>
      <div className="w-full bg-blue-50 pt-20 px-5 pb-10 min-h-screen">
        <div className="flex w-4/5 justify-center items-center bg-white rounded-2xl py-8 mx-auto">
          <div className="w-4/5 bg-white ">
            <div className=" bg-white rounded-xl">
              <h3 className="text-lg font-semibold mb-2 bg-white font-santoshi">
                Select Type
              </h3>
              <div className="flex flex-col md:flex-row md:space-x-16 bg-white">
                {type?.map((product, index) => (
                  <label
                    key={index}
                    className="inline-flex  items-center bg-white"
                  >
                    <input
                      type="radio"
                      className="form-radio text-blue-500 bg-white cursor-pointer"
                      name="radio-option"
                      value={product?._id}
                      onClick={() => {
                        setSelectedProductType(product?._id);
                        setSelectedCategoryName("");
                        setCategoryName([]);
                        setSubCategoryName([]);
                        setQuestions();
                        setSelectedSubCategoryName();
                      }}
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
                  onChange={(e) => {
                    setSelectedCategoryName(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setSelectedSubCategoryName(e.target.value);
                  }}
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

        {questions && selectedsubCategoryName ? (
          <>
            <div className="flex justify-between items-center mt-5   bg-transparent rounded-md flex-wrap">
              {questions?.steps?.map((item, index) => (
                <div
                  key={index}
                  className={`flex-1 bg-transparent m-5 md:mx-10 text-start ${
                    index > 0 ? "hidden md:block" : ""
                  }`}
                >
                  <div
                    className={`rounded-full  h-2 mb-2 ${
                      index === currentIndex
                        ? "bg-blue-900"
                        : index < currentIndex
                        ? "bg-blue-900"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`h-2 mb-2 block text-xs bg-transparent font-semibold font-santoshi ${
                      index === currentIndex || index < currentIndex
                        ? "text-blue-900"
                        : "text-gray-600"
                    }`}
                  >
                    STEP {index + 1}
                  </span>
                  <span
                    className={`block text-xs bg-transparent font-semibold font-santoshi  ${
                      index === currentIndex || index < currentIndex
                        ? "text-blue-900"
                        : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {currentIndex === 0 && (
              <>
                <div className="flex flex-col  p-7 items-start  md:m-10 mt-5 bg-white rounded-lg shadow-lg flex-wrap">
                  <label className="bg-transparent flex flex-col capitalize font-santoshi font-semibold text-lg">
                    {`${selectedProductType}`} Image
                    <span className="text-sm text-gray-500 font-santoshi capitalize">
                      {" "}
                      Add {`${selectedProductType}`} Images here
                    </span>
                  </label>

                  <div
                    className={`flex flex-wrap ${
                      currentIndex === 0
                        ? "flex-col-2 md:flex-row gap-2 justify-center"
                        : ""
                    }`}
                  >
                    {images?.map((file, index) => (
                      <div
                        key={index}
                        className="flex  justify-center  z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 items-center  bg-white"
                      >
                        {file.type && file.type.startsWith("image/") ? (
                          <div className="relative w-full h-full p-1  items-center bg-transparent">
                            <div
                              className="absolute top-0 right-0 mx-1 cursor-pointer bg-transparent text-red-700"
                              onClick={() => handleRemoveImages(index)}
                            >
                              <AiFillCloseCircle className="text-2xl bg-transparent" />
                            </div>

                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Uploaded Image ${index + 1}`}
                              className="w-28 h-28 rounded-2xl items-center object-cover bg-transparent"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center bg-transparent items-center">
                            <label
                              htmlFor={`file-upload-${index}`}
                              className="cursor-pointer bg-transparent"
                            >
                              <h6 className="bg-white text-xs m-4 pt-3 text-center font-semibold">
                                Add <br /> Image or video
                              </h6>
                              <input
                                id={`file-upload-${index}`}
                                type="file"
                                style={{ display: "none" }}
                                name={`${selectedProductType}` + "Image"}
                                ref={fileUploadRef}
                                onChange={(e) => handleImageChanges(e, index)}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="items-center px-5  bg-transparent flex flex-col justify-center  z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 m-1 bg-white ">
                      <label
                        htmlFor={`file-upload-${images.length}`}
                        className="cursor-pointer bg-transparent"
                      >
                        <FaPlus className="bg-transparent text-3xl   cursor-pointer" />
                        <input
                          id={`file-upload-${images.length}`}
                          type="file"
                          style={{ display: "none" }}
                          ref={fileUploadRef}
                          accept="image/*,video/*"
                          onChange={(e) => handleImageChanges(e, images.length)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between p-3 md:p-10 items-center  md:m-10 mt-5 bg-white rounded-XL shadow-lg flex-wrap">
              {currentIndex === 0 && (
                <>
                  <div className="w-full bg-transparent flex  flex-col md:flex-row">
                    <div className=" flex flex-col  p-1 md:w-1/2 bg-transparent ">
                      <label className="font-santoshi bg-transparent text-sm capitalize font-semibold">
                        {`${selectedProductType}`} Name
                      </label>
                      <input
                        className="md:w-4/5   h-9 text-sm p-3 bg-transparent focus:outline-none border border-gray-300 rounded-md focus:border-blue-500"
                        name="ProductName"
                        placeholder="Product Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col  p-1 md:w-1/2 bg-transparent ">
                      <label className="font-santoshi bg-transparent text-sm  font-semibold">
                        {" "}
                        Brand Name
                      </label>
                      <input
                        className=" md:w-4/5 h-9 text-sm p-3 bg-transparent focus:outline-none border border-gray-300 rounded-md focus:border-blue-500"
                        name="BrandName"
                        placeholder="Brand Name"
                        onChange={(e) => setBrandName(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              {questions &&
                questions?.steps[currentIndex]?.questions
                  .filter((question) => question.status === true)
                  .map((question) => (
                    <div
                      key={question.id}
                      className={`pt-8 bg-transparent ${
                        question.type === "text" ? "w-full md:w-1/2" : "w-full"
                      }`}
                    >
                      <div className="items-center p-1  bg-transparent ">
                        <label className="font-santoshi bg-transparent text-sm  font-semibold">
                          {question.description}
                        </label>
                        <label className="font-santoshi bg-transparent text-sm flex flex-col ">
                          {question.subDescription}
                        </label>
                      </div>
                      {question.type === "text" ? (
                        <input
                          className="w-full  md:w-4/5 h-9 text-sm p-3 bg-transparent focus:outline-none border border-gray-300 rounded-md focus:border-blue-500"
                          type={question.type}
                          name={question.description}
                          placeholder={question.description}
                          value={question.textValue}
                          onChange={(e) =>
                            handleInputChange(e, question.id, "text")
                          }
                        />
                      ) : question.type === "textarea" ? (
                        <textarea
                          className="w-full h-32 text-sm p-3 bg-transparent focus:outline-none border border-gray-300 rounded-md focus:border-blue-500"
                          rows="1"
                          placeholder={question.description}
                          value={question.textareaValue}
                          onChange={(e) =>
                            handleInputChange(e, question.id, "textarea")
                          }
                        />
                      ) : question.type === "radio" ? (
                        <div className="flex gap-4 bg-transparent">
                          {question.options.map((option, index) => (
                            <label
                              key={index}
                              className="flex mx-4 bg-transparent items-center"
                            >
                              <input
                                type="radio"
                                className="form-radio text-blue-500 bg-transparent cursor-pointer"
                                name={`radio-${question.id}`}
                                value={option}
                                onChange={(e) =>
                                  handleInputChange(e, question.id, "radio")
                                }
                              />
                              <span className="px-3 bg-transparent cursor-pointer">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : question.type === "file" ? (
                        <div className="flex flex-wrap bg-transparent items-center m-2">
                          {question?.images?.map((image, index) => (
                            <div
                              key={index}
                              className="flex flex-col relative justify-center z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 items-center p-1 bg-white"
                            >
                              <div
                                className="absolute top-0 right-0 mx-1 cursor-pointer bg-transparent text-red-700"
                                onClick={() =>
                                  handleRemoveImage(question.id, index)
                                }
                              >
                                <AiFillCloseCircle className="text-2xl bg-transparent" />
                              </div>
                              <img
                                src={URL.createObjectURL(image.files)}
                                alt={`Image ${index}`}
                                className="w-full h-full rounded-2xl object-cover"
                              />
                            </div>
                          ))}
                          {/* Show "Add Image" div */}
                          <div className="items-center px-5 bg-transparent flex flex-col justify-center z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 m-1 bg-white">
                            <label
                              //   htmlFor={`file-upload-${index}`}
                              className="cursor-pointer bg-transparent w-full h-full flex justify-center items-center"
                            >
                              <span className="bg-white text-xs text-center font-semibold">
                                Add Image
                              </span>
                              <input
                                // id={`file-upload-${index}`}
                                type="file"
                                style={{ display: "none" }}
                                name={`${selectedProductType}Image`}
                                ref={fileUploadRef}
                                onChange={(e) =>
                                  handleInputChange(e, question.id, "file")
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ) : question.type === "select" ? (
                        <select className="w-full h-10 bg-transparent px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                          {question.options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : question.type === "number" ? (
                        <input
                          className="h-10 border bg-transparent border-gray-300 mt-2 rounded-md focus:outline-none focus:border-blue-500"
                          type="number"
                          placeholder={question.description}
                        />
                      ) : question.type === "card" ? (
                        <div className="bg-white shadow-3xl p-4 md:p-10 rounded-2xl pb-5 mb-10 w-full ">
                          {/* <div className="w-full bg-sky-200 p-10 mt-4  "> */}
                          {question.cards.map((card, cardIndex) => (
                            <div
                              key={cardIndex}
                              className="w-full flex flex-col md:flex-row md:items-center md:gap-6 pt-5 "
                            >
                              {/* {card.description !== "Image" && ( */}
                              <div className="  md:w-28 ">
                                <label className="font-santoshi bg-transparent     text-sm md:line-clamp-2">
                                  {card.description}
                                </label>
                              </div>
                              {/* )} */}
                              {card.type === "text" && (
                                <input
                                  className="w-full md:w-1/2 h-10 mt-1 p-2 border border-gray-300 bg-transparent rounded-md focus:outline-none focus:border-blue-500"
                                  type="text"
                                  placeholder={card.description}
                                  value={card.value || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      question.id,
                                      "card",
                                      cardIndex
                                    )
                                  }
                                />
                              )}
                              {card.type === "file" && (
                                <div className=" border-gray-500 rounded-2xl border-2 border-dashed  w-20 h-20  items-center  bg-white">
                                  <h6 className="bg-white text-xs m-4 pt-3 text-center font-semibold">
                                    Add <br /> Image
                                  </h6>
                                </div>
                              )}

                              {card.type === "number" && (
                                <input
                                  className="w-full md:w-1/2 px-2 h-10 bg-transparent border border-gray-300 mt-2 rounded-md focus:outline-none focus:border-blue-500"
                                  type="number"
                                  placeholder={card.subDescription}
                                  value={card.value || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      question.id,
                                      "card",
                                      cardIndex
                                    )
                                  }
                                />
                              )}

                              {card.type === "select" && (
                                <select
                                  className="w-full md:w-1/2 mt-1 p-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                  value={card.value || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      question.id,
                                      "card",
                                      cardIndex
                                    )
                                  }
                                >
                                  {card.options.map((option, index) => (
                                    <option key={index} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {card.type === "attributes" && (
                                <>
                                  {card.attributes.map(() => (
                                    <div
                                      key={index}
                                      className="p-4 bg-white flex gap-10 justify-start items-start"
                                    >
                                      <div className="w-2/5 bg-white">
                                        <label className="block font-semibold bg-transparent text-sm mb-1">
                                          {question.description ===
                                          "Specifications"
                                            ? "Attribute Name"
                                            : question.description ===
                                              "Business Opportunities"
                                            ? "Opportunities"
                                            : question.description ===
                                              "Social Media Handles"
                                            ? "Handle"
                                            : ""}
                                        </label>
                                        <input
                                          type="text"
                                          name={question.description}
                                          // placeholder={question.description}
                                          value=""
                                          className="w-full  bg-transparent h-9 text-sm px-3 focus:outline-none border border-gray-300 rounded-md"
                                        />
                                      </div>
                                      <div className="bg-transparent w-2/5">
                                        <label className="block font-semibold bg-transparent text-sm mb-1">
                                          {question.description}
                                        </label>
                                        <input
                                          type="text"
                                          name={`attribute_${index}`}
                                          placeholder="value"
                                          value=""
                                          className="w-full h-9 text-sm px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}

                              {card.type === "imageAttribute" && (
                                <>
                                  {card.attributes.map((card, index) => (
                                    <div
                                      key={index}
                                      className="items-center w-full bg-white"
                                    >
                                      <div className="flex gap-3">
                                        {question?.images?.map(
                                          (image, index) => (
                                            <div
                                              key={index}
                                              className="flex  relative  z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 items-center p-1 bg-white"
                                            >
                                              <div
                                                className="absolute top-0 right-0 mx-1 cursor-pointer bg-transparent text-red-700"
                                                onClick={() =>
                                                  handleRemoveImage(
                                                    question.id,
                                                    index
                                                  )
                                                }
                                              >
                                                <AiFillCloseCircle className="text-2xl bg-transparent" />
                                              </div>
                                              <img
                                                src={URL.createObjectURL(
                                                  image.files
                                                )}
                                                alt={`Image ${index}`}
                                                className="w-full h-full rounded-2xl object-cover"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>

                                      <div className="w-full pt-2">
                                        <div className="flex  justify-center bg-transparent items-center  text-center border-gray-500 rounded-2xl border-2 border-dashed  w-32 h-32  ">
                                          <label className="w-full h-full cursor-pointer flex justify-center items-center text-sm font-santoshi">
                                            Add Image
                                            <input
                                              // id={`file-upload-${index}`}
                                              type="file"
                                              style={{ display: "none" }}
                                              name={question.description}
                                              ref={fileUploadRef}
                                              onChange={(e) =>
                                                handleVariant(
                                                  e,
                                                  question.id,
                                                  "file",
                                                  cardIndex
                                                )
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      <div className="flex pt-4 w-full gap-x-4">
                                        <div className="flex flex-col bg-transparent  w-1/2 ">
                                          <span className="text-sm bg-transparent font-santoshi ">
                                            Attribute Name{" "}
                                          </span>
                                          <input
                                            className="  h-9 text-sm px-3 bg-transparent  mt-2  focus:outline-none border  border-gray-300 rounded-sm focus:border-blue-500"
                                            type={card.name}
                                            placeholder="Attribute"
                                            name="attribute"
                                            onChange={(e) =>
                                              handleVariant(
                                                e,
                                                question.id,
                                                "text",
                                                cardIndex
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="flex flex-col  w-1/2 bg-transparent">
                                          <span className="font-santoshi text-sm bg-transparent">
                                            Value
                                          </span>
                                          <input
                                            className="  h-9 text-sm px-3 bg-transparent mt-2 focus:outline-none border  border-gray-300 rounded-sm focus:border-blue-500"
                                            type={card.name}
                                            placeholder="value"
                                            name="value"
                                            onChange={(e) =>
                                              handleVariant(
                                                e,
                                                question.id,
                                                "text",
                                                cardIndex
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          ))}
                          {/* </div> */}
                          <div className="flex justify-end  pt-4">
                            <button className="w-36  rounded-sm font-bold text-blue-950 h-10 bg-blue-200">
                              Add Attribute
                            </button>
                          </div>
                        </div>
                      ) : question.type === "attributes" ? (
                        <div className="bg-white shadow-3xl rounded-2xl mt-4 p-2 items-center ">
                          {question.attributes.map((attribute, index) => (
                            <div
                              key={index}
                              className="p-4 bg-white flex gap-10 justify-center items-center
                              "
                            >
                              <div className="w-2/5 bg-white">
                                <label className="block font-semibold bg-transparent text-sm mb-1">
                                  {question.description}
                                </label>
                                <input
                                  type="text"
                                  name={`attribute_${index}`}
                                  placeholder={question.description}
                                  value={attribute.name}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      question.id,
                                      "attributes",
                                      index
                                    )
                                  }
                                  className="w-full bg-transparent h-9 text-sm px-3 focus:outline-none border border-gray-300 rounded-md"
                                />
                              </div>
                              <div className="bg-transparent w-2/5">
                                <label className="block font-semibold  bg-transparent text-sm mb-1">
                                  value
                                </label>
                                <input
                                  type="text"
                                  name={`attribute_value_${index}`}
                                  placeholder="value"
                                  value={attribute.value}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      question.id,
                                      "attributes",
                                      index
                                    )
                                  }
                                  className="w-full h-9 text-sm px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-end bg-white">
                            <button
                              className="w-36 mt-5 rounded-sm font-bold text-blue-950 h-10 bg-blue-200"
                              onClick={() => handleAddAttribute(question.id)}
                            >
                              Add Attribute
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}

              <div className="flex  items-center bg-transparent mt-5 gap-x-4 w-full">
                {currentIndex > 0 && (
                  <button
                    className="w-48 h-10 border border-gray-600"
                    onClick={() => {
                      setCurrentIndex((prev) => prev - 1);
                    }}
                  >
                    Previous
                  </button>
                )}

                <div className="flex-grow"></div>

                {currentIndex < questions?.steps?.length - 1 && (
                  <button
                    className="w-48 text-white h-10 bg-blue-950 hover:bg-green-500 "
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}

                {currentIndex === questions?.steps?.length - 1 && (
                  <button
                    className="w-48 text-white h-10 bg-blue-950 hover:bg-green-500 "
                    onClick={handleOnClickVerify}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {showVerifyModal && (
        <VerifyModal onClose={handleCloseVerify} onSubmit={handleSubmit} />
      )}

      <ToastContainer className="bg-transparent" />
    </>
  );
}

export default ProductAddingPage;

const VerifyModal = ({ onClose, onSubmit }) => {
  const apiURL = process.env.REACT_APP_API_URL;

  // const navigate = useNavigate();

  const handleClose = (event) => {
    if (event.target.id === "container") {
      onClose();
    }
  };

  const handleOnSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <div
      id="container"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={handleClose}
    >
      <div className="bg-blue-100 w-[700px] p-8  gap-6 rounded-md flex flex-col items-center justify-center ">
        <p className="text-center font-santoshi bg-transparent text-gray-600  mt-2">
          <span className="font-bold bg-transparent"></span>Are you sure you
          want submit
        </p>

        <div className="flex gap-5 bg-transparent mt-2">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-blue-50 border border-gray-500 text-gray-800 px-7 py-2 rounded-md"
          >
            Cancel{" "}
          </button>
          <button
            className="bg-blue-900 hover:bg-blue-600 text-white px-7 py-2 rounded-md"
            onClick={handleOnSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
