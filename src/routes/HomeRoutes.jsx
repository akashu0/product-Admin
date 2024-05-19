import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import SignupPage from "../pages/Auth/SignupPage";
import LoginPage from "../pages/Auth/LoginPage";

function HomeRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/viewproduct/:id" element={<SingleProductPage />} />
    <Route path="/joinprolio" element={<JoinPage />} />
    <Route path="/tem" element={<Template />} /> */}
    </Routes>
  );
}

export default HomeRoutes;
