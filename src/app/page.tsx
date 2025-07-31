'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  DollarSign, 
  Play,
  ChevronRight,
  Users,
  Lock,
  Sparkles,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Logo from '@/components/Logo';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-boost-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-boost-dark/80 backdrop-blur-lg z-40 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="lg" />
          
          <div className="flex items-center gap-4">
            <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
              Learn
            </Link>
            <Link href="/dashboard">
              <Button className="boost-glow">Launch App</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-boost-glow opacity-30" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              Launch Your Token
              <span className="boost-text-gradient block">Like a Legend</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create liquidity and secure your token supply in one atomic transaction. 
              Be the first to own your token before anyone else.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/liquidity">
                <Button size="lg" className="min-w-[200px] boost-glow">
                  Create Liquidity & Bundle
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Explore Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                <span>Anti-MEV Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary-400" />
                <span>Atomic Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary-500" />
                <span>First to Own Supply</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* What is a Bundler Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            {...fadeInUp}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
          >
            <h2 className="text-4xl font-bold font-heading mb-4">What is a Bundler?</h2>
            <p className="text-xl text-muted-foreground">
              Think of it as a smart assistant for your crypto transactions
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Without Bundler</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-error mt-1">✗</span>
                      <span className="text-muted-foreground">Send transactions one by one</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-error mt-1">✗</span>
                      <span className="text-muted-foreground">Pay fees for each transaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-error mt-1">✗</span>
                      <span className="text-muted-foreground">Risk of front-running attacks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-error mt-1">✗</span>
                      <span className="text-muted-foreground">Complex manual process</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-3">With Bundler</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-success mt-1">✓</span>
                      <span className="text-foreground font-medium">Bundle multiple transactions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-success mt-1">✓</span>
                      <span className="text-foreground font-medium">Save up to 80% on fees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-success mt-1">✓</span>
                      <span className="text-foreground font-medium">Built-in MEV protection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-success mt-1">✓</span>
                      <span className="text-foreground font-medium">One-click execution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8">
                <div className="space-y-4">
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Transaction Bundle</span>
                      <span className="text-xs text-success">Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded p-2 text-xs">1. Swap SOL → USDC</div>
                      <div className="bg-muted rounded p-2 text-xs">2. Add Liquidity</div>
                      <div className="bg-muted rounded p-2 text-xs">3. Stake LP Tokens</div>
                    </div>
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-medium text-success">$0.15 (saved $0.45)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            {...fadeInUp}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
          >
            <h2 className="text-4xl font-bold font-heading mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get started in 3 simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Connect',
                description: 'Link your Solana wallet with one click. We support all major wallets.',
                icon: Users,
              },
              {
                step: '2',
                title: 'Configure',
                description: 'Choose from templates or build your own transaction bundle.',
                icon: Sparkles,
              },
              {
                step: '3',
                title: 'Execute',
                description: 'Send all transactions at once, safely and efficiently.',
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            {...fadeInUp}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
          >
            <h2 className="text-4xl font-bold font-heading mb-4">Why Choose Our Bundler?</h2>
            <p className="text-xl text-muted-foreground">
              Built for everyone, from beginners to pros
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Save Money',
                description: 'Bundle transactions to save up to 80% on network fees',
                icon: DollarSign,
                color: 'text-success',
              },
              {
                title: 'Stay Safe',
                description: 'Built-in protection against MEV attacks and front-running',
                icon: Shield,
                color: 'text-primary',
              },
              {
                title: 'Trade Faster',
                description: 'Execute complex strategies in seconds, not minutes',
                icon: Zap,
                color: 'text-warning',
              },
              {
                title: 'User Friendly',
                description: 'Intuitive interface designed for everyone',
                icon: Users,
                color: 'text-secondary',
              },
              {
                title: 'Always Secure',
                description: 'Your keys, your crypto. We never have access',
                icon: Lock,
                color: 'text-error',
              },
              {
                title: 'Smart Templates',
                description: 'Pre-built strategies for common operations',
                icon: Sparkles,
                color: 'text-accent',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold font-heading mb-4">
              Ready to Start Bundling?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already saving time and money
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-white">
                Launch App Now
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-semibold">Solana Bundler</span>
            </div>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/learn" className="hover:text-foreground transition-colors">
                Learn
              </Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link href="/support" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
