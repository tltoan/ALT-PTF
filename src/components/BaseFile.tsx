import React from 'react';

interface BaseFileProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  meta?: string;
}

const BaseFile: React.FC<BaseFileProps> = ({
  children,
  className = '',
  onClick,
  fillColor = 'white',
  strokeColor = 'black',
  strokeWidth = 2,
  meta,
}) => {
  return (
    <div 
      className={`relative w-full h-full ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <svg 
        viewBox="0 0 1512 982" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path 
          d="M 186 927.671875 L 1489 925.671875 L 1490 112.171875 L 261 110.171875 L 261 699.171875 L 187 732.171875 L 186 927.171875 Z" 
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </svg>
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col p-8">
        {/* Top section for title/header */}
        <div className="flex-none mb-4">
          {/* Header content will go here */}
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        
        {/* Bottom section for footer/actions */}
        <div className="flex-none mt-4">
          {/* Footer content will go here */}
        </div>
      </div>
    </div>
  );
};

export default BaseFile;