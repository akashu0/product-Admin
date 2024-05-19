import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCardComponent({ data }) {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="overflow-y-auto pb-5 mt-3 shadow-md rounded-lg p-5 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {data.map((product, index) => (
          <div
            key={product.id}
            className="bg-blue-50 rounded-2xl shadow-xl cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => navigate(`/viewproduct/${product.id}`)}
          >
            <div className="relative w-full h-[200px]">
              <img
                src={product.productImage}
                alt={`Product Image of ${product.productName}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                  hoverIndex === index ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src={product.secondaryProductImage}
                alt={`Secondary Image of ${product.productName}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                  hoverIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="p-5 flex flex-col">
              <h1 className="font-bold text-lg text-black font-santoshi overflow-hidden overflow-ellipsis">
                {product.productName}
              </h1>
              <p className="text-blue-900 font-semibold font-santoshi">
                By {product.brandName}
              </p>
              <button
                className="mt-4 py-2 px-4 bg-blue-900 font-santoshi text-white rounded shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Send enquiry for " + product.productName);
                }}
              >
                Send Enquiry
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCardComponent;
