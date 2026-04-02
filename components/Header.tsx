"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Newspaper, Search, Zap } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'AI News', href: '/news', icon: <Newspaper size={18} /> },
    { name: 'AI Tools', href: '/tools', icon: <Search size={18} /> },
    { name: 'AI Diagnostic', href: '/diagnostic', icon: <Zap size={18} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-slate-900 text-white font-black text-sm px-3 py-1 rounded-lg">
          WAKARUAI
        </div>
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <Link
        href="https://japan-marketing-lp.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm px-4 py-2 rounded-lg transition-colors"
      >
        <ShoppingCart size={16} />
        <span className="hidden sm:block">Get the Playbook</span>
        <span className="sm:hidden">Shop</span>
      </Link>
    </header>
  );
}
