import os
import math
from pathlib import Path
from yt_dlp import YoutubeDL
from openai import OpenAI
from pydub import AudioSegment
from supabase import create_client, Client
from dotenv import load_dotenv

# --- 1. .env の読み込み設定 ---
# 自分のファイル(summary.py)の場所から見て、1つ上の階層にある .env を指定
env_path = Path(__file__).resolve().parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)

# --- 2. 読み込みチェック（デバッグ用：動いたら消してOK） ---
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print(f"❌ エラー: .env が見つからないか、中身が空です。")
    print(f"探した場所: {env_path}")
    exit()

# --- 3. 道具の準備 ---
client = OpenAI(api_key=api_key)
supabase: Client = create_client(
    os.getenv("NEXT_PUBLIC_SUPABASE_URL"), 
    os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)
# 4. 関数の定義
def download_audio(youtube_url): # 👈 名前を download_audio に修正
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
        ydl.download([youtube_url]) # 👈 引数名と合わせました
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
    """三行まとめと詳細レポートを作成"""
    print(f"--- 3. AIによる記事作成中... ---")
    response = client.chat.completions.create(
        model="gpt-4o-mini", 
        messages=[
            {"role": "system", "content": "あなたはTechCrunchやWIREDの敏腕編集者です。技術的な正確さを保ちつつ、読者の知的好奇心を刺激するエモーショナルな文章を書いてください。"},
            {"role": "user", "content": f"""
以下の文字起こしを元にレポートを作成してください。
1. 【タイトル】
   - 読者が思わずクリックしたくなる、内容の核心を突くキャッチーなタイトル。
[SEPARATOR]
2. 【三行まとめ】
   - 最も重要なポイントを3つの箇条書きで（1分で内容が把握できるもの）。
[SEPARATOR]
3. 【詳細レポート（1000文字程度）】
   以下の構成に沿って、専門用語を交えつつ具体的に記述してください：
   - ■イントロ：この対談の背景。今、なぜこのトピックが世界で注目されているのか。
   - ■技術・ビジネスの核心：議論のメインテーマ。従来の技術と何が違うのか、何が「破壊的」なのかを3〜4つのパラグラフで深掘り。
   - ■スピーカーの「本音」と「予言」：台本通りではない、彼らが漏らした不安、自信、あるいは数年後の未来予測を具体的に引用して解説。
   - ■結末とまとめ：今後の展望や業界への影響を示唆して締めくくる。

各セクションの間には必ず [SEPARATOR] とだけ書いた行を入れてください。
\n\n{text}"""}
        ]
    )
    return response.choices[0].message.content

def save_to_supabase(url, summary_text):
    """Supabaseにデータを保存する"""
    print(f"--- 4. Supabaseに投稿中... ---")
    parts = summary_text.split("[SEPARATOR]")
    
    # AIの出力から各パーツを取り出す
    title_val = parts[0].strip() if len(parts) > 0 else "Untitled"
    three_line = parts[1].strip() if len(parts) > 1 else ""
    detail = parts[2].strip() if len(parts) > 2 else ""

    data = {
        "title": title_val,
        "url": url,
        "three_line_summary": three_line,
        "detail_report": detail
    }
    
    # 指定したテーブル名にインサート
    supabase.table("podcast_summaries").insert(data).execute()
    print("✅ 投稿が完了しました！サイトを確認してください。")

# --- 3. メイン処理 ---
if __name__ == "__main__":
    # URLをターゲットの動画に変更
    target_url = "https://www.youtube.com/watch?v=4Gmd5UTF4rk" 
    
    audio_file = download_audio(target_url)
    try:
        full_text = process_long_audio(audio_file)
        full_output = summarize_and_format(full_text)
        
        # コンソールにも表示
        print("\n=== ✨ 生成されたレポート ===\n")
        print(full_output)
        
        # 投稿実行
        save_to_supabase(target_url, full_output)

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
    finally:
        if os.path.exists(audio_file):
            os.remove(audio_file)