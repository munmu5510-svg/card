
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import WebcamCapture from './components/WebcamCapture';
import IdCardDisplay from './components/IdCardDisplay';
import Spinner from './components/Spinner';
import { CameraIcon } from './components/icons/CameraIcon';
import { UserIcon } from './components/icons/UserIcon';
import { GlobeIcon } from './components/icons/GlobeIcon';
import { generateIdCard } from './services/geminiService';
import { dataUrlToBlobData } from './utils/imageUtils';

const App: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedIdCard, setGeneratedIdCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = capturedImage && firstName && lastName && nationality;

  const handleGenerateClick = useCallback(async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setGeneratedIdCard(null);

    try {
      const imageBlobData = dataUrlToBlobData(capturedImage);
      if (!imageBlobData) {
        throw new Error("Format d'image non valide.");
      }
      const generatedImageBase64 = await generateIdCard(imageBlobData, firstName, lastName, nationality);
      setGeneratedIdCard(`data:image/png;base64,${generatedImageBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue lors de la génération de la carte.");
    } finally {
      setIsLoading(false);
    }
  }, [capturedImage, firstName, lastName, nationality, isFormValid]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Générateur de Carte d'Identité IA
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Créez une carte d'identité fictive en quelques secondes.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center">
              <UserIcon className="h-6 w-6 mr-3" />
              1. Entrez vos informations
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-300 mb-1">
                  <GlobeIcon className="h-5 w-5 mr-2 inline-block" />
                  Nationalité
                </label>
                <input
                  type="text"
                  id="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Française"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-teal-400 flex items-center">
              <CameraIcon className="h-6 w-6 mr-3" />
              2. Capturez votre visage
            </h2>
            <WebcamCapture onCapture={setCapturedImage} capturedImage={capturedImage} />

            <div className="mt-8">
              <button
                onClick={handleGenerateClick}
                disabled={!isFormValid || isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Génération en cours...</span>
                  </>
                ) : (
                  "Générer la Carte d'Identité"
                )}
              </button>
            </div>
          </div>

          {/* Result Column */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center min-h-[400px] lg:min-h-full">
            <IdCardDisplay 
              imageData={generatedIdCard} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
