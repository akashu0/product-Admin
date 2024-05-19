import React from "react";

import AdminSidebar from "../../components/SideBar/AdminSidebar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import { Route, Routes } from "react-router-dom";
import Landing from "../../components/LandingComponents/Landing";
import ProductList from "../../components/Admin/Products/ProductList";

function AdminHomePage() {
  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="md:ml-[230px] md:pl-5 pt-16  bg-blue-50 min-h-screen ">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminHomePage;
