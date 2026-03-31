import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';
import * as cheerio from 'cheerio'; // スクレイピング用

export const maxDuration = 60; // 処理時間が長くなるため延長

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  console.log("--- 全世界AIニュース収集（全文スクレイピング版）開始 ---");

  const { data: sources, error: dbError } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true);

  if (dbError || !sources) return NextResponse.json({ error: 'No sources' }, { status: 500 });

  const allItems = [];

  for (const source of sources) {
    try {
      console.log(`[${source.name}] フィード取得中...`);
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 3); // 1ソースにつき最新3件

      for (const item of items) {
        const link = item.link || item.guid;
        if (!link) continue;

        const { data: exists } = await supabase
          .from('ai_news')
          .select('id')
          .eq('source_url', link)
          .maybeSingle();

        if (exists) continue;

        // --- 1. 本文スクレイピング処理 ---
        let fullContent = "";
        try {
          const res = await fetch(link, { 
            next: { revalidate: 3600 },
            headers: { 'User-Agent': 'Mozilla/5.0' } 
          });
          const html = await res.text();
          const $ = cheerio.load(html);
          
          // 不要な要素（広告、ナビ、スクリプト）を削除
          $('script, style, nav, footer, ads, .ads, #ads').remove();
          
          // 本文と思われる箇所を抽出
          const paragraphs = $('article p, .article-content p, .entry-content p, main p, div[class*="article"] p')
            .map((i, el) => $(el).text())
            .get();
          
          fullContent = paragraphs.join('\n').trim();
        } catch (e) {
          console.error(`本文取得失敗: ${link}`);
        }

        // 本文が取れなかった場合は抜粋で代用
        if (fullContent.length < 200) {
          fullContent = item.contentSnippet || item.content || "";
        }

        // 文字数が多すぎるとAPI制限に掛かるため、先頭5000文字程度に制限
        const contextContent = fullContent.slice(0, 5000);

        console.log(`AI解析中（入力: ${contextContent.length}文字）: ${item.title}`);

        // --- 2. AIによる詳細生成 ---
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `あなたは技術・ビジネスの両面に精通した、AIニュース専門のシニア・エディターです。
              
              【指示】
              提供された原文(${source.lang})を、読者が「原文を読み直す必要がない」と感じるレベルまで、詳細かつ具体的に日本語で再構成してください。
              
              【厳格な出力形式（JSON）】
              {
                "title_jp": "30文字以内の具体的で興味を惹くタイトル",
                "summary": ["ニュースの最重要結論", "数値・固有名詞を含む具体的な事実", "市場への直接的な影響・予測"],
                "category": "ジャンル（LLM, 画像生成, 業界動向, ツール等）",
                "content_jp": "Markdown形式の長文詳細解説（1000文字以上を目指してください）"
              }

              【詳細執筆（content_jp）の絶対ガイドライン】
              1. **「リスト」の完全網羅**: 原文に「5つの特徴」「10個のスキル」等のリストがある場合、絶対に省略せず、全て書き出してください。抽象化（〜など）は禁止です。
              2. **具体的数値の保持**: 「性能向上」ではなく「〇〇%向上」等、原文の数値を全て残してください。
              3. **構造化の見出し**:
                 - ## 1. ニュースの概要と背景
                 - ## 2. 技術的仕様とベンチマーク詳細
                 - ## 3. 具体的な機能・活用シーン（全て列挙）
                 - ## 4. ビジネス・現場への影響
                 - ## 5. エディターズ・ビュー（独自考察）
              4. 500文字未満の回答は失敗とみなします。提供された情報を最大限に広げて解説してください。`
            },
            {
              role: "user",
              content: `Title: ${item.title}\n\nContent:\n${contextContent}`
            }
          ],
          response_format: { type: "json_object" }
        });

        const aiData = JSON.parse(completion.choices[0].message.content || "{}");

        // --- 3. DB保存 ---
        const { error: insertError } = await supabase.from('ai_news').insert({
          title: aiData.title_jp || item.title,
          summary_points: aiData.summary,
          content_jp: aiData.content_jp,
          source_url: link,
          tags: [aiData.category || 'AI', source.lang, source.name],
          is_published: false
        });

        if (!insertError) {
          allItems.push(aiData.title_jp);
          console.log(`保存成功: ${aiData.title_jp}`);
        }
      }
    } catch (e: any) {
      console.error(`[${source.name}] エラー: ${e.message}`);
    }
  }

  return NextResponse.json({ 
    message: 'Success', 
    count: allItems.length,
    added: allItems 
  });
}