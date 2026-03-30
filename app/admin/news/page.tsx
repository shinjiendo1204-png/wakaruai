"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, Trash2, Edit3, Send, RefreshCw, X, Save } from 'lucide-react';

export default function AdminNewsPage() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  // 編集用の状態
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // 1. ニュース一覧を取得
  const fetchDrafts = async () => {
    const { data } = await supabase
      .from('ai_news')
      .select('*')
      .eq('is_published', false)
      .order('created_at', { ascending: false });
    if (data) setDrafts(data);
  };

  // 2. ニュースを公開する
  const publishNews = async (id: string) => {
    await supabase.from('ai_news').update({ is_published: true }).eq('id', id);
    fetchDrafts();
  };

  // 3. ニュースを削除する（ゴミ箱機能）
  const deleteNews = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    await supabase.from('ai_news').delete().eq('id', id);
    fetchDrafts();
  };

  // 4. 編集モードの開始
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  // 5. タイトルの保存
  const saveEdit = async (id: string) => {
    await supabase.from('ai_news').update({ title: editTitle }).eq('id', id);
    setEditingId(null);
    fetchDrafts();
  };

  const syncNews = async () => {
  setIsSyncing(true);
  try {
    // 1. APIを叩く（終わるまでしっかり待機）
    const res = await fetch('/api/cron/fetch-news');
    const data = await res.json();

    // 2. 収集結果をアラートで出す（任意）
    if (data.added && data.added.length > 0) {
      alert(`${data.added.length} 件の新しいニュースを収集しました！`);
    } else {
      alert("新しいニュースはありませんでした。");
    }

    // 3. 最新の状態をDBから再取得して画面を更新
    await fetchDrafts();
  } catch (error) {
    console.error("同期エラー:", error);
    alert("収集中にエラーが発生しました。");
  } finally {
    setIsSyncing(false);
  }
};

  useEffect(() => { fetchDrafts(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black">News Manager</h1>
        <button 
          onClick={syncNews}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          最新ニュースを収集
        </button>
      </div>

      <div className="grid gap-6">
        {drafts.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-grow">
              <span className="text-xs font-bold text-slate-400 block mb-2 line-clamp-1">{item.source_url}</span>
              
              {editingId === item.id ? (
                <div className="flex gap-2 mb-4">
                  <input 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-grow p-2 border-2 border-blue-500 rounded-lg font-bold outline-none"
                  />
                  <button onClick={() => saveEdit(item.id)} className="p-2 bg-blue-600 text-white rounded-lg"><Save size={18}/></button>
                  <button onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg"><X size={18}/></button>
                </div>
              ) : (
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              )}

              <div className="space-y-2">
                {item.summary_points?.map((p: string, i: number) => (
                  <p key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-blue-500">•</span> {p}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="flex md:flex-col gap-2 shrink-0">
              {/* 公開ボタン */}
              <button onClick={() => publishNews(item.id)} className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors" title="公開する">
                <Check size={20} />
              </button>
              {/* 編集ボタン */}
              <button onClick={() => startEdit(item)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors" title="編集する">
                <Edit3 size={20} />
              </button>
              {/* 削除ボタン */}
              <button onClick={() => deleteNews(item.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors" title="削除する">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}