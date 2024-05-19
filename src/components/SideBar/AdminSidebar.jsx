import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegLightbulb, FaRegQuestionCircle } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoCubeOutline, IoHomeOutline } from "react-icons/io5";
import { LiaClipboardCheckSolid } from "react-icons/lia"; // Check your correct import based on your project setup
import sidBarImage from "../../assets/sidebar.png";
import { useSelector } from "react-redux";
import { GrAnalytics } from "react-icons/gr";
import { LuKey } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
// import { FaRegLightbulb } from "react-icons/fa6";

function AdminSidebar() {
  const location = useLocation();
  const user = useSelector((state) => state.token.user);
  const role = useSelector((state) => state.token.role);
  const departments = useSelector((state) => state.userDetails.departments);

  const departmentToNavTitle = {
    "Product Management": "Products",
    "Opportunities Management": "Opportunities",
    "Enquiries Management": "Enquiries",
    "Faqs Management": "Faqs",
  };
  const initialNavLinks = [
    {
      title: "Home",
      icon: <IoHomeOutline />,
      path: "/admin",
    },
    {
      title: "Products",
      icon: <IoCubeOutline className="bg-transparent" />,
      path: user ? "/admin/products" : "/login",
    },
    {
      title: "Opportunities",
      icon: <FaRegLightbulb />,
      //   path: user ? "/opportunities" : "/login",
      path: "/admin/opportunities",
    },
    {
      title: "Wishlist",
      icon: <LiaClipboardCheckSolid className="bg-transparent" />,
      //   path: user ? "/wishlist" : "/login",
      path: "/admin/wishlist",
    },
    {
      title: "Enquiries",
      icon: <FaPeopleGroup className="bg-transparent" />,
      //   path: user ? "/enquiries" : "/login",
      path: "/admin/enquiries",
    },
    {
      title: "Analytics",
      icon: <GrAnalytics className="bg-transparent" />,
      path: user ? "/admin/dashboard" : "/login",
    },
    {
      title: "Access Management",
      icon: <LuKey className="bg-transparent" />,
      path: user ? "/admin/access" : "/login",
    },
    {
      title: "Faqs",
      icon: <FaRegQuestionCircle className="bg-transparent" />,
      path: user ? "/admin/faqs" : "/login",
    },
    {
      title: "Access",
      icon: <CiSettings className="bg-transparent" />,
      path: user ? "/admin/useracess" : "/login",
    },
  ];
  const [navLinks, setNavLinks] = useState(initialNavLinks);

  useEffect(() => {
    if (role !== "user" && role !== "admin") {
      const allowedNavLinks = initialNavLinks.filter((link) => {
        return (
          link.title === "Home" ||
          departments.some(
            (dept) => departmentToNavTitle[dept.departmentName] === link.title
          ) ||
          link.title === "Access"
        );
      });
      setNavLinks(allowedNavLinks);
    } else {
      setNavLinks(initialNavLinks.filter((link) => link.title !== "Access"));
    }
  }, [role, departments]);
  return (
    <>
      <div className="hidden md:flex md:w-[230px] bg-white flex-col fixed h-full left-0 top-16 overflow-y-auto">
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

export default AdminSidebar;
