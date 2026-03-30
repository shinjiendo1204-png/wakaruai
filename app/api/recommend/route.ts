import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { purpose, subPurpose, budget, needJp } = await req.json();

    // 1. カテゴリと予算で基本フィルタリング
    let query = supabase.from('ai_tools').select('*').eq('category', purpose);
    if (budget === 'free') {
      query = query.eq('has_free_tier', true);
    }

    const { data: tools, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 2. 詳細スコアリング（キーワードマッチング）
    const scoredTools = (tools || []).map((tool: any) => {
      let score = 0;

      // キーワードによる「用途マッチング」加点
      const keywordMap: Record<string, string[]> = {
        seo: ['SEO', 'ブログ', '記事', '長文', '執筆'],
        business: ['メール', 'ビジネス', '敬語', '文書'],
        ad: ['広告', 'コピー', 'SNS', 'キャッチ'],
        creative: ['物語', '創作', 'アイデア', '小説'],
        logo: ['ロゴ', 'アイコン', 'シンボル'],
        design: ['バナー', '図解', 'デザイン', 'スライド'],
        art: ['イラスト', 'アート', '実写', '風景'],
        editor: ['編集', 'カット', 'テロップ', 'YouTube'],
        gen: ['生成', 'AI動画', '自動作成'],
        audio: ['音楽', '歌詞'],
        avatar: ['アバター', 'ナレーション', '読み上げ'],
        transcribe: ['文字起こし', '議事録', '録音'],
        zap: ['自動化', '連携', 'ワークフロー'],
        search: ['社内', '検索', 'ナレッジ', 'RAG']
      };

      const matchKeywords = keywordMap[subPurpose] || [];
      matchKeywords.forEach(word => {
        // strengthやname、price_noteなどにキーワードがあれば加点
        if (tool.strength?.includes(word)) score += 40;
        if (tool.name?.toLowerCase().includes(word.toLowerCase())) score += 20;
      });

      // 日本語対応スコア
      if (needJp === 'required') {
        score += (tool.jp_score * 10);
      }

      // 予算一致スコア
      if (tool.price_range === budget) {
        score += 30;
      }

      return { ...tool, totalScore: score };
    });

    // 3. スコア順にソートして上位3件
    const top3 = scoredTools
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
      .slice(0, 3);

    return NextResponse.json(top3);
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}