'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Token } from '@/types';
import { formatTokenAmount, formatCurrency } from '@/utils/format';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label?: string;
  placeholder?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onSelect,
  label = 'Select Token',
  placeholder = 'Search name or paste address',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens;
    
    const query = searchQuery.toLowerCase();
    return tokens.filter(token =>
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-left"
      >
        {selectedToken ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{selectedToken.symbol}</p>
                <p className="text-sm text-muted-foreground">{selectedToken.name}</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Select a token</span>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-border">
                <Input
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  autoFocus
                />
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((token) => (
                    <button
                      key={token.address}
                      onClick={() => handleSelect(token)}
                      className={`
                        w-full p-3 flex items-center justify-between hover:bg-muted transition-colors
                        ${selectedToken?.address === token.address ? 'bg-primary/10' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="text-left">
                          <p className="font-medium">{token.symbol}</p>
                          <p className="text-sm text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {token.balance && (
                          <>
                            <p className="font-medium">{formatTokenAmount(token.balance)}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(token.value || 0)}
                            </p>
                          </>
                        )}
                        {selectedToken?.address === token.address && (
                          <Check className="w-5 h-5 text-primary ml-2" />
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No tokens found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try searching by name or address
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-border bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  Popular tokens are shown first. Can't find your token? Make sure it's in your wallet.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 