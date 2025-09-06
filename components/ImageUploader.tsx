import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasImage: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onAnalyze, isAnalyzing, hasImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else {
      setImagePreview(null);
      onImageSelect(null);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-4 overflow-hidden">
        {imagePreview ? (
          <img src={imagePreview} alt="Plant leaf preview" className="h-full w-full object-contain" />
        ) : (
          <div className="text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Image preview will appear here</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={handleSelectClick}
          className="w-full sm:w-1/2 text-center bg-white hover:bg-gray-100 text-green-700 font-semibold py-3 px-4 border border-green-600 rounded-lg shadow-sm transition-colors duration-200"
        >
          {hasImage ? 'Change Image' : 'Select Image'}
        </button>
        <button
          onClick={onAnalyze}
          disabled={!hasImage || isAnalyzing}
          className="w-full sm:w-1/2 text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
