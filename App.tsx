import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import Loader from './components/Loader';
import { analyzePlantImage, fileToBase64 } from './services/geminiService';
import type { DiseaseInfo } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DiseaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await analyzePlantImage(base64, mimeType);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-green-50/50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">Identify Plant Diseases with AI</h2>
          <p className="text-gray-600 mb-8 md:text-lg">
            Upload a photo of a plant leaf, and our AI will analyze it for diseases, offering expert advice in seconds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
          <ImageUploader
            onImageSelect={handleImageSelect}
            onAnalyze={handleAnalyzeClick}
            isAnalyzing={isLoading}
            hasImage={!!imageFile}
          />
        </div>

        {isLoading && <Loader />}

        {error && (
          <div className="max-w-2xl mx-auto mt-8 text-center p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        
        <div className="mt-8">
            <AnalysisResult result={analysisResult} />
        </div>
      </main>
    </div>
  );
};

export default App;
