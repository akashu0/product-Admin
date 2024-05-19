import React from "react";

const Banner = ({ banners, current }) => (
  <div className="w-full lg:w-[1000px] mx-auto mt-2  rounded-xl h-[300px] relative overflow-hidden">
    {banners.map((item, index) => (
      <React.Fragment key={index}>
        <img
          src={`${process.env.REACT_APP_API_HOST}/uploads/${item.filename}`}
          alt={`Banner ${index}`}
          className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-500 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-10 bottom-3 p-10 transition-opacity duration-500 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ color: item.descriptionColor || "white" }}
        >
          <p className="w-72 font-semibold text-2xl bg-opacity-50 rounded-lg">
            {item.description}
          </p>
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default Banner;
