import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { 
  Sparkles, HelpCircle, Lightbulb, ArrowLeft, BookOpen, 
  ExternalLink, Mic2, ArrowRight, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// 1. 全スラッグを事前取得して静的生成を高速化（SEO対策）
export async function generateStaticParams() {
  const { data: terms } = await supabase.from('ai_glossary').select('slug');
  return terms?.map((term) => ({ slug: term.slug })) || [];
}

export const dynamic = 'force-dynamic';

export default async function GlossaryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 2. メイン用語と関連用語を並列で取得
  const { data: term } = await supabase
    .from('ai_glossary')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!term) notFound();

  // 同じカテゴリの関連用語を3つ取得
  const { data: relatedTerms } = await supabase
    .from('ai_glossary')
    .select('term, slug, one_liner, category')
    .eq('category', term.category)
    .neq('slug', slug)
    .limit(3);

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 pb-24 animate-in fade-in duration-700">
      
      {/* ナビゲーション */}
      <Link href="/glossary" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-12 hover:text-blue-600 transition-all hover:-translate-x-1 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 用語一覧に戻る
      </Link>

      {/* ヒーロー：用語名 */}
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
          <BookOpen size={14} /> AI Glossary Hub
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
          {term.term}
        </h1>
        <p className="text-xl text-slate-400 font-bold tracking-tight italic">{term.en_term}</p>
      </header>

      {/* AEOセクション：ひとことで言うと */}
      <section className="bg-slate-900 text-white p-8 md:p-16 rounded-[3.5rem] mb-20 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700"></div>
        <Sparkles className="absolute top-0 right-0 m-10 text-blue-500/30" size={60} />
        
        <h2 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-white/10 pb-4 w-fit">
          <Lightbulb size={16} /> ひとことで言うと
        </h2>
        <p className="text-2xl md:text-4xl font-black leading-[1.2] relative z-10">
          {term.one_liner}
        </p>
      </section>

      {/* メインレイアウト */}
      <div className="grid md:grid-cols-3 gap-16">
        <div className="md:col-span-2 space-y-20">
          
          {/* 詳しく言うと */}
          <section className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-6 prose-h2:mb-10
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
            prose-strong:text-slate-900 prose-strong:font-black">
            <h2>詳しく言うと</h2>
            <ReactMarkdown>{term.description_jp?.replace(/\\n/g, '\n')}</ReactMarkdown>
          </section>

          {/* 戦略的価値 */}
          <section className="bg-slate-50 p-10 md:p-14 rounded-[3rem] border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                <Sparkles size={120} />
             </div>
            <h2 className="text-2xl font-black mb-8 text-slate-900">戦略的価値</h2>
            <p className="text-slate-600 font-bold leading-relaxed text-lg">{term.why_important}</p>
          </section>

          {/* FAQ（AEO/GEO対策） */}
          <section className="pt-10 border-t border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-900">
              <HelpCircle className="text-blue-600" size={28} /> よくある質問（FAQ）
            </h2>
            <div className="space-y-6">
              {term.faq_json?.map((faq: any, i: number) => (
                <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                  <p className="font-black text-slate-900 mb-4 text-lg">Q. {faq.q}</p>
                  <p className="text-slate-500 font-medium border-t border-slate-50 pt-5 leading-relaxed">
                    <span className="text-blue-600 font-black mr-2">A.</span> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* --- 関連用語セクション --- */}
          {relatedTerms && relatedTerms.length > 0 && (
            <section className="pt-20">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-slate-200"></div>
                Related Intelligence
                <div className="h-px w-12 bg-slate-200"></div>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedTerms.map((rel) => (
                  <Link 
                    key={rel.slug} 
                    href={`/glossary/${rel.slug}`}
                    className="group bg-slate-50 p-6 rounded-[2rem] border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-black text-blue-500 uppercase mb-3 block opacity-60">{rel.category}</span>
                      <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{rel.term}</h3>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{rel.one_liner}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* サイドバー */}
        <aside className="space-y-8 md:sticky md:top-24 h-fit">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl">
            <h3 className="font-black text-[10px] text-blue-400 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4">実務での活用例</h3>
            <ul className="space-y-6">
              {term.examples?.map((ex: string, i: number) => (
                <li key={i} className="flex gap-4 text-sm font-bold items-start leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> {ex}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200">
            <p className="text-[10px] font-black opacity-60 mb-2 uppercase">Recommended Action</p>
            <p className="font-black text-xl mb-8 leading-tight">{term.term} を活用できる最新ツールを見る</p>
            <Link href="/tools" className="w-full bg-white text-blue-600 py-5 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              ツールを探す <ExternalLink size={16} />
            </Link>
          </div>
        </aside>
      </div>

      {/* 下部ナビゲーション */}
      <div className="mt-24 pt-12 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <Link 
          href="/glossary" 
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white text-slate-900 border-2 border-slate-200 px-12 py-6 rounded-[2.5rem] font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-all group shadow-sm"
        >
          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          用語一覧に戻る
        </Link>

        <div className="flex flex-col items-center md:items-end gap-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Intelligence</p>
           <Link 
            href="/podcasts" 
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] font-black hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
          >
            最新のPodcast要約を読む <Mic2 size={20} />
          </Link>
        </div>
      </div>

    </article>
  );
}