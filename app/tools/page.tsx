"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence, } from 'framer-motion';
import Link from 'next/link';
import { Filter, ArrowRight, Star, Zap, Image as ImageIcon, PenTool, Cpu, Globe, AlertTriangle, Search, Trophy, Briefcase } from 'lucide-react';

const categories = [
  { id: 'all', name: 'すべて', icon: <Filter size={18} /> },
  { id: 'writing', name: '文章作成', icon: <PenTool size={18} /> },
  { id: 'image', name: '画像生成', icon: <ImageIcon size={18} /> },
  { id: 'video', name: '動画', icon: <Zap size={18} /> },
  { id: 'auto', name: '自動化・開発', icon: <Cpu size={18} /> },
];

const industries = [
  { id: 'all', name: 'すべての業界' },
  { id: 'IT・通信', name: 'IT・開発' },
  { id: '不動産', name: '不動産' },
  { id: '製造', name: '製造・メーカー' },
  { id: '個人開発', name: '個人開発・副業' },
  { id: '教育', name: '教育・学習' },
];

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchTools() {
    setLoading(true);
    
    // reviews(rating) の平均値を取得するクエリ
    const { data, error } = await supabase
      .from('ai_tools')
      .select(`
        *,
        reviews (
          rating
        )
      `)
      .order('jp_score', { ascending: false });
    
    if (!error && data) {
      // 取得したデータに対して、フロントエンドで平均値を計算してプロパティを追加
      const toolsWithRating = data.map((tool: any) => {
        const ratings = tool.reviews?.map((r: any) => r.rating) || [];
        const avgRating = ratings.length > 0 
          ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
          : "---"; // レビューがない場合はハイフン
        return { ...tool, avgRating };
      });
      
      setTools(toolsWithRating);
    }
    setLoading(false);
  }
  fetchTools();
}, []);

  // フィルタリングロジック（検索 + カテゴリ + 業界）
  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || t.category === activeTab;
    const matchesIndustry = activeIndustry === 'all' || t.target_industries?.includes(activeIndustry); // 業界データが配列で入っている想定
    return matchesSearch && matchesTab && matchesIndustry;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse">ディレクトリを展開中...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
      
      {/* 1. ヒーロー & 検索セクション */}
      <div className="mb-16">
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">
          AI <span className="text-blue-600">ツール</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100">
          {/* 名前検索 */}
          <div className="relative w-full lg:flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="ツール名で検索..."
              className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-3xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 業界選択プルダウン */}
          <div className="relative w-full lg:w-72">
            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select 
              className="w-full pl-16 pr-6 py-5 bg-blue-50/50 rounded-3xl font-black text-slate-900 outline-none appearance-none cursor-pointer hover:bg-blue-50 transition-all"
              value={activeIndustry}
              onChange={(e) => setActiveIndustry(e.target.value)}
            >
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. カテゴリタブ（横スクロール） */}
      <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-2 ${
              activeTab === cat.id 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* 3. ランキング / グリッド表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col relative"
            >
              {/* ランキングバッジ（上位3つ） */}
              {index < 3 && searchQuery === '' && activeTab === 'all' && (
                <div className="absolute -top-4 -left-4 bg-amber-400 text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
                  <Trophy size={24} fill="currentColor" />
                </div>
              )}

              {/* 修正箇所：★ 4.8 の部分 */}
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                  tool.avgRating !== "---" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"
                }`}>
                  <Star size={12} fill={tool.avgRating !== "---" ? "currentColor" : "none"} className="mb-0.5" />
                  {tool.avgRating}
                </div>
            
              
              <Link href={`/tools/${tool.id}`} className="group-hover:translate-x-1 transition-transform">
                <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-8 font-medium leading-relaxed">
                  {tool.strength}
                </p>
              </Link>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={14} className={tool.jp_score >= 4 ? "text-blue-500" : "text-slate-300"} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    日本語対応: {tool.jp_score}/5
                  </span>
                </div>
                
                <Link 
                  href={`/tools/${tool.id}`} 
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                >
                  Check <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 検索結果がゼロの場合 */}
      {filteredTools.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-black text-xl">該当するAIツールが見つかりませんでした...</p>
          <button onClick={() => {setSearchQuery(''); setActiveTab('all'); setActiveIndustry('all');}} className="mt-4 text-blue-600 font-bold hover:underline">
            フィルターをリセットする
          </button>
        </div>
      )}
    </div>
  );
}