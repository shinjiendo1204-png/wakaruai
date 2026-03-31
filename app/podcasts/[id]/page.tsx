import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Play, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function PodcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from('podcast_summaries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-20 text-center">
        <p className="text-slate-400 font-bold mb-4">記事が見つかりませんでした</p>
        <Link href="/podcasts" className="text-blue-600 font-black hover:underline">← 一覧に戻る</Link>
      </div>
    );
  }

  // YouTube URLから動画IDを抽出する関数
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(post.url);

  return (
    <article className="max-w-4xl mx-auto px-6 py-16 lg:py-24 space-y-12">
      
      {/* 1. ヘッダー：戻るリンクとタイトル */}
      <div className="space-y-6">
        <Link 
          href="/podcasts" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to list
        </Link>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
          {post.title}
        </h1>
      </div>

      {/* 2. YouTube 埋め込みプレイヤー */}
      {videoId ? (
        <div className="aspect-video w-full overflow-hidden rounded-[2.5rem] shadow-2xl border-[6px] border-slate-900 bg-slate-900 relative">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="aspect-video w-full bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">動画プレイヤーを読み込めませんでした</p>
        </div>
      )}

      {/* 3. 三行まとめ（青いボックス） */}
      <div className="bg-blue-50 p-8 md:p-12 rounded-[3rem] border-2 border-blue-100 relative overflow-hidden">
        {/* 背景の透かしアイコンを Play に変更 */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Play size={120} />
        </div>
        
        <h2 className="text-blue-600 font-black text-xl mb-6 flex items-center gap-2">
          🚀 QUICK SUMMARY
        </h2>
        <div className="prose prose-blue prose-lg max-w-none font-bold text-slate-700 leading-relaxed">
          <ReactMarkdown>{post.three_line_summary}</ReactMarkdown>
        </div>
      </div>

      {/* 4. メインコンテンツ（詳細レポート） */}
      <div className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-blue-600">
        <ReactMarkdown>{post.detail_report}</ReactMarkdown>
      </div>

      {/* 5. フッター：元動画へのリンクボタン */}
      <div className="pt-12 border-t-2 border-slate-100">
        <a 
          href={post.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-full font-black hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-100"
        >
          YouTubeで元のPodcastを見る <ExternalLink size={20} />
        </a>
      </div>

    </article>
  );
}