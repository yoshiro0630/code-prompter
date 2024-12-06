import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorLogger from './services/errorLogging/ErrorLogger';

// Initialize error logging
ErrorLogger.loadLogs();

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  if (error) {
    ErrorLogger.logError(error, {
      source,
      line: lineno,
      column: colno
    });
  }
  return false;
};

// Global handler for unhandled promise rejections
window.onunhandledrejection = (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  ErrorLogger.logError(error, {
    type: 'unhandled_promise_rejection'
  });
};

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster position="top-right" />
    </ErrorBoundary>
  </React.StrictMode>
);