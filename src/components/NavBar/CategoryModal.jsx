import React, { useEffect, useState } from "react";
import classes from "./style.module.css";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
function CategoryModal({ setShowModal }) {
  const [showContent, setShowContent] = useState(false);
  const [dropDownList, setDropDownList] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;
  const allCategories = { _id: "All Categories" };
  const [selectedButton, setSelectedButton] = useState(allCategories);
  const [category, setCategory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [subCategory, setSubCategory] = useState({});

  useEffect(() => {
    setShowContent(true);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/category/get-active-category`
      );

      console.log(response.data, "getAactiveCategory");
      setCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/category/getAllCategory-types`
      );
      // console.log(response.data, "data");
      setDropDownList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const closeModal = (e) => {
    if (e.target.id === "container" || e.target.id === "button") {
      if (subshowModal) {
        setSubShowModal(false);
      } else {
        setShowContent(false);
        setTimeout(() => {
          setShowModal(false);
        }, 300);
      }
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const renderComponent = () => {
    if (selectedButton._id === "All Categories") {
      return Categories();
    }
  };
  const [subshowModal, setSubShowModal] = useState(false);
  const openSubModal = () => {
    setSubShowModal(true);
  };

  const handleCategoryClick = (subcategoryData) => {
    // console.log(subcategoryData,"dddddddd");
    setSubCategory({
      name: subcategoryData.category,
      subcategories: subcategoryData.subcategories,
    });
    openSubModal();
  };
  const Categories = () => {
    const filteredCategories =
      searchText.trim().length > 0
        ? category.filter((item) =>
            item.category.toLowerCase().includes(searchText.toLowerCase())
          )
        : category;
    return (
      <div className="p-5 w-full flex  flex-wrap gap-4  bg-transparent">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((item, index) => (
            <div
              key={index}
              className="flex justify-between bg-white w-1/4 p-3 rounded-3xl shadow-md cursor-pointer"
              onClick={() => handleCategoryClick(item)}
            >
              <div className="flex flex-col bg-white gap-1">
                <div className="font-semibold text-lg text-black bg-white">
                  {item.category}
                </div>

                <div className="text-sm text-gray-500 bg-white">
                  16989 Products
                </div>
              </div>
              <div className="ml-1 flex items-center text-blue-800 bg-white">
                <FaArrowRight />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center  text-2xl bg-transparent font-santoshi text-gray-500">
            No categories found.
          </div>
        )}
      </div>
    );
  };
  return (
    <div
      id="container"
      className={`${classes.backdrop} ${showContent && classes.showBackdrop}`}
      onClick={closeModal}
    >
      <div
        className={`${classes.modal} ${showContent && classes.showModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-wrap justify-between bg-transparent p-3">
          <div className="flex flex-wrap bg-transparent items-center text-center">
            <div className="bg-transparent">
              <button
                className={`py-2 font-santoshi px-6 ${
                  selectedButton._id === allCategories._id
                    ? "text-blue-900 font-semibold underline underline-offset-8"
                    : "bg-transparent text-gray-400/100"
                }`}
                onClick={() => setSelectedButton(allCategories)}
              >
                All Categories
              </button>
            </div>
            {dropDownList.map((value, index) => (
              <div key={index} className="bg-transparent">
                <button
                  type="button"
                  className={`py-2 font-santoshi px-6 ${
                    selectedButton && selectedButton === value._id
                      ? "text-blue-900 font-semibold bg-transparent underline underline-offset-8"
                      : "bg-transparent text-gray-400/100"
                  }`}
                  onClick={() => setSelectedButton(value._id)}
                >
                  {capitalizeFirstLetter(value._id)}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center bg-transparent">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="p-1 text-gray-700 border-2 rounded-lg bg-transparent border-gray-400 w-[250px] hover:border-blue-900 focus:outline-blue-900"
            />
            <button
              type="button"
              className="py-1 px-4 text-white rounded-lg bg-blue-900 hover:bg-blue-800"
              style={{ marginLeft: "4px" }}
            >
              Search
            </button>
          </div>

          <div className={classes.closeBtn}>
            <span id="button" onClick={closeModal}>
              &times;
            </span>
          </div>
        </div>

        {renderComponent()}
      </div>
      {subshowModal && (
        <SubcategoryModal
          subCategory={subCategory}
          setSubShowModal={setSubShowModal}
          // closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default CategoryModal;

const SubcategoryModal = ({ setSubShowModal, subCategory }) => {
  const [showSubContent, setShowSubContent] = useState(false);

  useEffect(() => {
    setShowSubContent(true);
  }, []);

  const close = () => {
    setShowSubContent(false);
    setTimeout(() => {
      setSubShowModal(false);
    }, 500);
  };

  return (
    <div
      className={`${classes.submodal} ${
        showSubContent && classes.showSubModal
      }`}
    >
      <div className="w-full flex items-center justify-between bg-transparent p-5">
        <FaArrowLeft
          className="text-black bg-transparent cursor-pointer"
          onClick={close}
        />
        <h1 className="flex-grow text-center text-blue-900 text-xl font-bold bg-transparent">
          {subCategory.name} Subcategories
        </h1>
        <div style={{ width: 24 }}></div>{" "}
        {/* Placeholder for balancing the arrow */}
      </div>
      <div className="px-5 py-2 bg-transparent">
        <h2 className="text-lg font-semibold text-blue-900 font-santoshi bg-transparent">
          Subcategories:
        </h2>
        {subCategory.subcategories && subCategory.subcategories.length > 0 ? (
          <ul className="list-disc pl-5 bg-transparent">
            {subCategory.subcategories.map((sub, index) => (
              <li key={index} className="text-gray-500 bg-transparent">
                {sub}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-500">No subcategories available.</p>
        )}
      </div>
    </div>
  );
};
