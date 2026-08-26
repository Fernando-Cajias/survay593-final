import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#1E293B] border border-slate-700/60 rounded-stitch-lg shadow-2xl p-6 overflow-hidden z-10 animate-scale-in`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-stitch hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-slate-200 text-sm max-h-[75vh] overflow-y-auto pr-1">{children}</div>

        {footer && <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};
