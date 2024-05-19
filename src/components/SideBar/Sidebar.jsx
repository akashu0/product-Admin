import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegLightbulb } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { LiaClipboardCheckSolid } from "react-icons/lia"; // Check your correct import based on your project setup
import sidBarImage from "../../assets/sidebar.png";
import { useSelector } from "react-redux";
// import { FaRegLightbulb } from "react-icons/fa6";

function Sidebar() {
  const location = useLocation();
    const user = useSelector((state) => state.token.user);

  const navLinks = [
    {
      title: "Home",
      icon: <IoHomeOutline />,
      path: "/",
    },
    {
      title: "Opportunities",
      icon: <FaRegLightbulb />,
      //   path: user ? "/opportunities" : "/login",
      path: "/opportunities",
    },
    {
      title: "Wishlist",
      icon: <LiaClipboardCheckSolid className="bg-transparent" />,
      //   path: user ? "/wishlist" : "/login",
      path: "/wishlist",
    },
    {
      title: "Enquiries",
      icon: <FaPeopleGroup className="bg-transparent" />,
      //   path: user ? "/enquiries" : "/login",
      path: "/enquiries",
    },
  ];
  return (
    <>
      <div className="hidden md:flex md:w-[230px] bg-white flex-col fixed h-full left-0 top-16 overflow-hidden">
        <div className="w-full flex flex-col items-start gap-2 border-slate-300 bg-[#fff] py-5 relative">
          {navLinks.map((link, index) => (
            <Link
              key={link.title}
              to={link.path}
              className={`flex items-center gap-2 w-full hover:bg-blue-50 px-6 py-3 cursor-pointer ${
                location.pathname === link.path
                  ? "bg-blue-200 text-blue-900"
                  : "bg-transparent text-gray-500"
              }`}
            >
              {link.icon}
              <span className="font-semibold text-[15px] bg-transparent">
                {link.title}
              </span>
              {location.pathname === link.path && (
                <div className="absolute right-0 h-7 rounded bg-blue-900 w-1" />
              )}
            </Link>
          ))}
        </div>
        <div className="flex-grow bg-transparent w-full">
          <img
            className="bg-transparent object-contain bg-fixed w-full h-full"
            src={sidBarImage}
            alt="sidebarImage"
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
