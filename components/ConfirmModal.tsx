import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}: ConfirmModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-surface-container"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-surface-container flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
                <span className="material-symbols-outlined">
                  {isDestructive ? 'warning' : 'info'}
                </span>
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-xl font-bold text-on-surface">
                  {title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-surface-container-lowest">
              <p className="text-secondary text-body-lg leading-relaxed">
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-surface flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-surface-container">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg font-headline-md font-semibold text-secondary hover:bg-surface-container-high transition-colors w-full sm:w-auto"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-5 py-2.5 rounded-lg font-headline-md font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-95 w-full sm:w-auto ${
                  isDestructive
                    ? 'bg-error hover:bg-error/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
