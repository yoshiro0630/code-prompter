import React from 'react';

interface VersionBadgeProps {
  version: number;
  timestamp: string;
  isLatest?: boolean;
}

const VersionBadge: React.FC<VersionBadgeProps> = ({ version, timestamp, isLatest }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded text-sm ${
        isLatest 
          ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white'
          : 'bg-gray-700 text-gray-300'
      }`}>
        v{version}
      </span>
      {isLatest && (
        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
          Latest
        </span>
      )}
      <span className="text-xs text-gray-400">
        {new Date(timestamp).toLocaleString()}
      </span>
    </div>
  );
};

export default VersionBadge;