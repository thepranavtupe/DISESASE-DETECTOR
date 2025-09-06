import React from 'react';
import type { DiseaseInfo } from '../types';

interface AnalysisResultProps {
  result: DiseaseInfo | null;
}

// FIX: Replaced `JSX.Element` with `React.ReactNode` for the icon prop type to resolve the TypeScript error.
const InfoCard: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
    <div className="flex items-center mb-3">
      <div className="text-green-600 mr-3">{icon}</div>
      <h3 className="text-xl font-bold text-green-900">{title}</h3>
    </div>
    <div className="text-gray-700 space-y-2">{children}</div>
  </div>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);


const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  if (result.isHealthy) {
    return (
      <div className="max-w-2xl mx-auto">
        <InfoCard title="Plant is Healthy!" icon={<CheckCircleIcon/>}>
          <p>{result.healthyMessage || "Our AI analysis indicates that your plant appears to be healthy and free of common diseases."}</p>
        </InfoCard>
      </div>
    );
  }

  if (result.diseaseName) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center p-6 bg-yellow-100 border-2 border-yellow-300 rounded-xl">
          <h2 className="text-2xl font-bold text-yellow-800">Disease Detected: {result.diseaseName}</h2>
        </div>

        <InfoCard title="Description" icon={<ShieldExclamationIcon/>}>
          <p>{result.description}</p>
        </InfoCard>

        {result.treatmentSuggestions && result.treatmentSuggestions.length > 0 && (
          <InfoCard title="Treatment Suggestions" icon={<SparklesIcon/>}>
            <ul className="list-disc list-inside space-y-2">
              {result.treatmentSuggestions.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </InfoCard>
        )}

        {result.preventativeCare && result.preventativeCare.length > 0 && (
          <InfoCard title="Preventative Care" icon={<CheckCircleIcon/>}>
            <ul className="list-disc list-inside space-y-2">
              {result.preventativeCare.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </InfoCard>
        )}
      </div>
    );
  }

  if (result.error) {
     return (
        <div className="max-w-2xl mx-auto mt-8 text-center p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
            <p><strong>Analysis Failed:</strong> {result.error}</p>
        </div>
     )
  }

  return null;
};

export default AnalysisResult;