import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { AiFillCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails({ onSubmit, questions, selectedProductType }) {
  const [images, setImages] = useState([]);
  const fileUploadRef = useRef(null);
  const [name, setName] = useState();
  const [brandName, setBrandName] = useState();
  const [question, setQuestion] = useState(questions);

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
    e.target.value = null;
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

  const onSubmitForm = () => {
    console.log(question, "qqqqqqqqqqqqqq");

    // onSubmit();
  };
  // ....................Dynamic Fields update...................
  const handleInputChange = (
    e,
    questionId,
    fieldType,
    fieldIndex = null,
    attributeIndex
  ) => {
    const value = e.target.value;
    const currentStep = question.steps[0];
    const questions = currentStep.questions.find((q) => q.id === questionId);
    if (questions) {
      if (fieldType === "text" || fieldType === "textarea") {
        questions.value = value;
      } else if (fieldType === "radio") {
        questions.value = value;
      } else if (fieldType === "select") {
        questions.value = value;
      } else if (fieldType === "number") {
        questions.value = parseFloat(value);
      } else if (fieldType === "attributes") {
        if (e.target.name === `attribute_${fieldIndex}`) {
          questions.attributes[fieldIndex].name = value;
        } else if (e.target.name === `attribute_value_${fieldIndex}`) {
          questions.attributes[fieldIndex].value = value;
        }
      } else if (fieldType === "file") {
        console.log("entered file");
        handleImageChange(e, questions, fieldIndex);
      } else if (
        fieldType === "card" &&
        questions.cards &&
        fieldIndex !== null
      ) {
        // Find the card by index
        const card = questions.cards[fieldIndex];

        if (card) {
          if (card.type === "text") {
            card.value = value; // Update text value
          } else if (card.type === "select") {
            card.value = value; // Update select value
          } else if (card.type === "number") {
            card.value = value;
          } else if (card.type === "attributes") {
            if (e.target.name === `attribute_${attributeIndex}`) {
              card.attributes[attributeIndex].name = value;
            } else if (e.target.name === `attribute_value_${attributeIndex}`) {
              card.attributes[attributeIndex].value = value;
            }
          } else if (card.type === "file") {
            handleImageChange(e, card);
          }
        }
      }
      setQuestion({ ...question });
    }
  };

  const handleImageChange = (e, question) => {
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

      setQuestion({ ...question });
    }
    e.target.value = null;
  };

  const handleRemoveImage = (questionId, index, card) => {
    if (card) {
      const updatedCard = { ...card };
      updatedCard.images.splice(index, 1);
      const updatedQuestions = { ...questions };
      setQuestion(updatedQuestions);
    } else {
      const updatedQuestions = { ...questions };
      const currentStep = updatedQuestions.steps[0];
      const question = currentStep.questions.find((q) => q.id === questionId);
      // console.log(question, "dcbvh");
      if (question && Array.isArray(question.images)) {
        question.images.splice(index, 1);
        setQuestion(updatedQuestions);
      }
    }
  };

  const handleAddAttribute = (questionId) => {
    const currentStep = question.steps[0]; // Assuming currentIndex is your current step index
    const questionToUpdate = currentStep.questions.find(
      (q) => q.id === questionId
    );

    if (questionToUpdate) {
      const newAttribute = { name: "", value: "" };
      questionToUpdate.attributes.push(newAttribute);

      // Update the questions array
      const updatedQuestions = questions.steps[0].questions.map((question) => {
        if (question.id === questionId) {
          return questionToUpdate;
        } else {
          return question;
        }
      });

      setQuestion({
        ...questions,
        steps: [{ ...currentStep, questions: updatedQuestions }],
      });
    }
    console.log(question);
  };

  // const handleCardAddAttribute = (questionId, cardIndex) => {
  //   const currentStep = questions.steps[0];
  //   const questionToUpdate = currentStep.questions.find(
  //     (q) => q.id === questionId
  //   );

  //   if (questionToUpdate) {
  //     const attribute = questionToUpdate?.cards?.find(
  //       (q) => q.type === "attributes"
  //     );
  //     const newAttribute = { name: "", value: "" };
  //     attribute.attributes.push(newAttribute);

  //     const updatedQuestions = questions.steps[0].questions.map((question) => {
  //       if (question.id === questionId) {
  //         return questionToUpdate;
  //       } else {
  //         return question;
  //       }
  //     });

  //     setQuestion({
  //       ...questions,
  //       steps: [{ ...currentStep, questions: updatedQuestions }],
  //     });
  //   }
  // };

  // const handleAddVariant = (questionId) => {
  //   const currentStep = question.steps[0];
  //   const findQuestion = currentStep.questions.find((q) => q.id === questionId);
  //   const cards = findQuestion.cards;

  //   const combinedObject = { ...cards };
  //   const duplicate = findQuestion.cardsDuplicate.push(combinedObject);

  //   // Update the questions array
  //   const updatedQuestions = question.steps[0].questions.map((question) => {
  //     if (question.id === questionId) {
  //       return findQuestion;
  //     } else {
  //       return question;
  //     }
  //   });

  //   setQuestion((prevQuestion) => {
  //     const newQuestion = { ...prevQuestion };

  //     const currentStep = newQuestion.steps[0];
  //     const findQuestion = currentStep.questions.find(
  //       (q) => q.id === questionId
  //     );

  //     findQuestion.cardsDuplicate = [...findQuestion.cardsDuplicate];

  //     return newQuestion;
  //   });
  // };

  const handleAddVariant = (questionId) => {
    // Find the current step and the specific question
    const currentStep = question.steps[0];
    const findQuestion = currentStep.questions.find((q) => q.id === questionId);

    if (findQuestion) {
      const combinedObject = JSON.parse(JSON.stringify(findQuestion.cards));
      findQuestion.cardsDuplicate.push(combinedObject);
      const updatedQuestions = currentStep.questions.map((question) =>
        question.id === questionId ? findQuestion : question
      );
      setQuestion((prevQuestion) => {
        const newQuestion = { ...prevQuestion };
        newQuestion.steps[0].questions = updatedQuestions;
        return newQuestion;
      });
    } else {
      console.error("Question not found");
    }
  };

  useEffect(() => {
    console.log(question, "question");
  }, [question]);

  const handleDeleteCard = (questionId, cardIndex) => {
    const updatedQuestion = { ...question };
    updatedQuestion.steps = question.steps.map((step) => {
      if (step === question.steps[0]) {
        return {
          ...step,
          questions: step.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                cardsDuplicate: q.cardsDuplicate.filter(
                  (_, index) => index !== cardIndex
                ),
              };
            }
            return q;
          }),
        };
      }
      return step;
    });

    // Update the state with the new object
    setQuestion(updatedQuestion);
  };

  const handleDropDown = (e, questionId, cardIndex, cardSubIndex) => {
    const updatedQuestion = JSON.parse(JSON.stringify(question));
    const updateCards = updatedQuestion.steps[0].questions.find(
      (q) => q.id === questionId
    );

    if (updateCards) {
      const card = updateCards.cardsDuplicate[cardIndex];
      if (card) {
        const add = card[cardSubIndex];
        if (add) {
          if (!Array.isArray(add.arrayValue)) {
            add.arrayValue = [];
          }

          if (add.arrayValue.includes(e.target.value)) {
            toast.error("Value already exists in arrayValues");
            return;
          }
          add.arrayValue.push(e.target.value);
          setQuestion(updatedQuestion);
        } else {
          console.error("Invalid cardSubIndex");
        }
      } else {
        console.error("Invalid cardIndex");
      }
    } else {
      console.error("Invalid questionId");
    }
  };

  const handleDeleteValue = (
    questionId,
    cardIndex,
    cardSubIndex,
    valueToDelete
  ) => {
    const updatedQuestion = JSON.parse(JSON.stringify(question));
    const updateCards = updatedQuestion.steps[0].questions.find(
      (q) => q.id === questionId
    );

    if (updateCards) {
      const card = updateCards.cardsDuplicate[cardIndex];

      if (card) {
        const add = card[cardSubIndex];

        if (add) {
          add.arrayValue = add.arrayValue.filter(
            (value) => value !== valueToDelete
          );
          setQuestion(updatedQuestion);
        } else {
          toast.error("Invalid cardSubIndex");
        }
      } else {
        console.error("Invalid cardIndex");
      }
    } else {
      console.error("Invalid questionId");
    }
  };

  const handleCardInputChange = (e, questionId, cardType, cardIndex,cardSubIndex, attributeIndex = null) => {
    const { name, value, files } = e.target;
  
    const updatedQuestion = JSON.parse(JSON.stringify(question));
    const updateCards = updatedQuestion.steps[0].questions.find(q => q.id === questionId);
  
    if (updateCards) {
      const card = updateCards.cardsDuplicate[cardIndex][cardSubIndex];
      console.log(card,"cass");
      if (card) {
        switch (cardType) {
          case 'text':
          case 'number':
            card.value = value;
            break;
          case 'file':
            // card.images = card.images || [];
            if (files && files.length > 0) {
              card.images.push({ files: files[0] });
            }
            break;
          case 'attributes':
            if (attributeIndex !== null && card.attributes[attributeIndex]) {
              const attribute = card.attributes[attributeIndex];
              if (name.startsWith('attribute_')) {
                attribute.name = value;
              } else if (name.startsWith('attribute_value_')) {
                attribute.value = value;
              }
            }
            break;
          default:
            break;
        }
        setQuestion(updatedQuestion);
      } else {
        console.error("Invalid cardIndex");
      }
    } else {
      console.error("Invalid questionId");
    }
  };
  
  // const handleRemoveImage = (questionId, cardIndex, imageIndex) => {
  //   const updatedQuestion = JSON.parse(JSON.stringify(question));
  //   const updateCards = updatedQuestion.steps[0].questions.find(q => q.id === questionId);
  
  //   if (updateCards) {
  //     const card = updateCards.cardsDuplicate[cardIndex];
  //     if (card && card.images) {
  //       card.images.splice(imageIndex, 1);
  //       setQuestion(updatedQuestion);
  //     } else {
  //       console.error("Invalid cardIndex or imageIndex");
  //     }
  //   } else {
  //     console.error("Invalid questionId");
  //   }
  // };
  

  

  return (
    <>
      <div className="flex flex-col  p-7 items-start  md:m-10 mt-5 bg-white rounded-xl shadow-lg flex-wrap">
        <label className="bg-transparent flex flex-col capitalize font-santoshi font-semibold text-lg">
          {`${selectedProductType}`} Image
          <span className="text-sm text-gray-500 font-santoshi capitalize">
            {" "}
            Add {`${selectedProductType}`} Images here
          </span>
        </label>

        <div
          className={`flex flex-wrap flex-col-2 md:flex-row gap-2 justify-center`}
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
      <div className="flex justify-between p-3 md:p-10 items-center  md:m-10 mt-5 bg-white rounded-xl shadow-lg flex-wrap">
        <div className="w-full bg-transparent flex  flex-col md:flex-row">
          <div className=" flex flex-col  p-1 md:w-1/2 bg-transparent ">
            <label className="font-santoshi bg-transparent text-sm capitalize font-semibold">
              {`${selectedProductType}`} Name
            </label>
            <input
              className="md:w-4/5   h-9 text-sm p-3 bg-transparent focus:outline-none border border-gray-300 rounded-md focus:border-blue-500"
              name={`${selectedProductType}Name`}
              placeholder={`${selectedProductType}Name`}
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

        {question &&
          question.steps[0] &&
          question?.steps[0]?.questions
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
                    onChange={(e) => handleInputChange(e, question.id, "text")}
                  />
                ) : question.type === "textarea" ? (
                  <textarea
                    className="w-full h-32 text-sm p-3 bg-transparent focus:outline-none border border-gray-300 rounded-md focus:border-blue-500"
                    rows="1"
                    placeholder={question.description}
                    value={question.value}
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
                          onClick={() => handleRemoveImage(question.id, index)}
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
                    <div className="items-center  px-5 bg-transparent flex flex-col justify-center z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 m-1 ">
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
                  <select
                    className="w-full h-10 bg-transparent px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    onChange={(e) =>
                      handleInputChange(e, question.id, "select")
                    }
                  >
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
                    onChange={(e) =>
                      handleInputChange(e, question.id, "number")
                    }
                  />
                ) : question.type === "card" ? (
                  <>
                    <div className=" w-full border-2  rounded-lg py-2 shadow-lg  flex justify-end px-9">
                      <button
                        className="w-36 rounded-md font-bold flex justify-center items-center text-blue-950 h-10 bg-blue-200"
                        onClick={() => handleAddVariant(question.id)}
                      >
                        <div className="flex items-center gap-2">
                          <FaPlus className="text-lg" />
                          <p> Add {question.description}</p>
                        </div>
                      </button>
                    </div>
                    {question.cardsDuplicate.length > 0 &&
                      question.cardsDuplicate.map((cardSet, cardIndex) => (
                        <div
                          key={cardIndex}
                          className=" relative shadow-3xl mt-4 p-4 md:p-10 rounded-2xl pb-5 mb-10 w-full"
                        >
                          <button
                            className="absolute right-5 top-4"
                            onClick={() =>
                              handleDeleteCard(question.id, cardIndex)
                            }
                          >
                            {" "}
                            <AiFillCloseCircle className="text-2xl text-red-600 " />
                          </button>
                          {Object.values(cardSet).map((card, cardSubIndex) => (
                            <div
                              key={cardSubIndex}
                              className="w-full flex flex-col md:flex-row md:items-center md:gap-6 pt-5"
                            >
                              <div className="md:w-28">
                                <label className="font-santoshi bg-transparent text-sm md:line-clamp-2">
                                  {card.description}
                                </label>
                              </div>

                              {card.type === "text" && (
                                <input
                                  className="w-full md:w-1/2 h-10 mt-1 p-2 border border-gray-300 bg-transparent rounded-md focus:outline-none focus:border-blue-500"
                                  type="text"
                                  placeholder={card.description}
                                  onChange={(e) =>
                                    handleCardInputChange(
                                      e,
                                      question.id,
                                      "text",
                                      cardIndex,
                                      cardSubIndex

                                    )
                                  }
                                />
                              )}
                              {card.type === "file" && (
                                <div className="flex flex-wrap bg-transparent items-center m-2">
                                  {card?.images?.map((image, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col relative justify-center z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 items-center p-1 bg-white"
                                    >
                                      <div
                                        className="absolute top-0 right-0 mx-1 cursor-pointer bg-transparent text-red-700"
                                        onClick={() =>
                                          handleRemoveImage(
                                            question.id,
                                            index,
                                            card
                                          )
                                        }
                                      >
                                        <AiFillCloseCircle className="text-2xl bg-transparent cursor-pointer" />
                                      </div>
                                      <img
                                        src={URL.createObjectURL(image.files)}
                                        alt={`Image ${index}`}
                                        className="w-full h-full rounded-2xl object-cover"
                                      />
                                    </div>
                                  ))}
                                  <div className="bg-white text-xs m-4 pt-3 text-center font-semibold border-gray-500 rounded-2xl border-2 border-dashed w-20 h-20">
                                    <label className="cursor-pointer bg-transparent w-full h-full flex justify-center items-center">
                                      <span className="bg-white text-xs text-center font-semibold">
                                        Add <br /> Image
                                      </span>
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        name={`${selectedProductType}Image`}
                                        ref={fileUploadRef}
                                        onChange={(e) =>
                                          handleCardInputChange(
                                            e,
                                            question.id,
                                            "file",
                                            cardIndex,
                                            cardSubIndex
                                          )
                                        }
                                      />
                                    </label>
                                  </div>
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
                                <>
                                  <select
                                    className="w-full md:w-1/2 mt-1 p-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    onChange={(e) =>
                                      handleDropDown(
                                        e,
                                        question.id,
                                        cardIndex,
                                        cardSubIndex
                                      )
                                    }
                                  >
                                    <option>
                                      Select {`${card?.description}`}
                                    </option>
                                    {card.options.map((option, index) => (
                                      <option key={index} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  {card?.arrayValue?.map((value, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center px-5 relative  bg-blue-200 border text-blue-900  rounded-xl font-semibold mt-1"
                                    >
                                      <AiFillCloseCircle
                                        className="text-red-500 absolute -right-1 -top-2 hover:text-red-700 cursor-pointer"
                                        onClick={() =>
                                          handleDeleteValue(
                                            question.id,
                                            cardIndex,
                                            cardSubIndex,
                                            value
                                          )
                                        }
                                      />
                                      <span>{value}</span>
                                    </div>
                                  ))}
                                </>
                              )}
                              {card.type === "attributes" && (
                                <div className="w-full">
                                  {card.attributes.map(
                                    (attribute, attributeIndex) => (
                                      <div
                                        key={attributeIndex}
                                        className="pb-3 md:p-4"
                                      >
                                        <div className="flex gap-3 md:gap-10">
                                          <div className="w-full">
                                            <label className="block font-semibold bg-transparent text-sm mb-1">
                                              Attribute Name
                                            </label>
                                            <input
                                              type="text"
                                              name={`attribute_${attributeIndex}`}
                                              placeholder="attributes"
                                              onChange={(e) =>
                                                handleInputChange(
                                                  e,
                                                  question.id,
                                                  "card",
                                                  cardIndex,
                                                  attributeIndex
                                                )
                                              }
                                              className="w-full bg-transparent h-9 text-sm px-3 focus:outline-none border border-gray-300 rounded-md"
                                            />
                                          </div>
                                          <div className="bg-transparent w-full">
                                            <label className="block font-semibold bg-transparent text-sm mb-1">
                                              Value
                                            </label>
                                            <input
                                              type="text"
                                              name={`attribute_value_${attributeIndex}`}
                                              placeholder="value"
                                              onChange={(e) =>
                                                handleInputChange(
                                                  e,
                                                  question.id,
                                                  "card",
                                                  cardIndex,
                                                  attributeIndex
                                                )
                                              }
                                              className="w-full h-9 text-sm px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                              {card.type === "imageAttribute" && (
                                <>
                                  {card.attributes.map((attribute, index) => (
                                    <div
                                      key={index}
                                      className="items-center w-full bg-white"
                                    >
                                      <div className="flex gap-3">
                                        {question?.images?.map(
                                          (image, imageIndex) => (
                                            <div
                                              key={imageIndex}
                                              className="flex relative z-0 border-gray-500 rounded-2xl border-2 border-dashed mt-3 w-32 h-32 items-center p-1 bg-white"
                                            >
                                              <div className="absolute top-0 right-0 mx-1 cursor-pointer bg-transparent text-red-700">
                                                <AiFillCloseCircle className="text-2xl bg-transparent" />
                                              </div>
                                              <img
                                                src={URL.createObjectURL(
                                                  image.files
                                                )}
                                                alt={`Image ${imageIndex}`}
                                                className="w-full h-full rounded-2xl object-cover"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                      <div className="w-full pt-2">
                                        <div className="flex justify-center bg-transparent items-center text-center border-gray-500 rounded-2xl border-2 border-dashed w-32 h-32">
                                          <label className="w-full h-full cursor-pointer flex justify-center items-center text-sm font-santoshi">
                                            Add Image
                                            <input
                                              type="file"
                                              style={{ display: "none" }}
                                              name={question.description}
                                              ref={fileUploadRef}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                      <div className="flex pt-4 w-full gap-x-4">
                                        <div className="flex flex-col bg-transparent w-1/2">
                                          <span className="text-sm bg-transparent font-santoshi">
                                            Attribute Name
                                          </span>
                                          <input
                                            className="h-9 text-sm px-3 bg-transparent mt-2 focus:outline-none border border-gray-300 rounded-sm focus:border-blue-500"
                                            type={attribute.name}
                                            placeholder="Attribute"
                                            name="attribute"
                                          />
                                        </div>
                                        <div className="flex flex-col w-1/2 bg-transparent">
                                          <span className="font-santoshi text-sm bg-transparent">
                                            Value
                                          </span>
                                          <input
                                            className="h-9 text-sm px-3 bg-transparent mt-2 focus:outline-none border border-gray-300 rounded-sm focus:border-blue-500"
                                            type={attribute.name}
                                            placeholder="value"
                                            name="value"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          ))}
                          {/* <div className="flex justify-end pt-4">
                            <button
                              className="w-36 rounded-sm font-bold text-blue-900 h-10 bg-blue-200"
                              onClick={() =>
                                handleCardAddAttribute(question.id)
                              }
                            >
                              Add Attribute
                            </button>
                          </div> */}
                        </div>
                      ))}
                  </>
                ) : question.type === "attributes" ? (
                  <div className="bg-white shadow-3xl   py-3 rounded-2xl mt-4 md:p-10 md:mx-10 items-center ">
                    {question.attributes.map((attribute, index) => (
                      <div
                        key={index}
                        className=" flex gap-2 pb-3 md:gap-10 justify-center items-center"
                      >
                        <div className="w-2/5 bg-white">
                          <label className="block font-semibold bg-transparent text-sm mb-1">
                            {question.description}
                          </label>
                          <input
                            type="text"
                            name={`attribute_${index}`}
                            placeholder={question.description}
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
                    <div className="flex justify-end pr-3 bg-white">
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
          <button className="w-48 h-10 border border-gray-600">Previous</button>

          <div className="flex-grow"></div>

          <button
            type="submit"
            className="w-48 text-white h-10 bg-blue-950 hover:bg-green-500 "
            onClick={onSubmitForm}
          >
            Next
          </button>

          <button className="w-48 text-white h-10 bg-blue-950 hover:bg-green-500 ">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
