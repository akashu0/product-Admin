import React from "react";

function Spinner() {
  return (
    <div className="w-full h-[50vh] flex justify-center items-center mt-2 overflow-auto">
      <div className="border-t-4 border-blue-900 rounded-full animate-spin w-12 h-12"></div>
    </div>
  );
}

export default Spinner;
