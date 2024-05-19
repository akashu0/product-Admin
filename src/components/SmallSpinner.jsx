// SmallSpinner.js
import React from "react";

const SmallSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100/100">
      <div className="border-t-4 border-blue-900 animate-spin rounded-full w-12 h-12"></div>
    </div>
  );
};

export default SmallSpinner;
