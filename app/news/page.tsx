"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, Globe, ArrowUpRight, Clock, 
  AlertCircle, ChevronLeft, ChevronRight, Newspaper 
} from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [activeDate, setActiveDate] = useState<string>(''); 
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // 1. 利用可能な日付リスト（ニュースが存在する日）を取得
  useEffect(() => {
    async function fetchDateList() {
      const { data } = await supabase
        .from('ai_news')
        .select('created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data) {
        const dates = Array.from(new Set(data.map(item => {
          const d = new Date(item.created_at);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })));
        
        setAvailableDates(dates);
        if (dates.length > 0 && !activeDate) {
          setActiveDate(dates[0]); // 初期表示は最新の日付
        }
      }
    }
    fetchDateList();
  }, []);

  // 2. 選択された日付のニュースを取得
  useEffect(() => {
    if (!activeDate || activeDate === 'All') return;

    async function fetchNewsByDate() {
      setLoading(true);
      const start = `${activeDate}T00:00:00+09:00`;
      const end = `${activeDate}T23:59:59+09:00`;

      const { data, error } = await supabase
        .from('ai_news')
        .select('*')
        .eq('is_published', true)
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setNews(data);
        const tags = Array.from(new Set(data.flatMap((item: any) => item.tags || [])));
        setAllTags(['All', ...tags]);
      }
      setLoading(false);
    }
    fetchNewsByDate();
  }, [activeDate]);

  // 3. ページネーション用計算
  const currentIndex = availableDates.indexOf(activeDate);
  const prevDate = currentIndex < availableDates.length - 1 ? availableDates[currentIndex + 1] : null;
  const nextDate = currentIndex > 0 ? availableDates[currentIndex - 1] : null;

  const handleDateChange = (date: string) => {
    setActiveDate(date);
    setActiveTag('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayNews = activeTag === 'All' 
    ? news 
    : news.filter(item => item.tags?.includes(activeTag));

  // ヘルパー関数
  const getSourceName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.split('.')[0].toUpperCase();
    } catch { return 'SOURCE'; }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
      {/* ヘッダー */}
      <header className="mb-16">
        <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest mb-4">
          <Newspaper size={18} /> Global AI Briefing
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
          世界のAI<span className="text-blue-600 italic">三行ニュース</span>
        </h1>

        {/* タグフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-6 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                activeTag === tag ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* 日付セレクター（上部クイックアクセス） */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <CalendarIcon size={18} className="text-slate-400 ml-2" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {availableDates.map(date => (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
                  activeDate === date ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {date.split('-').slice(1).join('/')}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ニュース表示エリア */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {displayNews.map((item, idx) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 mb-6 uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(item.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-2 text-slate-200">|</span>
                    <Globe size={12} />
                    {getSourceName(item.source_url)}
                  </div>

                  {/* --- 修正箇所：h3 を Link で囲む --- */}
                  <Link href={`/news/${item.id}`} className="group/title block mb-6">
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover/title:text-blue-600 transition-colors cursor-pointer">
                      {item.title}
                    </h3>
                  </Link>
               

                  <div className="space-y-4 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                    {item.summary_points?.map((p: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-600 font-bold leading-relaxed">
                        <span className="text-blue-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <p>{p}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                    <div className="flex gap-1">
                      {item.tags?.slice(0, 1).map((tag: string) => (
                        <span key={tag} className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded">#{tag}</span>
                      ))}
                    </div>
                    <a 
                      href={item.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      原文ソースを確認 <ArrowUpRight size={14} />
                    </a>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🔢 下部ページネーション（メイン移動） */}
      {!loading && (
        <div className="mt-24 space-y-12">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-4">
            {/* 過去へ */}
            <button
              onClick={() => prevDate && handleDateChange(prevDate)}
              disabled={!prevDate}
              className="flex-1 flex flex-col items-center gap-2 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-20 group"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Day</span>
              <div className="flex items-center gap-3 text-xl font-black text-slate-900">
                <ChevronLeft size={24} className="text-blue-600 group-hover:-translate-x-1 transition-transform" />
                {prevDate ? prevDate.split('-').slice(1).join('/') : 'NO DATA'}
              </div>
            </button>

            {/* 未来へ */}
            <button
              onClick={() => nextDate && handleDateChange(nextDate)}
              disabled={!nextDate}
              className="flex-1 flex flex-col items-center gap-2 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-20 group"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Day</span>
              <div className="flex items-center gap-3 text-xl font-black text-slate-900">
                {nextDate ? nextDate.split('-').slice(1).join('/') : 'LATEST'}
                <ChevronRight size={24} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* 数字のインデックス（全日程クイックアクセス） */}
          <div className="flex flex-wrap justify-center gap-2">
            {availableDates.map((date, i) => (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                  activeDate === date 
                  ? 'bg-blue-600 text-white shadow-lg scale-110' 
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="mt-24 p-8 bg-slate-900 rounded-[3rem] text-slate-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Newspaper size={120} />
        </div>
        <div className="flex items-start gap-4 text-xs leading-relaxed relative z-10">
          <AlertCircle size={20} className="shrink-0 text-blue-500" />
          <div>
            <p className="font-black mb-2 text-white text-sm uppercase tracking-tighter">免責事項</p>
            <p className="font-bold opacity-80">
              本ページの記事内容は、AIによって自動的に抽出・要約され、手動で修正を行ったものです。
              一次ソースの正確性を保証するものではありません。詳細は必ず「原文ソース」をご確認ください。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}