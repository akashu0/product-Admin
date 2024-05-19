import React from "react";
import CommonNavbar from "../../components/NavBar/CommonNavbar";
import Sidebar from "../../components/SideBar/Sidebar";
// import LandingComponents from "../../components/LandingComponents/LandingComponents";
import { Route, Routes } from "react-router-dom";
import Landing from "../../components/LandingComponents/Landing";

function HomePage() {
  return (
    <>
      <CommonNavbar />
      <Sidebar />
      <div className="md:ml-[230px] md:pl-5 pt-16 bg-blue-50 min-h-screen ">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </>
  );
}

export default HomePage;
