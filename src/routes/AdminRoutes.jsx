import React from "react";
import { Route, Routes } from "react-router-dom";
import CompanyPage from "../pages/CompanyPage/CompanyPage";
import AdminHomePage from "../pages/Home/AdminHomePage";
import ProductPage from "../pages/Product/ProductPage";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<AdminHomePage />} />
      <Route path="/addcompany" element={<CompanyPage />} />
      <Route path="/addproduct" element={<ProductPage />} />
    </Routes>
  );
}

export default AdminRoutes;
