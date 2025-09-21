
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', size = 'md', ...props }) => {
  const sizeClasses = {
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg shadow-sm transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
