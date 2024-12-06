import { toast } from 'react-hot-toast';

interface ErrorLog {
  timestamp: string;
  error: Error;
  context: Record<string, any>;
}

class ErrorLogger {
  private static logs: ErrorLog[] = [];
  private static readonly MAX_LOGS = 100;

  static log(error: Error, context: Record<string, any> = {}) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error,
      context
    };

    // Add to logs array
    this.logs.unshift(errorLog);
    
    // Keep only the last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Log:', {
        message: error.message,
        stack: error.stack,
        context
      });
    }

    // Show toast notification
    toast.error(`Error: ${error.message}`);

    return errorLog;
  }

  static getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  static clearLogs() {
    this.logs = [];
  }

  static getLastError(): ErrorLog | undefined {
    return this.logs[0];
  }
}

export default ErrorLogger;