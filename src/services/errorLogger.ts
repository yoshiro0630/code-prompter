import { toast } from 'react-hot-toast';

interface ErrorLogEntry {
  timestamp: string;
  error: Error;
  context?: Record<string, any>;
}

class ErrorLogger {
  private static logs: ErrorLogEntry[] = [];
  private static readonly MAX_LOGS = 100;

  static log(error: Error, context: Record<string, any> = {}): void {
    // Add to logs array
    this.logs.unshift({
      timestamp: new Date().toISOString(),
      error,
      context
    });

    // Keep only the last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', {
        message: error.message,
        stack: error.stack,
        context
      });
    }

    // Show toast notification
    toast.error(error.message);
  }

  static getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static getLastError(): ErrorLogEntry | undefined {
    return this.logs[0];
  }
}

export default ErrorLogger;