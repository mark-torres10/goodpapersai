"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg border shadow-lg z-50 ${styles[type]} animate-in slide-in-from-bottom-2`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">{icons[type]}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 ml-2 text-xl leading-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

