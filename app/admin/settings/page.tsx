"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Globe, CheckCircle2, XCircle } from 'lucide-react';

export default function SettingsPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newLang, setNewLang] = useState("English");

  const fetchSources = async () => {
    const { data } = await supabase.from('rss_sources').select('*').order('created_at', { ascending: false });
    if (data) setSources(data);
  };

  const addSource = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('rss_sources').insert([
      { name: newName, url: newUrl, lang: newLang }
    ]);
    if (!error) {
      setNewName(""); setNewUrl("");
      fetchSources();
    }
  };

  const deleteSource = async (id: string) => {
    if (!confirm("このソースを削除しますか？")) return;
    await supabase.from('rss_sources').delete().eq('id', id);
    fetchSources();
  };

  useEffect(() => { fetchSources(); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Settings</h1>

      {/* ソース追加フォーム */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <Plus className="text-blue-600" /> RSSソースを追加
        </h2>
        <form onSubmit={addSource} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="サイト名" className="p-4 bg-slate-50 rounded-2xl outline-blue-600 font-bold" required />
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="RSS URL" className="p-4 bg-slate-50 rounded-2xl outline-blue-600 font-bold md:col-span-2" required />
          <button className="bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">追加</button>
        </form>
      </section>

      {/* ソース一覧 */}
      <section className="space-y-4">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <Globe className="text-blue-600" /> 現在の収集ソース
        </h2>
        {sources.map(source => (
          <div key={source.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-slate-900">{source.name}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">{source.lang}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{source.url}</p>
            </div>
            <button onClick={() => deleteSource(source.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}