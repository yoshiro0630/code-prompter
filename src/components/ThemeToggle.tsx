import React, { useCallback } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '../stores/themeStore';

const ThemeToggle: React.FC = () => {
  const { isDark, setTheme } = useThemeStore();

  const handleToggle = useCallback(() => {
    setTheme(!isDark);
  }, [isDark, setTheme]);

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-500" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      )}
    </button>
  );
};

export default ThemeToggle;