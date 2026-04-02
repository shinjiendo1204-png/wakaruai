import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WAKARUAI — Japan Market Intelligence for Global Marketers",
  description: "AI tools, news, and playbooks for foreign marketers entering Japan. Break the language barrier with AI.",
  openGraph: {
    title: "WAKARUAI — Japan Market Intelligence",
    description: "AI-powered resources for entering the Japanese market.",
    url: "https://wakaruai.net",
    siteName: "WAKARUAI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZYK8KKF2Y2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZYK8KKF2Y2');
          `}
        </Script>
        <Header />
        <main className="pt-24 min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
