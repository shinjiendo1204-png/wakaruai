// components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Send } from 'lucide-react';

export default function ReviewForm({ toolId }: { toolId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('reviews').insert([
      { 
        tool_id: toolId, 
        rating, 
        comment, 
        industry, 
        is_approved: true // 最初は自動承認にするか、運営確認にするか
      }
    ]);

    if (!error) {
      alert('クチコミを投稿しました！');
      setComment('');
      window.location.reload(); // 簡易的な更新
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
      <h3 className="font-black text-slate-900 flex items-center gap-2">
        <Star className="text-amber-400" fill="currentColor" size={20} />
        レビューを投稿する
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 業界選択 */}
        <select 
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          required
        >
          <option value="">あなたの業界を選択</option>
          <option value="IT・通信">IT・通信</option>
          <option value="製造">製造</option>
          <option value="不動産">不動産</option>
          <option value="個人開発">個人開発</option>
        </select>

        {/* 星評価 */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)}>
              <Star size={20} className={s <= rating ? "text-amber-400 fill-current" : "text-slate-300"} />
            </button>
          ))}
        </div>
      </div>

      <textarea 
        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        placeholder="実際の使用感や、おすすめの使い道を教えてください..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button 
        disabled={isSubmitting}
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
      >
        {isSubmitting ? '送信中...' : 'レビューを公開する'} <Send size={18} />
      </button>
    </form>
  );
}