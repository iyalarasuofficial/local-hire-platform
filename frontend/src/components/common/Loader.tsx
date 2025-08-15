import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0  bg-opacity-70 flex flex-col items-center justify-center z-[99]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-b-4 border-green-300"></div>
      <span className="text-green-600 mt-4 font-medium text-lg tracking-wide">Loading...</span>
    </div>
  );
};

export default Loader;
