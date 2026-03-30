import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// タイムアウト対策
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  console.log("--- AIツール詳細・全プラン・業界 一括生成（データ補完モード）開始 ---");

  // 1. 業界(target_industries)がまだ空のものを5件取得
  const { data: targetTools, error: dbError } = await supabase
    .from('ai_tools')
    .select('id, name, url')
    .is('target_industries', null) 
    .order('created_at', { ascending: false })
    .limit(5);

  if (dbError || !targetTools || targetTools.length === 0) {
    console.log("未処理のツールは見つかりませんでした。");
    return NextResponse.json({ message: 'All tools are already processed.' });
  }

  const processedTools = [];

  for (const tool of targetTools) {
    try {
      console.log(`[${tool.name}] 解析中...`);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `あなたはプロのAIツール調査員です。日本のビジネスマン向けに詳細な情報をJSONで提供してください。

            【価格調査の鉄則】
            - 無料プラン、個人プラン、チームプラン、Proプランなど、公式サイトに掲載されている「全ての有料プラン」を網羅して記載してください。
            - 1ドル=160円で換算し、日本円での月額目安を必ず併記してください。
            - price_textには全プランの名称と価格を「 / 」で区切って1行で記載してください。
            - 具体的な金額は必ず調査した最新の結果を反映し、テンプレートの例をそのまま書かないでください。
            
            【業界選択】
            - 以下のリストから1〜4個選んでください。汎用ツールなら必ず「全業種」を含めてください。
            - リスト: [全業種, IT・通信, 不動産, 製造, 金融, 医療, 教育, 飲食・小売, 建設, 個人開発]

            【出力形式の指定（※金額はダミーです、必ず書き換えてください）】
            {
              "description_jp": "## 概要\\n(300文字程度の解説)",
              "weak_points": ["弱点1", "弱点2"],
              "use_cases": ["利用シーン1", "利用シーン2"],
              "target_industries": ["全業種", "関連業界"],
              "price_text": "プラン名: 月額約〇〇円 ($〇〇) / プラン名: 月額約〇〇円 ($〇〇)",
              "jp_score": 1から5の整数
            }`
          },
          {
            role: "user",
            content: `ツール名: ${tool.name}\nURL: ${tool.url}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const aiData = JSON.parse(completion.choices[0].message.content || "{}");

      // --- 型ガード処理 ---
      const industries = Array.isArray(aiData.target_industries) 
        ? aiData.target_industries 
        : [aiData.target_industries || "全業種"];

      const jpScore = parseInt(String(aiData.jp_score)) || 3;

      // --- DBへ保存 ---
      const { error: updateError } = await supabase
        .from('ai_tools')
        .update({
          description_jp: aiData.description_jp,
          weak_points: aiData.weak_points,
          use_cases: aiData.use_cases,
          target_industries: industries,
          price_text: aiData.price_text, // AIが生成した実際の価格テキストを反映
          jp_score: jpScore,
        })
        .eq('id', tool.id);

      if (!updateError) {
        processedTools.push(tool.name);
        console.log(`[${tool.name}] ✅ 更新成功！ 価格: ${aiData.price_text}`);
      } else {
        console.error(`[${tool.name}] 更新失敗:`, updateError.message);
      }
    } catch (e: any) {
      console.error(`[${tool.name}] システムエラー: ${e.message}`);
    }
  }

  return NextResponse.json({ 
    message: 'Success', 
    processed_count: processedTools.length,
    processed: processedTools 
  });
}