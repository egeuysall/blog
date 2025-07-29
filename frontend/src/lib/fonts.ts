import { DM_Sans, Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

// Initialize the Inter font
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Initialize Geist font (for headings)
export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

// Initialize Geist Mono (for code blocks)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});
