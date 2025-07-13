'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}) => {
  const Component = hover ? motion.div : 'div';
  
  return (
    <Component
      whileHover={hover && onClick ? { y: -2, scale: 1.01 } : {}}
      className={`
        bg-card rounded-2xl p-6 shadow-sm border border-border/50 transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${hover && onClick ? 'hover:shadow-md' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}; 