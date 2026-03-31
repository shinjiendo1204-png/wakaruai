import os
import math
import re
from pathlib import Path
from yt_dlp import YoutubeDL
from openai import OpenAI
from pydub import AudioSegment
from supabase import create_client, Client
from dotenv import load_dotenv

# --- 1. .env の読み込み設定 ---
# scriptsフォルダの1つ上の階層にある .env.local を読み込む
env_path = Path(__file__).resolve().parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)

# --- 2. 初期設定とバリデーション ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not OPENAI_API_KEY or not SUPABASE_URL or not SUPABASE_KEY:
    print(f"❌ エラー: 環境変数が読み込めませんでした。")
    print(f"探した場所: {env_path}")
    exit()

client = OpenAI(api_key=OPENAI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 3. 関数の定義 ---

def download_audio(youtube_url):
    """YouTubeから音声を抽出・圧縮する"""
    print(f"\n--- 1. 音声を抽出中... ---")
    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '64',
        }],
        'postprocessor_args': ['-ac', '1'], # モノラル化
        'outtmpl': 'temp_audio.%(ext)s',
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])
    return "temp_audio.mp3"

def process_long_audio(file_path):
    """音声を20分ごとに分割して文字起こしする"""
    print(f"--- 2. 音声を分割・文字起こし中 (Whisper)... ---")
    audio = AudioSegment.from_mp3(file_path)
    chunk_length = 20 * 60 * 1000 # 20分
    chunks = math.ceil(len(audio) / chunk_length)
    full_transcript = ""
    
    for i in range(chunks):
        print(f"   >> パート {i+1}/{chunks} を処理中...")
        start = i * chunk_length
        end = (i + 1) * chunk_length
        chunk = audio[start:end]
        chunk_name = f"chunk_{i}.mp3"
        chunk.export(chunk_name, format="mp3")
        
        with open(chunk_name, "rb") as f:
            response = client.audio.transcriptions.create(model="whisper-1", file=f)
            full_transcript += response.text + " "
        os.remove(chunk_name)
    return full_transcript
def summarize_and_format(text):
    """
    テックメディア風の超濃密レポート作成（Paid Tier / gpt-4o 推奨）
    """
    print(f"--- 3. AIによるメディア風・深掘りレポートを作成中... ---")
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # 有料プランなら必ず gpt-4o を使用（miniより論理展開が深い）
        messages=[
            {
                "role": "system", 
                "content": (
                    "あなたは『The Verge』や『WIRED』のリードエディターです。"
                    "2時間のPodcastから、読者が一気読みしてしまうような3,000文字規模の「ノンフィクション・テックレポート」を執筆してください。"
                    "『第1章』や『背景』といった教科書的な見出しは厳禁です。内容を象徴する、文学的かつ知的な見出しを自らひねり出してください。"
                )
            },
            {
                "role": "user", 
                "content": f"""
以下の文字起こしを解析し、最高品質のテックレポートを作成してください。

1. 【メインタイトル】
   - 記事の顔となる、強烈なインパクトと知性を兼ね備えたタイトルを1行で。

[SEPARATOR]

2. 【リード文（三行まとめ）】
   - 忙しい読者のためのエッセンスを3つの箇条書きで。

[SEPARATOR]

3. 【本編：ディープダイブ・レポート】
   以下の5〜6つの「論理フェーズ」に沿って執筆してください。
   各フェーズの見出し（###）は、内容に合わせて「あなたが独自に作成」してください。

   - フェーズ1：議論の火種（なぜ今、この対話が必要なのか。その衝撃の正体）
   - フェーズ2：技術・構造の破壊（何が変わり、何が置き去りにされるのか。具体的なプロダクトや数値を交えた深掘り）
   - フェーズ3：地政学とビジネス（市場の歪み、国家間競争、資本の動きなど、より広い視点での戦略的分析）
   - フェーズ4：スピーカーの独白（彼らが漏らした「未来の予言」や、印象的な発言を 引用（> ）として3箇所以上挿入）
   - フェーズ5：私たちの生存戦略（結論として、私たちはこの変化にどう立ち向かうべきか）

※ 注意事項：
- 各見出しは必ず `### 見出しテキスト` の形式にすること。
- 「フェーズ1」などの文字は見出しに含めないこと。
- 各項目の間には必ず [SEPARATOR] とだけ書いた行を入れてください。
- 3,000文字以上のボリュームを維持し、情報密度を極限まで高めてください。

文字起こしデータ：
\n\n{text}"""
            }
        ],
        temperature=0.7, # 表現を少し豊かにするために0.7に設定
    )
    return response.choices[0].message.content

def save_to_supabase(url, summary_text):
    """Supabaseにデータを保存する"""
    print(f"--- 4. Supabaseに投稿中... ---")
    
    parts = summary_text.split("[SEPARATOR]")
    
    def clean_text(text, labels):
        for label in labels:
            text = re.sub(label, "", text, flags=re.IGNORECASE)
        return text.replace("#", "").strip()

    # ラベルを削除して純粋な中身だけ抽出
    target_labels = [r"1\.\s*【タイトル】", r"2\.\s*【三行まとめ】", r"3\.\s*【詳細レポート.*】"]

    title_val = clean_text(parts[0], target_labels) if len(parts) > 0 else "Untitled"
    three_line = clean_text(parts[1], target_labels) if len(parts) > 1 else ""
    detail = clean_text(parts[2], target_labels) if len(parts) > 2 else ""

    data = {
        "title": title_val,
        "url": url,
        "three_line_summary": three_line,
        "detail_report": detail
    }
    
    res = supabase.table("podcast_summaries").insert(data).execute()
    print(f"✅ 投稿が完了しました！作成されたID: {res.data[0]['id']}")

# --- 4. メイン処理 ---
if __name__ == "__main__":
    # 📢 ここに要約したいYouTube動画のURLを入れてください
    target_url = "https://www.youtube.com/watch?v=Axpnkqd-Agk" 
    
    audio_file = None
    try:
        audio_file = download_audio(target_url)
        full_text = process_long_audio(audio_file)
        full_output = summarize_and_format(full_text)
        
        # 保存実行
        save_to_supabase(target_url, full_output)

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        
    finally:
        # 一時ファイルの削除
        if audio_file and os.path.exists(audio_file):
            os.remove(audio_file)
            print("🧹 一時音声ファイルを削除しました。")