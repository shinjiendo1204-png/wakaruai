"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Products', href: '/products' },
    { name: 'Free Japan Guide', href: '/japan-guide' },
    { name: 'AI News', href: '/news' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <span className="bg-slate-900 text-white font-black text-sm px-3 py-1.5 rounded-lg tracking-tight">WAKARUAI</span>
        <span className="hidden sm:block text-xs text-slate-400 font-medium">Japan Market Hub</span>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <Link
        href="https://japan-marketing-lp.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm px-4 py-2.5 rounded-lg transition-colors shadow-md shadow-red-600/20"
      >
        <ShoppingCart size={15} />
        <span>Get Playbook $47</span>
      </Link>
    </header>
  );
}
