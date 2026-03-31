import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { postReview } from './actions';
import { 
  ArrowLeft, Globe, Zap, AlertTriangle, ExternalLink, 
  CheckCircle2, MessageSquareText, Star, CornerDownRight, Heart,
  ImageIcon // アイコンを追加
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: tool } = await supabase.from('ai_tools').select('name, strength').eq('id', id).single();
  
  return {
    title: `${tool?.name || 'ツール詳細'} | ワかるAI`,
    description: tool?.strength || 'AIツールの詳細な特徴、料金、口コミを三行で解説。',
  };
}

export const dynamic = 'force-dynamic';

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. ツール詳細とレビューを同時取得
  const [toolRes, reviewsRes] = await Promise.all([
    supabase.from('ai_tools').select('*').eq('id', id).single(),
    supabase.from('reviews').select('*').eq('tool_id', id).order('created_at', { ascending: false })
  ]);

  const tool = toolRes.data;
  const reviews = reviewsRes.data;

  if (!tool) notFound();

  // --- ★追加：構造化データ（JSON-LD）の定義 ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.strength,
    "applicationCategory": "MultimediaApplication", // カテゴリに合わせて変更可
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": tool.price_text?.includes('Free') ? "0" : "1", // 簡易的なフラグ
      "priceCurrency": "JPY",
    },
    // レビューがある場合のみ評価データを追加
    ...(reviews && reviews.length > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
        "ratingCount": reviews.length,
      }
    })
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-24 animate-in fade-in duration-700">
      
      {/* --- ★追加：Google用構造化データ --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    
      {/* 1. ナビゲーション */}
      <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-all hover:-translate-x-1">
          <ArrowLeft size={18} /> ツール一覧に戻る
        </Link>
        
        <button className="flex items-center gap-3 border-2 border-slate-900 bg-white hover:bg-slate-50 px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all group">
          <Heart size={20} className="text-pink-500 group-hover:fill-pink-500 transition-colors" />
          <span className="font-black text-slate-900 text-sm">お気に入り</span>
          <span className="bg-slate-100 text-slate-500 font-black text-xs px-3 py-1 rounded-lg ml-2">{tool.votes_count || 0}</span>
        </button>
      </div>

      {/* 2. ヒーローセクション（ロゴを追加） */}
      <div className="flex flex-col md:flex-row gap-10 items-start mb-16 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        
        {/* --- ★追加：ツールロゴエリア --- */}
        <div className="w-32 h-32 rounded-3xl bg-slate-900 shadow-xl flex items-center justify-center shrink-0 border-4 border-white overflow-hidden shadow-slate-200">
          {tool.icon_url ? (
            <img src={tool.icon_url} alt={`${tool.name} logo`} className="w-full h-full object-cover" />
          ) : (
            // ロゴがない場合のフォールバックアイコン
            <Zap size={64} className="text-blue-500 fill-blue-500/10" />
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{tool.category}</span>
            {tool.jp_score >= 4 && <span className="flex items-center gap-1 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase"><Globe size={12} /> 日本語対応</span>}
            <div className="flex items-center gap-1 ml-2 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-slate-900 font-black text-sm">{(reviews?.length || 0) > 0 ? (reviews!.reduce((acc, r) => acc + r.rating, 0) / reviews!.length).toFixed(1) : "---"}</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">{tool.name}</h1>
          <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">{tool.strength}</p>
        </div>
      </div>

      {/* 3. メインレイアウト */}
      <div className="grid md:grid-cols-3 gap-12 items-start mb-24">
        
        {/* 左側コンテンツ */}
        <div className="md:col-span-2 space-y-12">
          
          {/* --- ★追加：スクリーンショットエリア --- */}
          <div className="rounded-[3rem] overflow-hidden border-4 border-slate-100 shadow-2xl shadow-slate-200 bg-white aspect-video relative group cursor-zoom-in">
            {tool.screenshot_url ? (
              <img 
                src={tool.screenshot_url} 
                alt={`${tool.name} screenshot`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              // 画像がない場合のフォールバック
              <div className="flex flex-col items-center justify-center h-full text-slate-300 bg-slate-50">
                <ImageIcon size={64} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-400">Preview Image</p>
              </div>
            )}
            {/* ホバー時のオーバーレイ演出 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <ExternalLink size={32} className="text-white opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" />
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-3 border-b border-slate-50 pb-5 text-slate-900">
              <Zap className="text-blue-600" size={24} /> ツール詳細レビュー
            </h2>
            <div className="prose prose-slate prose-lg max-w-none">
            <ReactMarkdown>
              {tool.description_jp?.replace(/\\n/g, '\n')}
            </ReactMarkdown>
            </div>
          </div>

          {/* クチコミエリア */}
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-900 border-b border-slate-50 pb-5">
              <MessageSquareText className="text-blue-600" size={24} /> ユーザーのクチコミ
            </h2>

            {/* 投稿フォーム */}
            <form action={postReview} className="mb-16 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <input type="hidden" name="toolId" value={tool.id} />
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest"><Star size={16} className="text-amber-500 fill-amber-500" /> レビューを投稿する</h3>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <input name="userName" required type="text" placeholder="お名前" className="flex-1 p-4 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-500" />
                  <select name="rating" className="md:w-48 p-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 outline-none">
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>
                <textarea name="comment" required placeholder="実際に使ってみた感想を教えてください！" rows={3} className="w-full p-6 rounded-[1.5rem] border border-slate-200 text-sm outline-none focus:border-blue-500" />
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all">クチコミを送信する</button>
              </div>
            </form>

            {/* 一覧表示 */}
            <div className="space-y-10">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="flex gap-6 pb-10 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">👤</div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <p className="font-black text-slate-900">{review.user_name} <span className="text-xs text-slate-400 font-medium ml-2">{new Date(review.created_at).toLocaleDateString('ja-JP')}</span></p>
                        <div className="flex gap-0.5 text-amber-400">{[...Array(5)].map((_, si) => <Star key={si} size={14} fill={si < review.rating ? "currentColor" : "none"} />)}</div>
                      </div>
                      <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-3xl"><p className="text-slate-400 font-bold">まだレビューはありません。最初の1人になりませんか？</p></div>
              )}
            </div>
          </div>
        </div>

        {/* 右側：サイドバーエリア */}
        <div className="space-y-8 md:sticky md:top-8">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-10 border-b border-white/10 pb-3 text-center">Price & Support</h3>
            <div className="space-y-10 mb-12">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-4">利用プラン・料金目安</p>
                <div className="space-y-3">
                  {tool.price_text ? tool.price_text.split('/').map((plan: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                      <p className="text-xs font-bold leading-relaxed tracking-tight">{plan.trim()}</p>
                    </div>
                  )) : <p className="text-slate-500 font-bold italic text-xs">価格情報確認中</p>}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-tighter">日本語対応スコア</p>
                <div className="flex gap-1.5 items-center bg-slate-800 p-4 rounded-xl">
                  {[...Array(5)].map((_, i) => <div key={i} className={`h-2.5 w-full rounded-full ${i < tool.jp_score ? 'bg-blue-500' : 'bg-slate-700'}`} />)}
                  <span className="ml-3 text-sm font-black text-blue-400">{tool.jp_score}/5</span>
                </div>
              </div>
            </div>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20">公式サイトへ <ExternalLink size={20} /></a>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
            <div>
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-sm uppercase tracking-wider"><CheckCircle2 className="text-green-500" size={20} /> メリット</h4>
              <ul className="text-xs text-slate-500 space-y-4 font-bold">
                {tool.use_cases?.map((item: string, i: number) => <li key={i} className="flex gap-3 leading-relaxed"><CornerDownRight className="text-green-500 shrink-0" size={14} />{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-sm uppercase tracking-wider"><AlertTriangle className="text-red-500" size={20} /> 注意点</h4>
              <ul className="text-xs text-slate-500 space-y-4 font-bold">
                {tool.weak_points?.map((item: string, i: number) => <li key={i} className="flex gap-3 leading-relaxed"><CornerDownRight className="text-red-500 shrink-0" size={14} />{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* --- ★追加：フッターナビゲーション --- */}
      <div className="mt-20 pt-12 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* 右側：一覧に戻る（サブ） */}
        <Link 
          href="/tools" 
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-400 border-2 border-slate-100 px-10 py-6 rounded-[2rem] font-black hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          ツール一覧に戻る
        </Link>
        
      </div>
      </div>
    </div>
  );
}