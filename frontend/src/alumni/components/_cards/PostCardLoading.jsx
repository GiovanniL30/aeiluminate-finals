import React from "react";

const PostCardLoading = () => {
  return (
    <div className="w-full flex flex-col gap-5 border-[1px] rounded-lg bg-gray-200 animate-pulse">
      <div className="flex justify-between pt-4 px-4">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
          <button className="w-6 h-6 bg-gray-300 rounded animate-pulse"></button>
        </div>
      </div>

      <div className="h-fit max-h-[500px] min-h-[250px] bg-gray-300 animate-pulse"></div>

      <div className="flex items-center px-4 gap-6">
        <button className="w-6 h-6 bg-gray-300 rounded animate-pulse"></button>
        <button className="w-6 h-6 bg-gray-300 rounded animate-pulse"></button>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default PostCardLoading;
