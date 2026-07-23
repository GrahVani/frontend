import React, { Component, ErrorInfo, ReactNode } from "react";
import { recoveryManager } from "../../../lib/learning-runtime/profile/runtime-recovery-manager";
import { detectRuntimeFailures } from "../../../lib/learning-runtime/profile/recovery-engine";
import { Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TutorRuntimeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Detect failure and log it in the recovery manager
    const failures = detectRuntimeFailures([error], "TutorRuntimeErrorBoundary");
    // We mock a recovery action since we are catching at the boundary
    recoveryManager["recordFailureAndAction"]?.(failures[0], {
      id: `action_${failures[0].id}_boundary`,
      strategy: "fallback",
      description: "Caught React rendering error. Showing graceful fallback UI.",
      successProbability: 100
    });
    console.error("Tutor Runtime Error Caught:", error, errorInfo);
  }

  private handleRetry = () => {
    recoveryManager.clearRecoveryHistory();
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-80 sm:w-[400px] bg-slate-900/60 border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl h-full p-6 items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Runtime Recovering</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-[280px]">
            The AI Tutor encountered an unexpected rendering fault and gracefully degraded. Your learning progress is safe.
          </p>

          <div className="bg-slate-900/50 rounded-lg p-3 text-left w-full mb-6 border border-slate-700/50">
            <span className="text-xs font-mono text-red-300 block mb-1">FAULT DETECTED:</span>
            <span className="text-xs text-slate-300 line-clamp-3">
              {this.state.error?.message || "Unknown rendering exception."}
            </span>
          </div>

          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Restore Tutor Session
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
