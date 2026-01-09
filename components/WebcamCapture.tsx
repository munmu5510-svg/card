
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  capturedImage: string | null;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, capturedImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les autorisations.");
    }
  }, [stream]);

  useEffect(() => {
    if (!capturedImage) {
        startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const handleRetake = () => {
    onCapture('');
    startCamera();
  };

  return (
    <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center border-2 border-dashed border-gray-600">
      {error && <p className="text-red-400 text-center p-4">{error}</p>}
      
      {!error && (
        <>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            {capturedImage ? (
              <button
                onClick={handleRetake}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors"
              >
                Reprendre
              </button>
            ) : (
              <button
                onClick={handleCapture}
                className="p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-400 transition-colors transform hover:scale-110"
                aria-label="Capture photo"
              >
                <CameraIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
