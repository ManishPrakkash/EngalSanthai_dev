
import React from 'react';
import { XMarkIcon } from './Icon.tsx';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div 
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in-down"
        onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg shadow-xl p-2" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute -top-3 -right-3 z-10 p-1.5 bg-white text-slate-800 rounded-full shadow-lg hover:bg-slate-200"
            aria-label="Close image preview"
        >
            <XMarkIcon className="h-6 w-6"/>
        </button>
        <img src={imageUrl} alt="Payment Screenshot Preview" className="max-w-[90vw] max-h-[90vh] rounded-md"/>
      </div>
    </div>
  );
};

export default ImagePreviewModal;