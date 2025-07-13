'use client'

import React from 'react'
import { Rocket, Zap } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 24, text: 'text-xl' },
    lg: { icon: 32, text: 'text-2xl' }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Rocket 
          size={sizes[size].icon} 
          className="text-primary-500 transform rotate-45"
        />
        <Zap 
          size={sizes[size].icon * 0.6} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-secondary-400"
        />
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text} boost-text-gradient`}>
          Boost Legends
        </span>
      )}
    </div>
  )
} 