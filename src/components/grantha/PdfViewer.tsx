"use client";

import React from 'react';
import { FileText } from 'lucide-react';

interface PdfViewerProps {
    url: string;
    className?: string;
}

/**
 * Inline PDF viewer using iframe.
 * Simple and widely supported — can be upgraded to react-pdf later if
 * page-by-page navigation or thumbnail strips are needed.
 */
export default function PdfViewer({ url, className }: PdfViewerProps) {
    if (!url) {
        return (
            <div className={`flex flex-col items-center justify-center text-ink/30 py-16 ${className || ''}`}>
                <FileText className="w-10 h-10 mb-3" />
                <p className="font-serif text-[14px]">No document to display</p>
            </div>
        );
    }

    return (
        <iframe
            src={url}
            className={`w-full border-0 ${className || ''}`}
            style={{ minHeight: 600 }}
            title="PDF Report Viewer"
        />
    );
}
