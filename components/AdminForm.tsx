// src/components/AdminForm.tsx
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminForm() {
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '', category: 'writing', target: '', jp_score: 5,
    difficulty: 1, strength: '', weakness: '',
    price_range: '低', has_free_tier: true, url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('送信中...');
    
    const { error } = await supabase.from('ai_tools').insert([formData]);
    
    if (error) setStatus('エラー: ' + error.message);
    else {
      setStatus('成功！ツールを追加しました。');
      setFormData({ ...formData, name: '', strength: '', weakness: '', url: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 bg-gray-50 p-8 rounded-xl border">
      <h3 className="text-xl font-bold">新規ツール登録</h3>
      <input
        placeholder="ツール名"
        className="w-full p-2 border rounded"
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <select 
          className="p-2 border rounded"
          value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}
        >
          <option value="writing">文章作成</option>
          <option value="image">画像生成</option>
          <option value="video">動画制作</option>
          <option value="auto">自動化</option>
        </select>
        <select 
          className="p-2 border rounded"
          value={formData.price_range}
          onChange={e => setFormData({...formData, price_range: e.target.value})}
        >
          <option value="無料">無料</option>
          <option value="低">低 (〜$20)</option>
          <option value="中">中 (〜$50)</option>
          <option value="高">高 (エンタープライズ)</option>
        </select>
      </div>
      <textarea
        placeholder="選ぶ理由（強み）"
        className="w-full p-2 border rounded h-24"
        value={formData.strength}
        onChange={e => setFormData({...formData, strength: e.target.value})}
      />
      <textarea
        placeholder="選ばない理由（弱点）"
        className="w-full p-2 border rounded h-24 text-red-600"
        value={formData.weakness}
        onChange={e => setFormData({...formData, weakness: e.target.value})}
      />
      <input
        placeholder="公式サイトURL"
        className="w-full p-2 border rounded"
        value={formData.url}
        onChange={e => setFormData({...formData, url: e.target.value})}
      />
      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
        データベースへ追加
      </button>
      {status && <p className="text-center font-semibold text-blue-600">{status}</p>}
    </form>
  );
}