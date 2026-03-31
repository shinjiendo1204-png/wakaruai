// app/podcasts/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mic2, ArrowRight, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PodcastListPage() {
  // 1. Supabaseから最新順に取得
  const { data: posts } = await supabase
    .from('podcast_summaries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ヘッダーセクション */}
      <div className="mb-16">
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 mb-4">
          <Mic2 className="text-blue-600" size={36} /> 海外Podcastテック要約
        </h1>
        <p className="text-slate-500 font-bold text-lg">
          英語の一次ソースから、エンジニアが知るべき最新情報を「三行＋詳細」で。
        </p>
      </div>

      {/* 記事一覧グリッド */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <Link 
            key={post.id} 
            href={`/podcasts/${post.id}`}
            className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-black mb-6 uppercase tracking-widest">
                <Calendar size={14} />
                {new Date(post.created_at).toLocaleDateString('ja-JP')}
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight">
                {post.title}
              </h2>
              
              <div className="space-y-2 mb-8">
                {post.three_line_summary ? (
                  post.three_line_summary
                    .split('\n')
                    .filter((line: string) => line.trim() !== '') // 空行を除去
                    .slice(0, 2)
                    .map((line: string, i: number) => ( // 型を明示的に指定
                      <p key={i} className="text-sm text-slate-500 font-medium line-clamp-1">
                        {line.replace(/^[*-]\s*/, '• ')}
                      </p>
                    ))
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic">要約を準備中...</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">Read Deep Dive</span>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {posts?.length === 0 && (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem]">
          <p className="text-slate-400 font-bold">まだ記事がありません。Pythonスクリプトを実行して投稿してみましょう！</p>
        </div>
      )}
    </div>
  );
}