import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import PromptBuilder from './components/prompt/PromptBuilder';
import APIKeyManager from './components/APIKeyManager';
import { useAPIStore } from './stores/apiStore';
import { useProjectStore } from './stores/projectStore';
import { useThemeStore } from './stores/themeStore';
import HomePage from './components/HomePage';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const { showAPISettings } = useAPIStore();
  const { currentProject } = useProjectStore();
  const { isDark } = useThemeStore();

  // Apply dark mode class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {currentProject ? (
        <PromptBuilder />
      ) : (
        <HomePage />
      )}
      {showAPISettings && <APIKeyManager />}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white',
          style: {
            border: isDark ? '1px solid rgb(55, 65, 81)' : '1px solid rgb(229, 231, 235)',
            boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      />
    </div>
  );
};

export default App;