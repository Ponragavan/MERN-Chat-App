import React from "react";

const Spinner = ({ size = "sm", layout = 'min-h-screen' }) => {
  const spinnerSize = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex items-center justify-center ${layout}`}>
      <span
        className={`${spinnerSize[size]} rounded-full border-2 border-gray-900 border-r-transparent animate-spin`}
      ></span>
    </div>
  );
};

export default Spinner;
