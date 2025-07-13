/**
 * Format a number as currency with proper decimals
 */
export function formatCurrency(
  value: number | string,
  options: {
    decimals?: number;
    symbol?: string;
    compact?: boolean;
  } = {}
): string {
  const { decimals = 2, symbol = '$', compact = false } = options;
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return `${symbol}0.00`;

  if (compact && num >= 1000000) {
    return `${symbol}${(num / 1000000).toFixed(2)}M`;
  } else if (compact && num >= 1000) {
    return `${symbol}${(num / 1000).toFixed(2)}K`;
  }

  return `${symbol}${num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Format a token amount with proper decimals
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number = 6,
  maxDecimals: number = 6
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0';
  
  // For very small numbers
  if (num > 0 && num < 0.00001) {
    return '<0.00001';
  }
  
  // For whole numbers
  if (num % 1 === 0) {
    return num.toLocaleString();
  }
  
  // For decimals
  const formatted = num.toFixed(maxDecimals);
  const trimmed = parseFloat(formatted).toString();
  
  return trimmed;
}

/**
 * Shorten a Solana address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format a date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return then.toLocaleDateString();
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Parse input value to number
 */
export function parseInputAmount(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  
  if (parts.length > 2) {
    return parseFloat(parts[0] + '.' + parts.slice(1).join(''));
  }
  
  return parseFloat(cleaned) || 0;
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  if (!address) return false;
  
  // Basic validation - Solana addresses are base58 encoded and typically 32-44 chars
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(
  signature: string,
  type: 'tx' | 'address' = 'tx'
): string {
  const baseUrl = 'https://explorer.solana.com';
  return `${baseUrl}/${type}/${signature}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format large numbers with suffix
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toString();
} 