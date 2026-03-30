"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar as CalendarIcon, Globe, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [activeDate, setActiveDate] = useState<string>('All'); 
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // ヘルパー関数（言語ラベル・ソース名）
  const getLangLabel = (tags: string[]) => {
    if (!tags || !Array.isArray(tags)) return "";
    const lowerTags = tags.map(t => t.toLowerCase());
    const labels: { [key: string]: string } = {
      english: '(英語)', chinese: '(中国語)', japanese: '(日本語)',
      french: '(フランス語)', korean: '(韓国語)', spanish: '(スペイン語)',
      italian: '(イタリア語)', german: '(ドイツ語)'
    };
    const found = lowerTags.find(t => labels[t]);
    return found ? labels[found] : "";
  };

  const getSourceName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const mapping: { [key: string]: string } = {
        'techcrunch': 'TechCrunch', 'thedecoder': 'The Decoder',
        'venturebeat': 'VentureBeat', '36kr': '36Kr', 'xataka': 'Xataka'
      };
      const key = Object.keys(mapping).find(k => domain.includes(k));
      return key ? mapping[key] : domain.split('.')[0].toUpperCase();
    } catch { return 'SOURCE'; }
  };

  // 修正版：ボタン用日付リストの抽出
useEffect(() => {
  async function fetchDateList() {
    const { data } = await supabase
      .from('ai_news')
      .select('created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (data) {
      const dates = Array.from(new Set(data.map(item => {
        // toISOString() ではなく、日本の日付文字列(YYYY-MM-DD)を取得する
        const d = new Date(item.created_at);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })));
      
      setAvailableDates(dates);
      
      // まだ activeDate がセットされていない場合、最新の日付をセット
      if (dates.length > 0 && (activeDate === 'All' || activeDate === '')) {
        setActiveDate(dates[0]);
      }
    }
  }
  fetchDateList();
}, []);

  // 2. activeDate が変わるたびに、その日のニュースをDBから取得
  // 修正版：その日のニュースを日本時間で正しく取得する
useEffect(() => {
  if (!activeDate) return;

  async function fetchNewsByDate() {
    setLoading(true);
    
    // 検索範囲：その日の 00:00:00 から 23:59:59 まで
    // 日本時間(JST)で判定するために、時刻指定を外して日付文字列だけで比較するか、
    // 以下のように 00:00:00+09 と明示的に指定します。
    const start = `${activeDate}T00:00:00+09:00`;
    const end = `${activeDate}T23:59:59+09:00`;

    let query = supabase
      .from('ai_news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (activeDate !== 'All') {
      // gte = Greater Than or Equal (以上) / lte = Less Than or Equal (以下)
      query = query.gte('created_at', start).lte('created_at', end);
    }

    const { data, error } = await query;
    
    if (!error && data) {
      setNews(data);
      const tags = Array.from(new Set(data.flatMap((item: any) => item.tags || [])));
      setAllTags(['All', ...tags]);
    }
    setLoading(false);
  }

  fetchNewsByDate();
}, [activeDate]);

  // タグによるフロントエンドでの絞り込み
  const displayNews = activeTag === 'All' 
    ? news 
    : news.filter(item => item.tags?.includes(activeTag));

  if (loading && availableDates.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse">読み込み中...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-24">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">
          <span className="text-blue-600 italic">三行で読める世界のAIニュース</span>
        </h1>

        {/* カテゴリ選択（その日のニュースにあるタグだけ表示） */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-6 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                activeTag === tag ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* カレンダー（日付選択）UI */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
          <CalendarIcon size={18} className="text-slate-400 ml-2" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveDate('All')}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                activeDate === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              すべての日付
            </button>
            {availableDates.map(date => (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
                  activeDate === date ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {date.split('-').slice(1).join('/')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ニュース表示エリア */}
      <div className="space-y-12">
        {loading ? (
          <div className="text-center py-20 text-slate-300 font-bold animate-pulse">抽出中...</div>
        ) : displayNews.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-bold">該当するニュースはありません</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {displayNews.map((item, idx) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 mb-4 uppercase tracking-tighter">
                    <Clock size={12} />
                    {new Date(item.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-2 text-slate-200">|</span>
                    <Globe size={12} />
                    {getSourceName(item.source_url)}
                  </div>

                  <Link href={`/news/${item.id}`}>
                    <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="space-y-3 mb-6">
                    {item.summary_points?.slice(0, 3).map((p: string, i: number) => (
                      <p key={i} className="text-sm text-slate-600 font-bold flex gap-2 leading-relaxed">
                        <span className="text-blue-500 font-black">・</span>{p}
                      </p>
                    ))}
                  </div>

                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex gap-2">
                      {item.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-slate-50 text-slate-400 px-2 py-1 rounded-md font-bold">#{tag}</span>
                      ))}
                    </div>
                    <a 
                      href={item.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold inline-flex items-center gap-1 text-slate-400 border-b border-slate-200 pb-0.5 hover:text-blue-600"
                    >
                      原文{getLangLabel(item.tags)} <ArrowUpRight size={12} />
                    </a>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <footer className="mt-24 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-slate-400">
        <div className="flex items-start gap-4 text-xs leading-relaxed">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-slate-300" />
          <div>
            <p className="font-bold mb-1 text-slate-500">免責事項</p>
            <p>本ページの記事内容は、AIによって自動的に抽出・要約されたものです。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}