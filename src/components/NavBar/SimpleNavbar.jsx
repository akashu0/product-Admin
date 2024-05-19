import React, { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../../store/userDetails";
import { clearToken } from "../../store/tokenSlice";

function SimpleNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.token.user);

  const userDetails = useSelector((state) => state.userDetails);

  const [open, setOpen] = useState(false);

  const handleMenuToggle = () => setOpen(!open);

  const submitLogout = () => {
    dispatch(clearToken());
    dispatch(clearUserDetails());

    navigate("/");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  let timerId;
  const handleMouseEnter = () => {
    clearTimeout(timerId);
    setIsDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    timerId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 1000); // Delay closing dropdown to stabilize the experience
  };

  return (
    <nav className="bg-blue-900 text-white fixed top-0 left-0 w-full h-16 z-10 flex items-center justify-between px-4 sm:px-6 md:px-10">
      {/* Logo and category dropdown, hidden on smaller screens */}
      <div className="flex items-center space-x-6">
        <h1 className="font-semibold text-3xl">Prolio</h1>
      </div>

      {/* Right-side items - always visible, adjust for mobile view */}
      <div className="flex items-center space-x-4">
        <div
          className="flex items-center space-x-4"
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <div className="bg-blue-50 rounded-full p-1">
              <IoIosNotificationsOutline className="text-blue-900 text-3xl cursor-pointer" />
            </div>
          </div>
          <div
            className="flex items-center space-x-2"
            onMouseEnter={handleMouseEnter}
          >
            <Link to={user ? "/profile" : "/login"}>
              <div
                className="relative h-10 w-10 rounded-full p-1 flex justify-center items-center bg-blue-50"
                style={{
                  backgroundImage:
                    user && userDetails.userImg
                      ? `url(${userDetails.userImg})`
                      : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {!userDetails.userImg && (
                  <FaRegUser className="text-blue-900 text-2xl cursor-pointer" />
                )}
              </div>
            </Link>
            {user && userDetails.firstName && (
              <span className="hidden  md:flex items-center text-white text-md">
                {`${userDetails.firstName} ${userDetails.lastName}`}
                <IoIosArrowDown className="ml-1" />
              </span>
            )}
          </div>
          {user && isDropdownOpen && (
            <div className="absolute right-0 top-full  w-44 text-center border-2 border-blue-900 bg-white  rounded-t-none rounded-xl shadow-lg overflow-hidden">
              <ul>
                <Link to="/profile">
                  <li className="px-4 border-b text-black border-blue-900  hover:text-white hover:border-white hover:bg-blue-900 py-2">
                    Profile
                  </li>
                </Link>
                <li
                  className="px-4 py-2 text-black hover:text-white hover:bg-blue-900"
                  onClick={submitLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Hamburger menu for smaller screens */}
        <button className="lg:hidden p-2" onClick={handleMenuToggle}>
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown for notifications and user on smaller screens */}
      {open && (
        <div className="flex lg:hidden flex-col bg-blue-900 p-3 gap-2 absolute top-full right-0 w-full ">
          <div className="bg-blue-50 items-center text-center rounded-full p-4 mb-2">
            <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
              Home
            </span>
          </div>
          <div className="bg-blue-50 items-center text-center rounded-full p-4 mb-2">
            <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
              Opportunities
            </span>
          </div>
          <div className="bg-blue-50 items-center text-center rounded-full p-4 mb-2">
            <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
              Wishlist
            </span>
          </div>
          <div className="bg-blue-50 items-center text-center rounded-full p-4 mb-2">
            <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
              Enquiries
            </span>
          </div>
          {/* <div className="bg-blue-50 items-center text-center rounded-full p-4 mb-2">
            <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
              Notification
            </span>
          </div> */}
          {/* <Link to={user ? "/profile" : "/login"} className="mb-2">
            <div className="bg-blue-50 items-center text-center rounded-full p-4">
              <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
                Profile
              </span>
            </div>
          </Link> */}
          {/* <div className="bg-blue-50 items-center text-center rounded-full p-4 mb-2">
            <span className="font-santoshi font-semibold text-center text-3xl text-blue-900">
              Logout
            </span>
          </div> */}
        </div>
      )}
    </nav>
  );
}

export default SimpleNavbar;
