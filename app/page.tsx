"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Newspaper, Search, ArrowRight, ShoppingCart, Star, Zap, BookOpen } from 'lucide-react';

export default function HomePage() {
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
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="max-w-5xl mx-auto pt-24 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8"
        >
          🇯🇵 Japan Market Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight"
        >
          Break Into Japan.<br />
          <span className="text-blue-600">With AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Daily AI news from global sources. 100+ AI tool directory.
          And the playbooks you need to enter Japan&apos;s $4T market.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="https://japan-marketing-lp.vercel.app" target="_blank">
            <motion.button
              whileHover={{ y: -3 }}
              className="bg-red-600 text-white px-8 py-4 rounded-xl text-base font-black shadow-lg hover:bg-red-500 transition-all flex items-center gap-3"
            >
              <ShoppingCart size={18} />
              Get the Japan Playbook — $47
            </motion.button>
          </Link>
          <Link href="/news">
            <motion.button
              whileHover={{ y: -3 }}
              className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl text-base font-black hover:border-slate-400 transition-all flex items-center gap-3"
            >
              <Newspaper size={18} />
              Read AI News
            </motion.button>
          </Link>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
        {/* Main product */}
        <motion.a
          href="https://japan-marketing-lp.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="block group"
        >
          <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-red-500 transition-all h-full">
            <div className="absolute top-0 right-0 text-[120px] opacity-[0.06] select-none">🇯🇵</div>
            <div className="mb-4">
              <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded uppercase tracking-wide">Bestseller</span>
            </div>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
            </div>
            <h3 className="text-white text-xl font-black mb-2">Speak Japan: 50 AI Workflows</h3>
            <p className="text-slate-400 text-sm mb-6">Replace your Japanese marketing team with AI. Market research, content, customer support, and launch playbook.</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-black text-2xl">$47</span>
                <span className="text-slate-600 line-through text-sm ml-2">$97</span>
              </div>
              <div className="bg-red-600 group-hover:bg-red-500 text-white text-sm font-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                Buy Now <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </motion.a>

        {/* Starter kit */}
        <motion.a
          href="https://speakjapan.gumroad.com/l/mzldw"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="block group"
        >
          <div className="relative overflow-hidden bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-400 transition-all h-full">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-1 rounded uppercase tracking-wide">Quick Start</span>
            </div>
            <BookOpen size={28} className="text-blue-600 mb-3" />
            <h3 className="text-slate-900 text-xl font-black mb-2">Japan Market Starter Kit</h3>
            <p className="text-slate-500 text-sm mb-6">5 essential cheat sheets. Consumer psychology, seasonal calendar, platform guide, email templates & launch checklist.</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-black text-2xl">$9</span>
                <span className="text-slate-400 text-xs ml-2">5 cheat sheets</span>
              </div>
              <div className="bg-blue-600 group-hover:bg-blue-500 text-white text-sm font-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                Buy Now <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </motion.a>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <Newspaper size={24} className="text-blue-600 mb-4" />
          <h3 className="text-lg font-black mb-2">Daily AI News</h3>
          <p className="text-slate-500 text-sm mb-4">Global AI news from TechCrunch, The Decoder and more — summarized in 3 lines daily.</p>
          {latestNews.slice(0, 2).map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="block text-xs text-slate-600 hover:text-blue-600 mb-1 line-clamp-1 transition-colors">
              → {item.title}
            </Link>
          ))}
          <Link href="/news" className="text-blue-600 font-bold text-sm flex items-center gap-1 mt-3 hover:gap-2 transition-all">
            All news <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <Search size={24} className="text-purple-600 mb-4" />
          <h3 className="text-lg font-black mb-2">100+ AI Tools</h3>
          <p className="text-slate-500 text-sm mb-4">Find the right AI tool for your job in 10 seconds. Image gen, writing, video, automation and more.</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {['#image', '#writing', '#video', '#code'].map(t => (
              <span key={t} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <Link href="/diagnostic" className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Find your AI <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">
          <Zap size={24} className="text-yellow-400 mb-4" />
          <h3 className="text-lg font-black text-white mb-2">Japan Playbooks</h3>
          <p className="text-slate-400 text-sm mb-4">Ready-to-use AI prompts for every Japan marketing use case. No Japanese team needed.</p>
          <Link
            href="https://japan-marketing-lp.vercel.app"
            target="_blank"
            className="text-yellow-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            See the playbook <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}
