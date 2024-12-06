import { toast } from 'react-hot-toast';

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  type: 'error' | 'warning';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  component?: string;
  handled: boolean;
  retryCount?: number;
}

class ErrorLogger {
  private static logs: ErrorLogEntry[] = [];
  private static readonly MAX_LOGS = 100;
  private static readonly STORAGE_KEY = 'bolt_error_logs';
  private static readonly MAX_RETRIES = 3;

  static logError(error: Error, context?: Record<string, any>, component?: string): ErrorLogEntry {
    const entry: ErrorLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      component,
      handled: false,
      retryCount: 0
    };

    this.addLog(entry);
    this.persistLogs();
    
    // Show toast notification in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', {
        message: error.message,
        stack: error.stack,
        context,
        component
      });
    }

    // Show user-friendly error message
    const userMessage = this.getUserFriendlyMessage(error, component);
    toast.error(userMessage);

    return entry;
  }

  static logWarning(message: string, context?: Record<string, any>, component?: string): ErrorLogEntry {
    const entry: ErrorLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: 'warning',
      message,
      context,
      component,
      handled: false
    };

    this.addLog(entry);
    this.persistLogs();

    if (process.env.NODE_ENV === 'development') {
      console.warn('Warning:', { message, context, component });
    }

    return entry;
  }

  private static addLog(entry: ErrorLogEntry): void {
    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }
  }

  private static persistLogs(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to persist error logs:', error);
    }
  }

  static loadLogs(): void {
    try {
      const savedLogs = localStorage.getItem(this.STORAGE_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Failed to load error logs:', error);
    }
  }

  static getLogs(filter?: { type?: 'error' | 'warning'; handled?: boolean }): ErrorLogEntry[] {
    return this.logs.filter(log => {
      if (filter?.type && log.type !== filter.type) return false;
      if (filter?.handled !== undefined && log.handled !== filter.handled) return false;
      return true;
    });
  }

  static markAsHandled(id: string): void {
    const log = this.logs.find(l => l.id === id);
    if (log) {
      log.handled = true;
      this.persistLogs();
    }
  }

  static clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getUnhandledErrors(): ErrorLogEntry[] {
    return this.logs.filter(log => log.type === 'error' && !log.handled);
  }

  static getSummary(): { errors: number; warnings: number; unhandled: number } {
    return {
      errors: this.logs.filter(log => log.type === 'error').length,
      warnings: this.logs.filter(log => log.type === 'warning').length,
      unhandled: this.getUnhandledErrors().length
    };
  }

  static canRetry(error: Error): boolean {
    const lastError = this.logs.find(log => 
      log.message === error.message && 
      log.type === 'error'
    );

    return !lastError || (lastError.retryCount || 0) < this.MAX_RETRIES;
  }

  static incrementRetryCount(error: Error): void {
    const lastError = this.logs.find(log => 
      log.message === error.message && 
      log.type === 'error'
    );

    if (lastError) {
      lastError.retryCount = (lastError.retryCount || 0) + 1;
      this.persistLogs();
    }
  }

  private static getUserFriendlyMessage(error: Error, component?: string): string {
    // Rate limit errors
    if (error.message.includes('rate_limit_exceeded')) {
      return 'Rate limit exceeded. Please try again in a few moments.';
    }

    // API key errors
    if (error.message.includes('api_key')) {
      return 'Invalid API key. Please check your settings.';
    }

    // Network errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }

    // Component-specific errors
    switch (component) {
      case 'DocumentUpload':
        return 'Failed to process document. Please try again with a different file.';
      case 'ProjectPromptService':
        return 'Failed to generate prompts. Please try again.';
      default:
        return error.message;
    }
  }
}

export default ErrorLogger;