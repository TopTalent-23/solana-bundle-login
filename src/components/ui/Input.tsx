'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    containerClassName = '',
    className = '',
    ...props 
  }, ref) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl border-2 bg-background
              focus:outline-none transition-colors text-base
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${error 
                ? 'border-error focus:border-error' 
                : 'border-border focus:border-primary'
              }
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className={`mt-2 text-sm flex items-center gap-1 ${error ? 'text-error' : 'text-muted-foreground'}`}>
            {error && <AlertCircle className="w-4 h-4" />}
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 