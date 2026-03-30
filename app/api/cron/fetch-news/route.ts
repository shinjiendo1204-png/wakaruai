import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// 詳細生成には時間がかかるため、タイムアウトを60秒に延長（Vercel等の環境用）
export const maxDuration = 60;

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  console.log("--- 全世界AIニュース収集（詳細解説対応版）開始 ---");

  // 1. DBから有効なソースを取得
  const { data: sources, error: dbError } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true);

  if (dbError || !sources || sources.length === 0) {
    console.error("ソースの取得に失敗、またはソースが空です:", dbError);
    return NextResponse.json({ error: 'No sources found' }, { status: 500 });
  }

  const allItems = [];

  // 2. 取得したソースをループ
  for (const source of sources) {
    try {
      console.log(`[${source.name}] 接続中...`);
      const feed = await parser.parseURL(source.url);
      
      // 負荷軽減のため、各ソース最新1件のみを対象にする（詳細生成は重いため）
      const items = (feed.items || []).slice(0, 3);

      for (const item of items) {
        const link = item.link || item.guid;
        if (!link) continue;

        // 重複チェック
        const { data: exists } = await supabase
          .from('ai_news')
          .select('id')
          .eq('source_url', link)
          .maybeSingle();

        if (!exists) {
          console.log(`AI解析依頼中（3行要約 + 詳細解説）: ${item.title}`);
          
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `あなたは多言語AIニュース専門エディターです。原語(${source.lang})の記事を分析し、以下のJSON形式で回答してください。
                
                {
                  "title_jp": "30文字以内の日本語タイトル",
                  "summary": ["最重要点1", "最重要点2", "最重要点3"],
                  "category": "ジャンル",
                  "content_jp": "## 概要\\n(ここに全体の要約)\\n\\n### 技術的ポイントと背景\\n(背景や仕組みの解説)\\n\\n### ビジネス・現場への影響\\n(日本の読者にどう関わるか)\\n\\n### 今後の展望\\n(将来の予測)"
                }
                
                ※summaryは一覧用の短い3行。content_jpは詳細ページ用のマークダウン形式（500文字程度）で深く解説してください。`
              },
              {
                role: "user",
                content: `Title: ${item.title}\nContent: ${item.contentSnippet || item.content}`
              }
            ],
            response_format: { type: "json_object" }
          });

          const aiData = JSON.parse(completion.choices[0].message.content || "{}");

          // 3. DBへ保存（content_jpを含める）
          const { error: insertError } = await supabase.from('ai_news').insert({
            title: aiData.title_jp || item.title,
            summary_points: aiData.summary, // 3行要約
            content_jp: aiData.content_jp,   // 詳細解説（追加！）
            source_url: link,
            tags: [aiData.category || 'AI', source.lang, source.name],
            is_published: false // 管理画面で確認してから公開
          });

          if (!insertError) {
            allItems.push(aiData.title_jp);
            console.log(`保存成功: ${aiData.title_jp}`);
          } else {
            console.error("保存失敗:", insertError);
          }
        }
      }
    } catch (e: any) {
      console.error(`[${source.name}] 取得エラー: ${e.message}`);
    }
  }

  return NextResponse.json({ 
    message: 'Success', 
    added_count: allItems.length,
    added: allItems 
  });
}