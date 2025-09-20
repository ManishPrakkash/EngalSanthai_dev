
import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icon.tsx';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div 
      role="alert"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 min-w-[280px] max-w-sm w-full p-4 rounded-xl shadow-lg flex items-center space-x-3 animate-fade-in-down ${bgColor} ${textColor}`}
    >
      <div className={`flex-shrink-0 ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-semibold text-sm">{message}</p>
    </div>
  );
};

export default Toast;