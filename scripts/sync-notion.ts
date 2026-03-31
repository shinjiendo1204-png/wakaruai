// @ts-nocheck
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";

dotenv.config({ path: ".env.local" });

// Supabase初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function sync() {
  console.log("🚀 同期を開始します...");

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    // 1. Notion API を直接 fetch で叩いてデータを取得
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Notion API Error: ${data.message}`);
    }

    console.log(`📦 ${data.results.length} 件のデータをNotionから取得しました。`);

    // Markdown変換用にClientだけは作成（ここは変換処理のみに使用）
    const notion = new Client({ auth: token });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    for (const page of data.results) {
      const props = page.properties as any;
      const supabaseId = props.id?.rich_text?.[0]?.plain_text;
      
      if (!supabaseId) {
        console.log(`⚠️ スキップ: ${page.id} (IDが未入力です)`);
        continue;
      }

      // --- ここから修正 ---
      let markdownContent = "";

      // 1. まず「ページの中身（本文）」をMarkdownに変換して取得
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdObject = n2m.toMarkdownString(mdblocks);
      markdownContent = mdObject.parent;

      // 2. もし「ページの中身」が空なら、予備として「description_jpセル」の内容を使う
      if (!markdownContent || markdownContent.trim() === "") {
        markdownContent = props.description_jp?.rich_text?.[0]?.plain_text || "";
      }
      // Supabaseを更新
      const { error: supabaseError } = await supabase
        .from('ai_tools')
        .update({ 
          description_jp: markdownContent 
        })
        .eq('id', supabaseId);

      if (supabaseError) {
        console.error(`❌ エラー [${supabaseId}]:`, supabaseError.message);
      } else {
        console.log(`✅ 同期完了: ${supabaseId}`);
      }
    }
  } catch (err: any) {
    console.error("❌ 致命的なエラー:", err.message);
  }
  
  console.log("✨ すべての処理が終了しました。");
}

sync();