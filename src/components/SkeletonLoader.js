import React from 'react';

const SkeletonLoader = ({ 
  type = 'card', 
  className = '',
  lines = 3 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-300 h-12 w-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
              <div 
                key={i} 
                className={`h-4 bg-gray-300 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
              ></div>
            ))}
          </div>
        );
      
      case 'button':
        return (
          <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-full"></div>
        );
      
      case 'avatar':
        return (
          <div className="h-12 w-12 bg-gray-300 rounded-full animate-pulse"></div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;
