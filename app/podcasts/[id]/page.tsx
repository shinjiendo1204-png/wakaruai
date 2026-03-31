// app/podcasts/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

export default async function PodcastDetailPage({ params }: { params: { id: string } }) {
  const { data: post } = await supabase
    .from('podcast_summaries')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!post) return <div>記事が見つかりません</div>;

  return (
    <article className="max-w-4xl mx-auto p-6 space-y-12">
      {/* 1. タイトル */}
      <h1 className="text-4xl font-black text-slate-900">{post.title}</h1>
      
      {/* 2. 三行まとめ（青いボックスなどで強調） */}
      <div className="bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100">
        <h2 className="text-blue-600 font-black mb-4 flex items-center gap-2">
          🚀 三行まとめ
        </h2>
        <div className="prose prose-blue font-bold">
          <ReactMarkdown>{post.three_line_summary}</ReactMarkdown>
        </div>
      </div>

      {/* 3. 詳細レポート */}
      <div className="prose prose-slate lg:prose-xl max-w-none">
        <h2 className="text-2xl font-black border-b pb-4">📝 詳細レポート</h2>
        <ReactMarkdown>{post.detail_report}</ReactMarkdown>
      </div>
      
      {/* 4. 元動画へのリンク */}
      <div className="pt-10 border-t">
        <a href={post.url} target="_blank" className="text-slate-400 hover:text-blue-600 font-bold">
          → 元のPodcast（YouTube）を視聴する
        </a>
      </div>
    </article>
  );
}