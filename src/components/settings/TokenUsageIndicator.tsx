import React from 'react';

interface TokenUsageIndicatorProps {
  used: number;
  limit: number;
}

const TokenUsageIndicator: React.FC<TokenUsageIndicatorProps> = ({ used, limit }) => {
  const percentage = Math.min((used / limit) * 100, 100);
  const isWarning = percentage > 80;
  const isError = percentage > 95;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Tokens Used</span>
        <span className={`font-medium ${
          isError ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gray-200'
        }`}>
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isError
              ? 'bg-red-500'
              : isWarning
              ? 'bg-yellow-500'
              : 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {(isWarning || isError) && (
        <p className={`text-xs ${isError ? 'text-red-400' : 'text-yellow-400'}`}>
          {isError
            ? 'Token limit exceeded. Consider reducing input or increasing limit.'
            : 'Approaching token limit. Consider optimizing input.'}
        </p>
      )}
    </div>
  );
};

export default TokenUsageIndicator;