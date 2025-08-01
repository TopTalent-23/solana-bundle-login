'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Shield, Zap } from 'lucide-react';
import { TelegramAuth } from '@/components/auth/TelegramAuth';
import { useAuthStore } from '@/store';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // If already authenticated, don't render login page
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Boost Legends</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Welcome to Boost Legends</h1>
              <p className="text-muted-foreground">
                Sign in with your Telegram account to get started
              </p>
            </div>

            <div className="space-y-6">
              <Suspense fallback={null}><TelegramAuth /></Suspense>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span>Why Telegram?</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Secure Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with Telegram's proven security
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Instant Access</h3>
                    <p className="text-sm text-muted-foreground">
                      No passwords to remember, just click and go
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Bot Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notifications and manage your account via our bot
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}