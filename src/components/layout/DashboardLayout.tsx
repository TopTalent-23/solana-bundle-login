'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Package,
  Wallet,
  Droplets,
  Activity,
  Settings,
  BookOpen,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Rocket,
  Zap,
  Users,
  Coins,
} from 'lucide-react';
import Logo from '@/components/Logo';
import WalletConnection from '@/components/wallet/WalletConnection';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  highlight?: boolean;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { href: '/manage-wallets', label: 'Manage Launch Wallets', icon: Users },
  { href: '/token', label: 'Create Token & Bundle', icon: Coins, highlight: true },
  { href: '/projects', label: 'My Projects', icon: Package },
  { href: '/learn', label: 'Learn', icon: BookOpen },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Logo size="lg" />
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        {item.disabled ? (
                          <div
                            className={`
                              group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6
                              transition-all duration-200 relative cursor-not-allowed opacity-50
                              ${item.highlight
                                ? 'text-foreground border border-primary/30 boost-border-gradient'
                                : 'text-muted-foreground'
                              }
                            `}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {item.label}
                            {item.highlight && (
                              <Zap className="ml-auto h-4 w-4 text-secondary-400" />
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={`
                              group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6
                              transition-all duration-200 relative
                              ${isActive 
                                ? 'bg-primary text-primary-foreground shadow-lg' 
                                : item.highlight
                                  ? 'text-foreground hover:text-primary-foreground hover:bg-primary/90 border border-primary/50 boost-border-gradient'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }
                            `}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {item.label}
                            {item.highlight && !isActive && (
                              <Zap className="ml-auto h-4 w-4 text-secondary-400" />
                            )}
                            {isActive && (
                              <ChevronRight className="ml-auto h-5 w-5" />
                            )}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              <li className="mt-auto">
                <Link
                  href="/settings"
                  className="group -mx-2 flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-foreground lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex flex-1 items-center justify-between">
          <Logo size="md" />
          
          <WalletConnection />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-card lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <Logo size="md" />
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex flex-col gap-y-1 p-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <div key={item.href}>
                      {item.disabled ? (
                        <div
                          className={`
                            flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium
                            transition-all duration-200 relative cursor-not-allowed opacity-50
                            ${item.highlight
                              ? 'text-foreground border border-primary/30 boost-border-gradient'
                              : 'text-muted-foreground'
                            }
                          `}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                          {item.highlight && (
                            <Zap className="ml-auto h-4 w-4 text-secondary-400" />
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium
                            transition-all duration-200 relative
                            ${isActive 
                              ? 'bg-primary text-primary-foreground shadow-lg' 
                              : item.highlight
                                ? 'text-foreground hover:text-primary-foreground hover:bg-primary/90 border border-primary/50 boost-border-gradient'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                          {item.highlight && !isActive && (
                            <Zap className="ml-auto h-4 w-4 text-secondary-400" />
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
                
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-6 flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <h1 className="text-2xl font-semibold font-heading">
            {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            
            <WalletConnection />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}; 