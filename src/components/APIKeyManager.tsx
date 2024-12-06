import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAPIStore } from '../stores/apiStore';
import { validateApiKey } from '../utils/encryption';
import { toast } from 'react-hot-toast';

const APIKeyManager: React.FC = () => {
  const { apiKey, updateAPIKey } = useAPIStore();
  const [tempKey, setTempKey] = useState(apiKey);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!validateApiKey(tempKey)) {
      toast.error('Please provide a valid OpenAI API key');
      return;
    }

    setIsSaving(true);
    try {
      updateAPIKey(tempKey);
      useAPIStore.setState({ showAPISettings: false });
      toast.success('API key saved successfully');
    } catch (error) {
      toast.error('Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={useAPIStore.getState().showAPISettings}
      onClose={() => useAPIStore.setState({ showAPISettings: false })}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">API Settings</Dialog.Title>
            <button
              onClick={() => useAPIStore.setState({ showAPISettings: false })}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="sk-..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => useAPIStore.setState({ showAPISettings: false })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default APIKeyManager;