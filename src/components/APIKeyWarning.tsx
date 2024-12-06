import React from 'react';
import { ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAPIStore } from '../stores/apiStore';

const APIKeyWarning: React.FC = () => {
  const { activeProvider } = useAPIStore();
  
  const providerInfo = {
    openai: {
      name: 'OpenAI',
      url: 'https://platform.openai.com/api-keys',
      keyFormat: 'sk-...'
    },
    anthropic: {
      name: 'Anthropic',
      url: 'https://console.anthropic.com/account/keys',
      keyFormat: 'sk-ant-...'
    }
  };

  const provider = providerInfo[activeProvider as keyof typeof providerInfo];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm m-4">
      <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        API Key Required
      </h3>
      <p className="text-gray-500 mb-4 max-w-md">
        To use this application, you need to provide your {provider.name} API key. Your key is stored securely in your browser and never sent to our servers.
      </p>
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <ShieldCheckIcon className="h-5 w-5 text-green-500" />
        <span>Your API key is encrypted and stored locally</span>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => useAPIStore.setState({ showAPISettings: true })}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Configure API Key
        </button>
        <a
          href={provider.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-blue-600 hover:text-blue-800"
        >
          Get an API key from {provider.name} →
        </a>
      </div>
    </div>
  );
};

export default APIKeyWarning;