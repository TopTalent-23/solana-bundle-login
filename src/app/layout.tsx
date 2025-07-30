import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";


export const metadata: Metadata = {
  title: "Solana Bundler - Bundle Your Transactions Like a Pro",
  description: "Save money, trade safely, and execute multiple Solana transactions at once with our user-friendly bundler platform.",
  keywords: "Solana, bundler, DeFi, transactions, crypto, blockchain",
  openGraph: {
    title: "Solana Bundler - Bundle Your Transactions Like a Pro",
    description: "Save money, trade safely, and execute multiple Solana transactions at once",
    type: "website",
    url: "https://solanabundler.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Solana Bundler",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Bundler",
    description: "Bundle Your Solana Transactions Like a Pro",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
