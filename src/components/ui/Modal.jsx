import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-3 sm:p-4 relative w-full max-w-xs sm:max-w-sm mx-2 max-h-[90vh] overflow-y-auto animate-modalIn font-sans"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xl sm:text-2xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="mt-1 sm:mt-2">{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s; }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-modalIn { animation: modalIn 0.22s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
    </div>
  );
};

export default Modal; 