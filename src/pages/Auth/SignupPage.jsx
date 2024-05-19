import React, { useEffect } from "react";
import bcimage from "../../assets/OBJECTS.png";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { userRegisterValidationSchema } from "../../util/validation";
import usePasswordToggle from "../../hook/usePasswordToggle";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/tokenSlice";
import { setUserDetails } from "../../store/userDetails";

function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const apiURL = process.env.REACT_APP_API_URL;

  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userRegisterValidationSchema),
  });

  const submitHandler = async (formData) => {
    if (formData) {
      axios
        .post(`${apiURL}/auth/register`, formData)
        .then((res) => {
          toast.success("Sign Up Success");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((err) => {
          toast.error("Invalid Credentials");
          console.log(err);
        });
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
        `${process.env.REACT_APP_API_URL}/auth/google-register`,
        user
      );
      if (response.status === 200) {
        toast.success("Registered successfully");
        const { token, role, id, userDetails, departments } =
          response.data.responseData;

        const data = {
          token,
          role,
          id,
        };
        console.log(response.data);
        dispatch(setToken(data));
        dispatch(
          setUserDetails({ ...userDetails, departments: departments || [] })
        );
        setTimeout(() => {
          if (role === "user") {
            navigate("/");
          } else {
            navigate("/admin");
          }
        }, 2000);
      } else {
        toast.error("An error occurred during registration.");
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
    <div className="flex flex-col md:flex-row bg-blue-50 w-full h-full">
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
      <div className="w-full md:w-1/2 h-full flex flex-col p-4 md:p-14">
        <h1 className="pt-10 font-bold">
          Sign up and Discover a Great amount of new Opportunities
        </h1>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2">
              <label className="text-sm font-semibold">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                {...register("firstname")}
                className="w-full h-10 bg-white text-sm rounded px-3 mt-2 focus:outline-blue-900"
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <label className="text-sm font-semibold">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                {...register("lastname")}
                className="w-full h-10 bg-white text-sm rounded px-3 mt-2 focus:outline-blue-900"
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className="w-full h-10 bg-white text-sm rounded shadow-lg px-3 mt-2 focus:outline-blue-900"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="relative">
            <label className="text-sm font-semibold">Create Password</label>
            <input
              type={PasswordInputType}
              placeholder="Enter your password"
              {...register("password")}
              className="w-full h-10 bg-white text-sm rounded shadow-lg px-3 mt-2 focus:outline-blue-900"
            />
            <div className="absolute inset-y-0 right-0 text-2xl top-8 flex items-center pr-3">
              {ToggleIcon}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="relative">
            <label className="text-sm font-semibold">Confirm Password</label>
            <input
              type={PasswordInputType}
              placeholder="Re-enter your password"
              {...register("confirmPassword")}
              className="w-full h-10 bg-white text-sm rounded shadow-lg px-3 mt-2 focus:outline-blue-900"
            />
            <div className="absolute inset-y-0 right-0 text-2xl top-8 flex items-center pr-3">
              {ToggleIcon}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button className="w-full h-10 rounded text-sm transition duration-300 ease-in-out bg-blue-900 hover:bg-indigo-500 text-white shadow-xl">
            Sign Up Now
          </button>
          <div className="flex items-center justify-center space-x-2">
            <hr className="border-gray-400 flex-grow" />
            <span className="text-center text-gray-400">Or</span>
            <hr className="border-gray-400 flex-grow" />
          </div>
          <button
            id="sign"
            className="flex items-center justify-center w-full  rounded text-sm "
          >
            Sign In Using Google
            <span className="ml-2">
              {" "}
              <FcGoogle />
            </span>
          </button>
          <p className="text-center text-gray-500">
            Already have an account?
            <Link
              className="underline text-blue-600 hover:text-blue-800 font-semibold px-2"
              to="/login"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignupPage;
