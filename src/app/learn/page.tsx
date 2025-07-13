'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  ChevronRight,
  Clock,
  Star,
  Play,
  CheckCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const tutorials = [
  {
    id: 'bundler-basics',
    title: 'What is a Bundler?',
    description: 'Learn the fundamentals of transaction bundling on Solana',
    duration: '2 min read',
    type: 'article',
    difficulty: 'beginner',
    icon: BookOpen,
  },
  {
    id: 'first-bundle',
    title: 'Your First Bundle',
    description: 'Step-by-step guide to creating your first transaction bundle',
    duration: '5 min',
    type: 'interactive',
    difficulty: 'beginner',
    icon: Play,
  },
  {
    id: 'understanding-fees',
    title: 'Understanding Fees',
    description: 'How bundling saves you money on transaction costs',
    duration: '3 min read',
    type: 'article',
    difficulty: 'intermediate',
    icon: FileText,
  },
  {
    id: 'liquidity-guide',
    title: 'Liquidity Provider Guide',
    description: 'Everything you need to know about providing liquidity',
    duration: '8 min',
    type: 'video',
    difficulty: 'intermediate',
    icon: Video,
  },
  {
    id: 'safety-tips',
    title: 'Safety Best Practices',
    description: 'Keep your assets safe while using DeFi protocols',
    duration: '4 min read',
    type: 'article',
    difficulty: 'beginner',
    icon: BookOpen,
  },
  {
    id: 'advanced-strategies',
    title: 'Advanced Bundle Strategies',
    description: 'Complex multi-step transactions and MEV protection',
    duration: '10 min',
    type: 'video',
    difficulty: 'advanced',
    icon: Video,
  },
];

const faqs = [
  {
    question: 'Why use a bundler?',
    answer: 'Bundlers save you money by combining multiple transactions into one, reducing network fees. They also protect you from MEV attacks and make complex operations simpler.',
  },
  {
    question: 'Is it safe?',
    answer: 'Yes! Your keys never leave your wallet. We only help you build and send transactions more efficiently. All transactions require your explicit approval.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Using the bundler itself is free. You only pay standard Solana network fees, which are often 50-80% lower when bundling compared to individual transactions.',
  },
  {
    question: 'What wallets are supported?',
    answer: 'We support all major Solana wallets including Phantom, Solflare, Backpack, and hardware wallets like Ledger.',
  },
  {
    question: 'Can I cancel a bundle?',
    answer: 'Once a bundle is submitted to the blockchain, it cannot be cancelled. Always review your transactions carefully before confirming.',
  },
  {
    question: 'What is MEV protection?',
    answer: 'MEV (Maximum Extractable Value) protection prevents bots from front-running your transactions. This is especially important for large trades or when adding liquidity.',
  },
];

const difficultyColors = {
  beginner: 'text-success',
  intermediate: 'text-warning',
  advanced: 'text-error',
};

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'article' | 'video' | 'interactive'>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div {...fadeInUp}>
          <h1 className="text-3xl font-bold mb-2">Learn Center</h1>
          <p className="text-muted-foreground">
            Master DeFi bundling with our tutorials and guides
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<BookOpen className="w-4 h-4" />}
              className="flex-1"
            />
            
            <div className="flex gap-2">
              {['all', 'article', 'video', 'interactive'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category as any)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Tutorial */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-warning" />
                  <span className="text-sm font-medium text-warning">Featured Tutorial</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Complete Beginner's Guide</h3>
                <p className="text-muted-foreground mb-4">
                  New to DeFi? Start here! Learn everything from wallet setup to your first successful bundle.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    15 min course
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Interactive
                  </span>
                </div>
              </div>
              <Button size="lg" icon={<Play className="w-5 h-5" />}>
                Start Learning
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tutorials Grid */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-semibold mb-4">All Tutorials</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <tutorial.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{tutorial.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {tutorial.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </span>
                          <span className={`capitalize ${difficultyColors[tutorial.difficulty]}`}>
                            {tutorial.difficulty}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">{faq.question}</h3>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedFAQ === index ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>
                  
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 text-muted-foreground"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <Card className="bg-muted/50 text-center">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Still Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to answer your questions
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline">Join Discord</Button>
              <Button>Contact Support</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 