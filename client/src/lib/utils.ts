import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

export function formatDate(date: Date | null): string {
  if (!date) return '';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formattedTime = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  if (date >= today) {
    return `Hôm nay, ${formattedTime}`;
  } else if (date >= yesterday) {
    return `Hôm qua, ${formattedTime}`;
  } else {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + `, ${formattedTime}`;
  }
}

export function calculateMiningBoost(referrals: string[], adBoostActive: boolean): {
  referralBoost: number;
  adBoost: number;
  totalBoost: number;
} {
  // Calculate referral boost (10% per referral, max 200%)
  const referralCount = referrals?.length || 0;
  const maxReferrals = 20;
  const referralBoost = Math.min(referralCount * 10, maxReferrals * 10);
  
  // Ad boost is 200%
  const adBoost = adBoostActive ? 200 : 0;
  
  // Total boost
  const totalBoost = referralBoost + adBoost;
  
  return {
    referralBoost,
    adBoost,
    totalBoost
  };
}

export function calculateMiningRate(baseRate: number, totalBoost: number): number {
  return baseRate * (1 + totalBoost / 100);
}

export function createSVGIcon(text: string, bgColor: string = "#FF3B30"): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="${bgColor}"/>
      <circle cx="16" cy="16" r="12" stroke="#FFD700" stroke-width="1.5"/>
      <text x="16" y="20" text-anchor="middle" font-size="10" fill="#FFD700">${text}</text>
    </svg>
  `)}`;
}

// Function to get initials from a name
export function getInitials(name: string | null | undefined): string {
  if (!name) return "A";
  return name.split(" ").map(word => word[0]).join("").toUpperCase();
}

// Format a number with 2 decimal places for displaying Au balance
export function formatAuBalance(balance: number): string {
  return balance.toFixed(2);
}

// Format a number with 4 decimal places for mining rate
export function formatMiningRate(rate: number): string {
  return rate.toFixed(4);
}
