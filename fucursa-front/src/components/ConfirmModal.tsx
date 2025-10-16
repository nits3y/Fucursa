'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

/**
 * Beautiful confirmation modal component
 * Replaces default browser confirm() dialog with a modern, styled modal
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Called when modal is closed without confirmation
 * @param onConfirm - Called when user confirms the action
 * @param title - Modal title text
 * @param message - Confirmation message to display
 * @param confirmText - Text for confirm button (default: "Confirm")
 * @param cancelText - Text for cancel button (default: "Cancel")
 * @param isDangerous - If true, uses red/destructive styling for confirm button
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle confirm action
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-xl rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] w-full max-w-md border-2 border-slate-700/50 transform transition-all animate-in zoom-in-95 duration-200">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60"></div>
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-40"></div>
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-40"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-red-900/20 to-orange-900/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg blur opacity-60"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-2.5 rounded-lg shadow-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="group relative text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
          >
            <X className="h-5 w-5 relative z-10" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 rounded-lg transition-all duration-300"></div>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer with buttons */}
        <div className="flex justify-end space-x-3 px-5 py-4 bg-slate-800/30 rounded-b-2xl border-t border-slate-700/50">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50 font-medium text-sm"
          >
            <span className="relative z-10">{cancelText}</span>
          </button>

          {/* Confirm Button - Changes style based on isDangerous */}
          {isDangerous ? (
            <button
              onClick={handleConfirm}
              className="group relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-red-600 via-red-600 to-orange-600 hover:from-red-500 hover:via-red-500 hover:to-orange-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transform hover:-translate-y-0.5 transition-all duration-300 border border-red-400/30"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/30 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{confirmText}</span>
              </span>
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="group relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 border border-blue-400/30"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10">{confirmText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

