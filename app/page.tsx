"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Sparkles, Zap, Newspaper, ArrowRight, Search, LayoutGrid } from 'lucide-react';
import JapanMarketingBanner from '@/components/JapanMarketingBanner';

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
      {/* ヒーローセクション：AIを「追う」から「使いこなす」へ */}
      <section className="max-w-5xl mx-auto pt-32 pb-20 px-6 text-center">
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
          /* leading-tight (1.25) くらいに広げ、mb-12 で下の文章との距離も確保 */
          className="text-6xl md:text-8xl font-black tracking-tighter mb-12 leading-[1.15] md:leading-[1.1]"
        >
          AIの「今」を<br />
          <span className="text-blue-600 italic">最短距離</span>で。
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
          /* text-xl なら leading-relaxed (1.625) が黄金比です */
          className="text-xl md:text-2xl text-slate-500 mb-16 max-w-3xl mx-auto leading-relaxed"
        >
          膨大な海外ニュースも、100種類以上のAIツールも。<br className="hidden md:block" />
          すべてを簡潔に。あなたの意思決定を加速させる<br/>AI総合プラットフォーム。
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

      {/* メイン機能：2つの柱 */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 pb-24">
        {/* 左側：ニュース */}
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
                <p className="font-bold text-sm line-clamp-1">{item.title}</p>
              </Link>
            ))}
          </div>
          <Link href="/news" className="font-black text-blue-600 flex items-center gap-2 group-hover:gap-4 transition-all">
            ニュースセンターへ <ArrowRight size={20} />
          </Link>
        </div>

        {/* 右側：ツール選定 */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group">
          <div className="bg-yellow-50 text-yellow-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <LayoutGrid size={24} />
          </div>
          <h3 className="text-2xl font-black mb-4">最適なAIツールを即座に。</h3>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            100種類以上のAIツール・辞書を完備。
            目的から逆引きしたり、診断形式であなたに最適なパートナーを見つけます。
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {['画像生成', '文章作成', '動画編集', '業務自動化'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-400">#{tag}</span>
            ))}
          </div>
          <Link href="/diagnostic" className="font-black text-blue-600 flex items-center gap-2 group-hover:gap-4 transition-all">
            AI診断ツールを使う <ArrowRight size={20} />
          </Link>
        </div>
      {/* メイン機能：2つの柱 セクションの終わり */}
      </section>

      {/* ★ここに貼り付け★ */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white overflow-hidden relative group">
          {/* 背景装飾 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full">
                <Zap className="text-blue-400" size={16} />
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Global Podcast Deep-Dive</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight italic">
                世界トップ層の<br />
                <span className="text-blue-500 underline decoration-wavy underline-offset-8">「思考」</span>を学ぶ。
              </h2>
              <p className="text-slate-400 font-bold leading-relaxed text-lg">
                Sam AltmanやJensen Huangなど、世界のビルダーたちがPodcastで語った内容を、簡潔かつ濃密なレポートへ凝縮。最先端の戦略をあなたの武器に。
              </p>
              <Link href="/podcasts">
                <motion.button
                  whileHover={{ x: 10 }}
                  className="bg-white text-slate-900 px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 shadow-xl hover:bg-blue-50 transition-all"
                >
                  Podcast要約を読む <ArrowRight size={20} />
                </motion.button>
              </Link>
            </div>
            
            {/* 視覚的な演出：Podcastカードのプレビュー */}
            <div className="hidden md:block relative">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full aspect-video bg-slate-800 rounded-2xl mb-4 flex items-center justify-center border border-white/5 overflow-hidden">
                  <div className="text-blue-500/30 animate-pulse">
                    <Zap size={80} />
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-white/20 rounded-full mb-3"></div>
                <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
              </div>
              {/* 重なり演出 */}
              <div className="absolute -bottom-6 -left-6 bg-blue-600 p-6 rounded-[2rem] shadow-2xl transform -rotate-6 group-hover:-rotate-3 transition-transform duration-500">
                <p className="text-white font-black text-xs">NEW REPORT AVAILABLE</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ★ここまで★ */}

      {/* 信頼・スピードの証 */}
      <section className="bg-slate-900 text-white py-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-16 leading-tight">
            AIで迷う時間を、<br /><span className="text-blue-500">AIを動かす時間</span>に変える。
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-4xl font-black text-blue-500 mb-2">10 Sec</p>
              <p className="text-sm font-bold text-slate-400">診断による最速の選定</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-500 mb-2">3 Lines</p>
              <p className="text-sm font-bold text-slate-400">ニュース要約による最速の理解</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-500 mb-2">100+</p>
              <p className="text-sm font-bold text-slate-400">網羅されたAIツール辞書</p>
            </div>
          </div>
        </div>
      </section>

      <JapanMarketingBanner />
    </div>
  );
}