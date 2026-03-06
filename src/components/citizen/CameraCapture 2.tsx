'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setCapturedFile(file);
    },
    []
  );

  const handleRetake = useCallback(() => {
    setPreview(null);
    setCapturedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleConfirm = useCallback(() => {
    if (capturedFile && preview) {
      onCapture(capturedFile, preview);
    }
  }, [capturedFile, preview, onCapture]);

  return (
    <div className="w-full">
      {/* Hidden file input — triggers native camera on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.button
            key="capture"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 bg-gray-900 rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 active:opacity-80 transition-opacity"
            aria-label="Take a photo of the issue"
          >
            <div className="w-20 h-20 bg-[#1e3a8a] rounded-full flex items-center justify-center shadow-lg">
              <Camera size={40} color="white" />
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-bold">Take a Photo</p>
              <p className="text-gray-400 text-base mt-1">Tap to open camera</p>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            {/* Photo preview */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Issue photo preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 h-14 bg-gray-100 rounded-2xl text-gray-700 font-semibold text-lg active:opacity-70 transition-opacity"
                aria-label="Retake photo"
              >
                <RotateCcw size={22} />
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 h-14 bg-[#16a34a] rounded-2xl text-white font-semibold text-lg active:opacity-70 transition-opacity shadow-md"
                aria-label="Use this photo"
              >
                <Check size={22} />
                Use Photo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
