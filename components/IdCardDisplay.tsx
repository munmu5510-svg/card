
import React from 'react';
import Spinner from './Spinner';

interface IdCardDisplayProps {
  imageData: string | null;
  isLoading: boolean;
  error: string | null;
}

const IdCardDisplay: React.FC<IdCardDisplayProps> = ({ imageData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner large />
        <p className="mt-4 text-lg text-gray-300">L'IA crée votre carte d'identité...</p>
        <p className="text-sm text-gray-500">Cela peut prendre un moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Erreur de Génération</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (imageData) {
    return (
      <div className="w-full max-w-lg p-2 bg-gray-900 rounded-lg shadow-2xl">
        <img 
          src={imageData} 
          alt="Generated ID Card" 
          className="w-full h-auto object-contain rounded-md"
        />
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <div className="w-24 h-24 mx-auto mb-4 border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-400">Votre carte d'identité apparaîtra ici.</h3>
      <p className="mt-1">Remplissez les informations et générez votre carte.</p>
    </div>
  );
};

export default IdCardDisplay;
