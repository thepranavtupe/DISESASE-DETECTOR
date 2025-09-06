import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
      <p className="text-green-800 mt-4 text-lg">Analyzing your plant...</p>
    </div>
  );
};

export default Loader;
