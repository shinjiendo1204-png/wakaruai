"use client";
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // ここを変更
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // ブラウザ用のクライアントを作成
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // ログイン実行
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      alert("ログイン失敗: " + error.message);
    } else {
      // ログイン成功後、少し待ってから遷移（Cookieの反映を待つため）
      setTimeout(() => {
        router.push('/admin/news');
        router.refresh(); // Middlewareの判定を最新にする
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        <h1 className="text-3xl font-black mb-2 text-slate-900">Admin Login</h1>
        <p className="text-slate-400 mb-8 text-sm font-medium">管理者アカウントでサインインしてください</p>
        
        <input 
          type="email" placeholder="メールアドレス" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 bg-slate-50 border-none rounded-2xl outline-blue-600 font-bold"
          required
        />
        <input 
          type="password" placeholder="パスワード" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-8 bg-slate-50 border-none rounded-2xl outline-blue-600 font-bold"
          required
        />
        
        <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all">
          サインイン
        </button>
      </form>
    </div>
  );
}