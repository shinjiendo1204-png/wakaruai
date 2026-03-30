// app/news/[id]/page.tsx

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: post } = await supabase
    .from('ai_news')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pb-24 animate-in fade-in duration-700">
      {/* 戻るボタン */}
      <Link href="/news" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-12 hover:text-blue-600 transition-all hover:-translate-x-1">
        <ArrowLeft size={20} /> ニュース一覧へ戻る
      </Link>

      {/* カテゴリと日付 */}
      <div className="flex items-center gap-4 mb-6">
        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          {post.tags?.[0] || 'AI'}
        </span>
        <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
          <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('ja-JP')}
        </span>
      </div>

      {/* メインタイトル */}
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-[1.2] tracking-tight">
        {post.title}
      </h1>

      {/* 3行要約ボックス（デザイン強化版） */}
      <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] mb-16 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Quick Summary</p>
        <ul className="space-y-6 pt-2">
          {post.summary_points?.map((p: string, i: number) => (
            <li key={i} className="flex gap-5 font-bold text-lg md:text-xl leading-snug">
              <span className="text-blue-500 tabular-nums">0{i+1}.</span> 
              <span className="text-slate-100">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 詳細解説コンテンツ（Typography適用） */}
      <div className="prose prose-slate prose-lg max-w-none mb-20 
        prose-headings:font-black prose-headings:text-slate-900
        prose-h2:text-2xl prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-4 prose-h2:mb-6
        prose-h3:text-xl prose-h3:mt-10
        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
        prose-strong:text-slate-900 prose-strong:font-black">
        <ReactMarkdown>{post.content_jp?.replace(/\\n/g, '\n')}</ReactMarkdown>
      </div>

      {/* フッターリンク */}
      <div className="border-t border-slate-100 pt-16 text-center">
        <p className="text-slate-400 text-sm font-bold mb-6">より詳しい情報は公式サイトをご確認ください</p>
        <a 
          href={post.source_url.split('?')[0]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"
        >
          原文をフルで読む(外部サイト)<ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}