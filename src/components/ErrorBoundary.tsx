import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReboot = () => {
    // Attempt recovery by simply reloading the page which guarantees clean state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background FX */}
          <div className="absolute inset-0 z-0 bg-grid opacity-20 animate-flash-error pointer-events-none"></div>
          
          <div className="glass-panel max-w-2xl w-full p-8 relative z-10 border-soft-orange/30 shadow-[0_0_50px_rgba(255,159,67,0.1)] flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-soft-orange/10 border border-soft-orange/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,159,67,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-soft-orange">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Critical System Failure</h1>
            <p className="text-gray-400 mb-8 max-w-lg">
              The Enterprise RPA Monitor encountered an unrecoverable exception in the UI rendering thread. State engine halted to prevent data corruption.
            </p>
            
            <div className="w-full bg-black/40 rounded-lg border border-white/5 p-4 text-left overflow-auto max-h-48 custom-scrollbar mb-8">
              <p className="text-soft-orange font-mono text-sm font-bold mb-2">{this.state.error?.toString()}</p>
              <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <button 
              onClick={this.handleReboot}
              className="px-8 py-3 bg-electric-blue/10 hover:bg-electric-blue text-electric-blue hover:text-navy border border-electric-blue/50 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)]"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
