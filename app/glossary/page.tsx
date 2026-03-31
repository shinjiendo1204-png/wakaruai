"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase'; // Supabaseクライアントをインポート
import Link from 'next/link';
import { BookOpen, Search, ArrowRight, Zap, Loader2 } from 'lucide-react';

export default function GlossaryIndexPage() {
  const [glossaryData, setGlossaryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Supabaseからデータを取得
  useEffect(() => {
    async function fetchGlossary() {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_glossary')
        .select('*')
        .order('term', { ascending: true });
      
      if (!error && data) {
        setGlossaryData(data);
      }
      setLoading(false);
    }
    fetchGlossary();
  }, []);

  // 2. 検索・グループ化ロジック
  const groupedTerms = useMemo(() => {
    const filtered = glossaryData.filter(item => 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ruby?.includes(searchQuery) ||
      item.en_term?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: { [key: string]: any[] } = {};
    
    filtered.forEach(item => {
      // 1文字目を取得してカテゴリー分け
      const firstChar = item.term.charAt(0).toUpperCase();
      // 英字ならその文字、日本語なら「日本語」セクションにまとめる
      const category = /^[A-Z]/.test(firstChar) ? firstChar : "日本語"; 
      
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });

    return groups;
  }, [searchQuery, glossaryData]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32 animate-in fade-in duration-700">
      
      {/* ヘッダーエリア */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
          AI用語辞典 <span className="text-blue-600">Glossary</span>
        </h1>
        <p className="text-slate-500 font-bold text-lg leading-relaxed">
          最新のAIトレンドから基礎知識まで。<br className="hidden md:block" />
          エンジニアの「知りたい」を瞬時に解決する技術辞書。
        </p>
      </div>

      {/* 検索バー */}
      <div className="mb-12 sticky top-24 z-30 flex flex-col md:flex-row gap-4 items-center justify-center bg-white/80 backdrop-blur-md py-4 px-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="用語を検索（例: RAG, 推論）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-sm transition-all"
          />
        </div>
      </div>

      {/* ローディング表示 */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold">データベース接続中...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedTerms).sort().map(([category, items]) => (
            <section key={category}>
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <span className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                  {category}
                </span>
                <div className="h-1 flex-grow bg-slate-100 rounded-full"></div>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/glossary/${item.slug}`} // slugをURLに使用
                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-200/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.term}
                      </h3>
                      <p className="text-xs text-slate-400 font-black mb-4 uppercase tracking-wider">
                        {item.en_term}
                      </p>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-50 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-all">
                        {item.one_liner}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Detail View</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 検索結果ゼロの場合 */}
      {!loading && Object.keys(groupedTerms).length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Zap className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold text-lg">該当する用語が見つかりませんでした。</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-blue-600 font-black text-sm hover:underline"
          >
            検索をリセット
          </button>
        </div>
      )}
    </div>
  );
}