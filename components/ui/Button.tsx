import React from 'react';
import { playClick } from '../../services/sound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  onClick,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    outline: "border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 shadow-sm"
  };

  const widthClass = fullWidth ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};