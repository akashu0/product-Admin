import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import bcimage from "../../assets/OBJECTS.png";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { userLoginValidationSchema } from "../../util/validation";
import { setToken } from "../../store/tokenSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/userDetails";
import usePasswordToggle from "../../hook/usePasswordToggle";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setgoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userLoginValidationSchema),
  });

  const apiURL = process.env.REACT_APP_API_URL;
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const submitHandler = async (formData) => {
    try {
      setIsSubmitting(true);
      if (formData) {
        const response = await axios.post(`${apiURL}/auth/login`, formData);
        const { token, role, id, userDetails, departments } = response.data;

        const data = {
          token,
          role,
          id,
        };
        setIsSubmitting(false);
        dispatch(setToken(data));
        dispatch(
          setUserDetails({ ...userDetails, departments: departments || [] })
        );
        if (response.data.role === "user") {
          navigate("/");
        } else {
          navigate("/admin");
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        `Error: ${error.response ? error.response.data.error : error.message}`
      );
      console.error("Error logging in:", error.message);
    }
  };

  async function handleCallbackResponse(response) {
   

    const user = jwtDecode(response.credential);
    try {
      const backendResponse = await saveUserDetailsToBackend(user);
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  }

  const saveUserDetailsToBackend = async (user) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/google-login`,
        user
      );
      if (response.status === 200) {
        toast.success("Registered successfully");
        const { token, role, id, userDetails, departments } = response.data;

        const data = {
          token,
          role,
          id,
        };
        // console.log(response.data);
        dispatch(setToken(data));
        dispatch(
          setUserDetails({ ...userDetails, departments: departments || [] })
        );
      
        // setTimeout(() => {
        if (role === "user") {
          navigate("/");
        } else {
          navigate("/admin");
        }
        // }, 2000);
      } else if (response.status === 400) {
        toast.error("Error occured");
      }
    } catch (error) {
    
      toast.error(
        `Registration failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.Google_Client_ID,
      callback: handleCallbackResponse,
    });
    window.google.accounts.id.renderButton(document.getElementById("sign"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-blue-50">
      <div className="w-full md:w-1/2">
        <div className="py-12 px-4 md:px-32">
          <Link to="/">
            <h1 className="text-blue-800 text-5xl font-bold font-serif">
              Prolio
            </h1>
          </Link>
          <div className="pt-5">
            <span className="font-bold text-2xl font-serif">
              Discover a world of products at your fingertips, all in one place
            </span>
            <p className="pt-4 text-gray-600">
              Welcome to our one-stop shop for all your product needs. Our
              website is your virtual bank of products, offering a vast and
              diverse range of items to explore and choose from. Whether you're
              searching for the latest gadgets, fashion trends, home essentials,
              or anything in between, you'll find it here.
            </p>
          </div>
        </div>
        <div className="px-4 md:ml-16">
          <img className="w-full h-auto" src={bcimage} alt="background image" />
        </div>
      </div>
      <div className="lg:w-1/2 w-full h-full flex flex-col p-4 lg:p-14">
        <h1 className="pt-10 text-xl font-bold">
          Sign in to Access your account
        </h1>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 pt-3">
          <div>
            <label className="text-sm font-semibold">Email Address</label>
            <input
              type="text"
              placeholder="Enter your email address"
              {...register("email")}
              className="w-full h-10 bg-white text-sm rounded shadow-lg px-3 mt-2 focus:outline-blue-900"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="relative">
            <label className="text-sm font-semibold">Password</label>
            <input
              type={PasswordInputType}
              placeholder="Enter password"
              {...register("password")}
              className="w-full h-10 bg-white text-sm rounded shadow-lg px-3 mt-2 focus:outline-blue-900 pr-10"
            />
            <div className="absolute inset-y-0 right-0 top-8 text-2xl flex items-center pr-3">
              {ToggleIcon}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          {isSubmitting ? (
            <button
              type="button"
              className="w-full h-10 rounded text-sm bg-indigo-500 text-white flex justify-center items-center"
              disabled
            >
              <svg className="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24">
                <circle
                  className="opacity-25 "
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full h-10 rounded text-sm transition ease-in-out delay-150 bg-blue-500 hover:bg-blue-900 shadow-xl text-white"
            >
              Sign In Now
            </button>
          )}
          <div className="flex items-center justify-center space-x-2">
            <hr className="border-gray-400 flex-grow" />
            <span className="text-center text-gray-400">Or</span>
            <hr className="border-gray-400 flex-grow" />
          </div>

          {/* {googleLoading ? (
            <SmallLoader />
          ) : ( */}
            <div
              id="sign"
              className="flex items-center justify-center w-full  rounded text-sm "
            >
              Sign In Using Google
              <span className="ml-2">
                {" "}
                <FcGoogle />
              </span>
            </div>
           {/* )}  */}

          <p className="text-center text-gray-500">
            Don't have an account yet?
            <Link
              className="underline text-blue-600 hover:text-blue-800 font-semibold px-2"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;

const SmallLoader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-4 border-gray-800 border-t-white rounded-full animate-spin"></div>
    </div>
  );
};
