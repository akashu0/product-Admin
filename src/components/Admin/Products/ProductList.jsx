import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
// import ProductCardComponent from "./ProductCardComponent";
// import ProductList from "./ProductList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCardComponent from "./ProductCardComponent";
import Spinner from "../../Spinner";

function ProductList() {
  const token = useSelector((state) => state.token.token);
  const DropDownList = [
    "All Products",
    "My Products",
    "Processing",
    "Removed Products",
    "Draft",
  ];

  const [selectedButton, setSelectedButton] = useState(DropDownList[0]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [list, setList] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/product/getall-product`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiURL, token]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/product/getproductbyUse`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(response.data);
    } catch (error) {
      console.error("Error fetching user products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, [apiURL, token]);

  const getProductListByStatus = (status) => {
    return list.filter((item) => item.status === status.toLowerCase());
  };

  const renderComponent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!productData.length) {
      return <div className="w-full h-[50vh] bg-red-500 text-white text-2xl font-santoshi flex justify-center items-center mt-2 overflow-auto">No data available.</div>; // Add empty data message
    }

    const statusMap = {
      "All Products": productData,
      "My Products": getProductListByStatus("approved"),
      Draft: getProductListByStatus("draft"),
      Processing: getProductListByStatus("processing"),
      "Removed Products": getProductListByStatus("block"),
    };

    const data = statusMap[selectedButton] || [];

    return selectedButton === "All Products" ? (
      <ProductCardComponent data={data} header={selectedButton} />
    ) : (
      
        // <ProductList list={data} header={selectedButton} onSubmit={fetchUserProducts} />
      <p>gee</p>
    );
  };

  return (
    <div className="w-full px-4 md:px-5">
      <div className="flex justify-between items-center m-2">
        <h1 className="font-semibold text-xl font-santoshi text-blue-900">
          Products
        </h1>
        <Link to="/admin/addproduct">
          <button className="p-2 text-lg border font-santoshi bg-blue-900 text-white rounded-lg">
            Add Product
          </button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row bg-transparent">
        <div className="w-full ">
          {DropDownList.map((value, key) => (
            <button
              key={key}
              className={`py-2 px-6 font-semibold ${
                selectedButton === value
                  ? "text-blue-800 border-b-2 border-blue-900"
                  : "text-gray-500"
              }`}
              onClick={() => setSelectedButton(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <hr className="w-full border-gray-400 bg-transparent md:hidden" />
      </div>
      <div className="h-full ">{renderComponent()}</div>
      <ToastContainer />
    </div>
  );
}

export default ProductList;
