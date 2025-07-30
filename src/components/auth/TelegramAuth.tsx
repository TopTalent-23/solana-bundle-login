'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  LogOut, 
  User, 
  ChevronDown,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore, useUIStore } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export const TelegramAuth: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, setAuth, clearAuth, setLoading, isLoading } = useAuthStore();
  const { addToast } = useUIStore();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check for session token from bot login
    const token = searchParams.get('token');
    if (token && !isAuthenticated) {
      verifySessionToken(token);
    }
  }, [searchParams]);

  const verifySessionToken = async (sessionToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL || process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth/verify-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (!response.ok) {
        throw new Error('Invalid session');
      }

      const data = await response.json();
      setAuth(data.user, data.token);
      
      addToast({
        type: 'success',
        title: 'Successfully logged in',
        description: `Welcome, ${data.user.firstName}!`,
      });

      // Remove token from URL
      router.replace('/');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Authentication failed',
        description: 'Invalid or expired session',
      });
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Define the Telegram widget callback
    window.onTelegramAuth = async (telegramUser: any) => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL || process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telegramUser),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        setAuth(data.user, data.token);
        
        addToast({
          type: 'success',
          title: 'Successfully logged in',
          description: `Welcome, ${telegramUser.first_name}!`,
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Authentication failed',
          description: 'Please try again',
        });
      } finally {
        setLoading(false);
      }
    };

    return () => {
      delete window.onTelegramAuth;
    };
  }, [setAuth, addToast, setLoading]);

  useEffect(() => {
    // Load Telegram widget script if not authenticated
    if (!isAuthenticated && !isLoading) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;

      const container = document.getElementById('telegram-widget-container');
      if (container) {
        container.appendChild(script);
      }

      return () => {
        if (container && script.parentNode) {
          container.removeChild(script);
        }
      };
    }
  }, [isAuthenticated, isLoading]);

  const handleLogout = () => {
    clearAuth();
    setShowDropdown(false);
    addToast({
      type: 'success',
      title: 'Logged out',
      description: 'Come back soon!',
    });
  };

  const openBot = () => {
    window.open(`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`, '_blank');
  };

  if (isLoading) {
    return (
      <Button variant="secondary" size="lg" disabled>
        <Loader2 className="w-5 h-5 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div id="telegram-widget-container" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Or use our bot:</p>
          <Button
            onClick={openBot}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            @{process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        variant="secondary"
        size="lg"
        className="gap-2"
      >
        {user?.photoUrl ? (
          <img 
            src={user.photoUrl} 
            alt="Profile" 
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="font-medium">
          {user?.firstName} {user?.lastName}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {user?.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                    {user?.username && (
                      <div className="text-sm text-muted-foreground">
                        @{user.username}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={openBot}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Open Bot</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-error"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};