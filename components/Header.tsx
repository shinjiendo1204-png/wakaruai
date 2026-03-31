"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
// Mic2 を追加インポート
import { Sparkles, LayoutGrid, Newspaper, Mic2 } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'AI診断', href: '/diagnostic', icon: <Sparkles size={18} /> },
    { name: 'ツール一覧', href: '/tools', icon: <LayoutGrid size={18} /> },
    { name: '世界の三行AIニュース', href: '/news', icon: <Newspaper size={18} /> },
    { name: 'Podcastテック要約', href: '/podcasts', icon: <Mic2 size={18} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-full shadow-lg shadow-slate-100"
      >
       {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 mr-4 group">
           <div className="bg-white p-0.5 rounded-lg border border-slate-200 group-hover:rotate-12 transition-transform overflow-hidden w-8 h-8 flex items-center justify-center">
            <img 
              src="/favicon.jpg" 
              alt="ワカルAI ロゴ"
              className="w-full h-full object-cover rounded-md" 
            />
          </div>
          
          <span className="font-black text-xl tracking-tighter text-slate-900">
            ワカル<span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* ナビゲーション */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative px-4 py-2 flex items-center gap-2 text-sm font-bold transition-colors">
                <span className={isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}>
                  {item.icon}
                </span>
                <span className={isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-blue-50 rounded-full -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </header>
  );
}