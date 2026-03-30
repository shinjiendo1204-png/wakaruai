"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Newspaper, Zap, BarChart3, Clock, Loader2, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, drafts: 0 });
  const [isGenerating, setIsGenerating] = useState(false); // 生成中フラグ

  // 統計データの取得
  async function fetchStats() {
    const { count: total } = await supabase.from('ai_news').select('*', { count: 'exact', head: true }).eq('is_published', true);
    const { count: drafts } = await supabase.from('ai_news').select('*', { count: 'exact', head: true }).eq('is_published', false);
    setStats({ total: total || 0, drafts: drafts || 0 });
  }

  useEffect(() => {
    fetchStats();
  }, []);

  // ★ ツール詳細生成APIを叩く関数
  const handleGenerateToolDetails = async () => {
    if (!confirm("詳細が未入力のツール（最大5件）の解説をAIで生成しますか？")) return;
    
    setIsGenerating(true);
    try {
      // APIのパスが app/api/admin/generate-tool-details/route.ts にあることを前提としています
      const res = await fetch('/api/admin/generate-tool-details');
      
      if (res.status === 404) {
        alert("エラー：APIが見つかりません(404)。\napp/api/admin/generate-tool-details/route.ts が存在するか確認してください。");
        return;
      }

      const data = await res.json();
      alert(`${data.processed_count}件のツール詳細を生成・更新しました！`);
      // 統計などを再取得する場合はここで呼ぶ
    } catch (e) {
      console.error(e);
      alert("通信エラーが発生しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-12 tracking-tight text-slate-900">
        Admin <span className="text-blue-600">Dashboard</span>
      </h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Newspaper size={24} />
          </div>
          <p className="text-slate-500 font-bold text-sm mb-1">公開済み記事</p>
          <p className="text-4xl font-black text-slate-900">{stats.total} <span className="text-sm font-normal text-slate-400 px-1">件</span></p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <p className="text-slate-500 font-bold text-sm mb-1">承認待ち</p>
          <p className="text-4xl font-black text-slate-900">{stats.drafts} <span className="text-sm font-normal text-slate-400 px-1">件</span></p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <p className="text-slate-500 font-bold text-sm mb-1">本日の診断回数</p>
          <p className="text-4xl font-black text-slate-900">24 <span className="text-sm font-normal text-slate-400 px-1">回</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ニュース運用メモ */}
        <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-xl shadow-blue-100">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Zap size={24} /> 今日のTODO
          </h2>
          <p className="text-blue-100 mb-8 font-medium leading-relaxed">
            新しいAIニュースが {stats.drafts} 件届いています。<br />
            内容を確認して公開しましょう。
          </p>
          <button 
            onClick={() => window.location.href = '/admin/news'}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg"
          >
            ニュースを確認する
          </button>
        </div>

        {/* ★ ツール詳細自動生成ツール */}
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-slate-900">
              <Sparkles size={24} className="text-yellow-500" /> Tool Enhancer
            </h2>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              名前とURLしかないツールをAIが解析し、「詳細解説・弱点・日本語スコア」を自動生成します。
            </p>
          </div>
          <button 
            onClick={handleGenerateToolDetails}
            disabled={isGenerating}
            className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 ${
              isGenerating 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl'
            }`}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" /> AIが解析中...</>
            ) : (
              "未入力の詳細を一括生成"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}