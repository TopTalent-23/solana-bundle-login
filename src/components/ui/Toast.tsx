'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { useUIStore } from '@/store';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-primary',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastProps {
  toast: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
  };
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const Icon = iconMap[toast.type];
  const colorClass = colorMap[toast.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 500 }}
      className="bg-card border border-border rounded-xl shadow-lg p-4 min-w-[300px] max-w-md"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${colorClass} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}; 