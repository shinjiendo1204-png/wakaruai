"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Newspaper, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const menuItems = [
    { name: 'ダッシュボード', href: '/admin', icon: LayoutDashboard },
    { name: 'ニュース管理', href: '/admin/news', icon: Newspaper },
    { name: '設定', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* サイドバー */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-8">
          <Link href="/" className="text-xl font-black flex items-center gap-2 text-blue-600">
            AI Tool Select <span className="text-[10px] bg-blue-50 px-2 py-0.5 rounded-full">Admin</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {item.name}
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">
            <ExternalLink size={20} />
            サイトを確認
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ表示エリア */}
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}