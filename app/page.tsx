"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Sparkles, Zap, Newspaper, ArrowRight, Search, ShoppingCart, BookOpen, Star } from 'lucide-react';

export default function LandingPage() {
  const [latestNews, setLatestNews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLatestNews() {
      const { data } = await supabase
        .from('ai_news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setLatestNews(data);
    }
    fetchLatestNews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">

      {/* HERO */}
      <section className="max-w-5xl mx-auto pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-8 shadow-sm"
        >
          <Sparkles className="text-blue-600" size={16} />
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">The All-in-One AI Hub</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-12 leading-[1.15] md:leading-[1.1]"
        >
          AIの「今」を<br />
          <span className="text-blue-600 italic">最短距離</span>で。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          海外AIニュースを毎日3行で。100以上のAIツール辞書。<br className="hidden md:block" />
          そして、日本市場を攻略するAIプロンプト集。
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/news">
            <motion.button
              whileHover={{ y: -4 }}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 w-full md:w-auto"
            >
              最新ニュースを読む <Newspaper size={20} />
            </motion.button>
          </Link>
          <Link href="/diagnostic">
            <motion.button
              whileHover={{ y: -4 }}
              className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-black hover:border-blue-600 transition-all flex items-center gap-3 w-full md:w-auto"
            >
              自分に合うAIを探す <Search size={20} />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCT BANNER */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <motion.a
          href="https://japan-marketing-lp.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="block group"
        >
          <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 border border-slate-800 hover:border-blue-500 transition-all duration-300 shadow-2xl">
            <div className="absolute top-0 right-0 text-[200px] leading-none opacity-[0.06] select-none pointer-events-none">🇯🇵</div>
            <div className="absolute top-4 right-4">
              <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">New</span>
            </div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                  <span className="text-slate-400 text-xs ml-1">Early adopters</span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-black mb-3 leading-tight">
                  日本市場を攻略する<br className="hidden md:block" />
                  AIプロンプト集 50選
                </h3>
                <p className="text-slate-400 text-sm md:text-base max-w-lg mb-4">
                  海外マーケターが日本語の壁を越えるための、コピペで使えるAIワークフロー50本。リサーチ・LP・CS・集客まで全網羅。
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-white font-black text-2xl">$47</span>
                  <span className="text-slate-500 line-through text-sm">$97</span>
                  <span className="bg-red-600/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">60% OFF</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-blue-600 group-hover:bg-blue-500 transition-colors text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 text-base whitespace-nowrap shadow-lg shadow-blue-600/30">
                  <ShoppingCart size={18} />
                  今すぐ購入
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </motion.a>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 pb-24">
        {/* ニュース */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group">
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <Newspaper size={24} />
          </div>
          <h3 className="text-2xl font-black mb-4">全世界のAI動向を三行で。</h3>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            TechCrunch、The Decoderなど、主要な海外メディアからAI情報だけを抽出。
            AIが要約し、日本語で毎日お届けします。
          </p>
          <div className="space-y-4 mb-8">
            {latestNews.slice(0, 2).map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="block p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all">
                <span className="text-[10px] font-black text-blue-500 uppercase">Latest News</span>
                <p className="font-bold text-sm line-clamp-1 mt-1">{item.title}</p>
              </Link>
            ))}
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 text-blue-600 font-black hover:gap-4 transition-all">
            ニュースセンターへ <ArrowRight size={18} />
          </Link>
        </div>

        {/* AI診断 */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group">
          <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles size={24} />
          </div>
          <h3 className="text-2xl font-black mb-4">最適なAIツールを即座に。</h3>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            100種類以上のAIツール辞書を完備。目的から逆引きしたり、
            診断形式であなたに最適なパートナーを見つけます。
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {['#画像生成', '#文章作成', '#動画編集', '#業務自動化', '#コード生成'].map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <Link href="/diagnostic" className="inline-flex items-center gap-2 text-purple-600 font-black hover:gap-4 transition-all">
            AI診断ツールを使う <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-t border-b border-slate-100 py-16 mb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 px-6 text-center">
          <div>
            <p className="text-4xl font-black text-blue-600 mb-2">10 Sec</p>
            <p className="text-sm font-bold text-slate-400">診断による最速の選定</p>
          </div>
          <div>
            <p className="text-4xl font-black text-blue-600 mb-2">3 Lines</p>
            <p className="text-sm font-bold text-slate-400">ニュース要約による最速の理解</p>
          </div>
          <div>
            <p className="text-4xl font-black text-blue-600 mb-2">100+</p>
            <p className="text-sm font-bold text-slate-400">網羅されたAIツール辞書</p>
          </div>
        </div>
      </section>

    </div>
  );
}
