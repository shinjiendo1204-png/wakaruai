"use client";

import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle, CheckCircle2, Trophy, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

interface ResultViewProps {
  tools: any[];
  onReset: () => void;
}

export default function ResultView({ tools, onReset }: ResultViewProps) {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  const getBadge = (index: number) => {
    if (index === 0) return { icon: <Trophy className="text-yellow-500" />, label: "ベストチョイス", color: "bg-yellow-50" };
    if (index === 1) return { icon: <Zap className="text-blue-500" />, label: "高コスパ", color: "bg-blue-50" };
    return { icon: <ShieldCheck className="text-green-500" />, label: "プロ推奨", color: "bg-green-50" };
  };

  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">あなたに最適な3選</h2>
        <p className="text-slate-500">条件に合わせて、以下のAIをおすすめします</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const badge = getBadge(index);
          return (
            <motion.div key={tool.id} variants={item} className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50 flex flex-col h-full hover:shadow-2xl transition-shadow">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.color} text-xs font-bold mb-4`}>
                {badge.icon} {badge.label}
              </div>
              <h3 className="text-2xl font-bold mb-6">{tool.name}</h3>
              
              <div className="space-y-4 flex-grow">
                <div className="bg-green-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-green-700 font-bold text-xs mb-1"><CheckCircle2 size={14} /> 強み</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{tool.strength}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-1"><AlertTriangle size={14} /> 弱点</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{tool.weakness}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
  <div className="flex justify-between items-start text-sm mb-6 font-bold">
    <span className="text-slate-400 font-medium shrink-0">価格目安</span>
    
    {/* 右側にプランを縦に並べる */}
    <div className="flex flex-col items-end gap-2 text-right">
      {tool.price_text ? (
        tool.price_text.split('/').map((plan: string, index: number) => (
          <span 
            key={index} 
            className="bg-slate-50 text-slate-700 px-3 py-1 rounded-md border border-slate-100 text-[12px] tracking-tight leading-none"
          >
            {plan.trim()}
          </span>
        ))
      ) : (
        <span className="text-slate-300 italic">情報なし</span>
      )}
    </div>
  </div>

                <a href={tool.url} target="_blank" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                  公式サイト <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 比較表 */}
      <div className="mt-20 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
              <th className="p-6">スペック比較</th>
              {tools.map(t => <th key={t.id} className="p-6 text-center">{t.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-6 text-sm font-bold">日本語対応</td>
              {tools.map(t => <td key={t.id} className="p-6 text-center text-blue-600">{"★".repeat(t.jp_score)}</td>)}
            </tr>
            <tr>
              <td className="p-6 text-sm font-bold">導入難易度</td>
              {tools.map(t => <td key={t.id} className="p-6 text-center text-slate-600">{t.difficulty <= 2 ? 'かんたん' : '学習が必要'}</td>)}
            </tr>
            <tr>
              <td className="p-6 text-sm font-bold">無料プラン</td>
              {tools.map(t => <td key={t.id} className="p-6 text-center">{t.has_free_tier ? '✅ あり' : 'ー'}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-8">
        <button onClick={onReset} 
        className="flex items-center gap-2 px-8 py-4 bg-white text-slate-500 rounded-2xl font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
          <RefreshCw size={20} /> 他の条件でも診断する
        </button>
      </div>
    </div>
  );
}