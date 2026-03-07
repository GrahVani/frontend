"use client";

import React from "react";
import ErrorState from "./ErrorState";
import { captureException } from "@/lib/monitoring";

interface ChartErrorBoundaryProps {
    children: React.ReactNode;
    section?: string;
    compact?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ChartErrorBoundary extends React.Component<ChartErrorBoundaryProps, State> {
    constructor(props: ChartErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        captureException(error, {
            tags: { boundary: 'chart', section: this.props.section || 'unknown' },
            extra: { componentStack: errorInfo.componentStack },
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorState
                    title={this.props.section ? `${this.props.section} Error` : "Chart Error"}
                    message="This section encountered an error during rendering. Try refreshing or contact support if it persists."
                    onRetry={this.handleRetry}
                    retryLabel="Reload Section"
                    compact={this.props.compact}
                />
            );
        }

        return this.props.children;
    }
}
