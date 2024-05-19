import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const usePasswordToggle = () => {
  const [visible, setVisibility] = useState(false);

  const Icon = visible ? (
    <IoEye
      className="cursor-pointer bg-transparent text-blue-900"
      onClick={() => setVisibility(!visible)}
    />
  ) : (
    <IoMdEyeOff
      className="cursor-pointer bg-transparent "
      onClick={() => setVisibility(!visible)}
    />
  );
  const inputType = visible ? "text" : "password";

  return [inputType, Icon];
};

export default usePasswordToggle;
