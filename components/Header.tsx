"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
// BookOpen を追加インポート
import { Sparkles, LayoutGrid, Newspaper, Mic2, BookOpen } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'AI診断', shortName: '診断', href: '/diagnostic', icon: <Sparkles size={18} /> },
    { name: 'ツール一覧', shortName: 'ツール', href: '/tools', icon: <LayoutGrid size={18} /> },
    { name: 'AI三行ニュース', shortName: 'ニュース', href: '/news', icon: <Newspaper size={18} /> },
    { name: 'Podcast要約', shortName: 'Podcast', href: '/podcasts', icon: <Mic2 size={18} /> },
    // ★新しく追加：AI用語辞典
    { name: 'AI用語辞典', shortName: '辞典', href: '/glossary', icon: <BookOpen size={18} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 md:p-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-white/90 backdrop-blur-lg border border-slate-200 rounded-full shadow-lg shadow-slate-200/50 pointer-events-auto max-w-[95vw] md:max-w-none overflow-x-auto no-scrollbar"
      >
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 mr-2 md:mr-4 group shrink-0">
          <div className="bg-white p-0.5 rounded-lg border border-slate-200 group-hover:rotate-12 transition-transform overflow-hidden w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
            <img 
              src="/favicon.jpg" 
              alt="ロゴ"
              className="w-full h-full object-cover rounded-md" 
            />
          </div>
          <span className="font-black text-lg md:text-xl tracking-tighter text-slate-900 hidden xs:block">
            ワカル<span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* ナビゲーション */}
        <div className="flex items-center gap-0.5 md:gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="relative px-2.5 md:px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-bold transition-colors shrink-0"
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}>
                  {item.icon}
                </span>
                {/* さらに画面が狭いときのために、中間のブレイクポイント(lg)までは
                  テキストを表示し、それ以下では非表示にする設定も可能です。
                */}
                <span className={`hidden lg:block ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
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