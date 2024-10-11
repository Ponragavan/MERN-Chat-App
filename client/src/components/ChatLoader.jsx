import React from 'react';

const ChatLoader = () => {
  return (
    <div className="flex flex-col space-y-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex items-center h-16 gap-3 p-3 bg-white rounded-md shadow animate-pulse"
        >
          {/* Placeholder for avatar */}
          <div className="bg-slate-300 rounded-full h-12 w-12"></div>

          {/* Placeholder for chat text */}
          <div className="flex flex-col space-y-2 w-full">
            <div className="h-4 bg-slate-300 rounded w-3/4"></div>
            <div className="h-4 bg-slate-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatLoader;
