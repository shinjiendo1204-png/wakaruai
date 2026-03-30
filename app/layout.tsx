import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script'; // ✅ これが必要！

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ワカルAI",
  description: "AIの「今」を最短距離で。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      {/* Google Analytics は body のすぐ下に入れるのが一般的です */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        {/* ✅ Google Analytics 設定 */}
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
      </body>
    </html>
  );
}