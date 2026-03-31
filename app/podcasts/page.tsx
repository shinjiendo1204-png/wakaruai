"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mic2, ArrowRight, Calendar, Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PodcastListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const POSTS_PER_PAGE = 9; // 1ページあたりの表示数

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      
      // 1. 全体件数を取得（ページボタン作成用）
      const { count } = await supabase
        .from('podcast_summaries')
        .select('*', { count: 'exact', head: true });
      setTotalCount(count || 0);

      // 2. 現在のページに該当するデータのみ取得
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data } = await supabase
        .from('podcast_summaries')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to); // 👈 ここで取得範囲を絞る

      if (data) setPosts(data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ページ切り替え時に上に戻る
    }
    fetchPosts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      {/* ヘッダー */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 mb-4">
            <Mic2 className="text-blue-600" size={36} /> 海外Podcast要約
          </h1>
          <p className="text-slate-500 font-bold text-lg">
            エンジニアが知るべき最新情報を「三行＋詳細」で。
          </p>
        </div>
      </div>

      {/* 記事一覧グリッド */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/podcasts/${post.id}`}
            className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <Calendar size={12} />
                  {new Date(post.created_at).toLocaleDateString('ja-JP')}
                </div>
                <div className="flex items-center gap-1 text-slate-300 text-[10px] font-black uppercase">
                  <Clock size={12} /> 5 min read
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight">
                {post.title}
              </h2>
              <div className="space-y-3 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-50">
                {post.three_line_summary?.split('\n').filter((l: string) => l.trim() !== '').slice(0, 3).map((line: string, i: number) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-slate-600 leading-snug">
                    <span className="text-blue-500 mt-0.5">●</span>
                    <p className="font-bold">{line.replace(/^[*-]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">Deep Dive を読む</span>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-blue-600 transition-all">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔢 ページネーション・ナビゲーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* 前へボタン */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          {/* 数字ボタン */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110'
                    : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* 次へボタン */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}