"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle, BookOpen, Zap } from 'lucide-react';

const products = [
  {
    id: 1,
    badge: "BESTSELLER",
    badgeColor: "bg-red-600 text-white",
    title: "Speak Japan: 50 AI Workflows",
    subtitle: "The complete Japan marketing playbook",
    price: "$47",
    originalPrice: "$97",
    discount: "52% OFF",
    url: "https://japan-marketing-lp.vercel.app",
    gumroad: "https://speakjapan.gumroad.com/l/jpmarket50",
    description: "50 ready-to-use AI prompt workflows for every Japan marketing use case. Replace your Japanese agency with AI.",
    features: [
      "50 copy-paste AI prompt workflows",
      "Market research (Kakaku, Yahoo Chiebukuro, JP Twitter)",
      "Content localization — native JP, not translation",
      "Keigo customer support scripts",
      "Launch playbook: LINE, Rakuten, Amazon JP",
      "Japan Marketing Fundamentals primer",
      "Works with ChatGPT, Claude & Gemini",
      "30-day money-back guarantee",
    ],
    highlight: true,
    icon: <Zap size={28} className="text-yellow-400" />,
  },
  {
    id: 2,
    badge: "QUICK START",
    badgeColor: "bg-blue-600 text-white",
    title: "Japan Market Starter Kit",
    subtitle: "5 essential cheat sheets",
    price: "$9",
    originalPrice: "$29",
    discount: "69% OFF",
    url: "https://speakjapan.gumroad.com/l/mzldw",
    gumroad: "https://speakjapan.gumroad.com/l/mzldw",
    description: "Everything you need to know about the Japanese market on 5 printable pages.",
    features: [
      "Consumer psychology cheat sheet",
      "12-month seasonal marketing calendar",
      "Platform guide: LINE, Rakuten, Amazon JP",
      "Business email & keigo templates",
      "Market entry checklist (legal + product)",
    ],
    highlight: false,
    icon: <BookOpen size={28} className="text-blue-400" />,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            🇯🇵 Japan Market Products
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Everything You Need to<br />
            <span className="text-blue-600">Enter Japan</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From $9 cheat sheets to a full AI workflow playbook. Start where you are.
          </p>
        </div>

        <div className="space-y-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border-2 overflow-hidden ${p.highlight ? 'border-red-500 bg-slate-900' : 'border-slate-200 bg-white'}`}
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {p.icon}
                      <span className={`text-xs font-black px-2 py-1 rounded uppercase tracking-wider ${p.badgeColor}`}>{p.badge}</span>
                    </div>
                    <h2 className={`text-2xl font-black mb-1 ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.title}</h2>
                    <p className={`text-sm mb-4 ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{p.description}</p>
                    <ul className="space-y-2">
                      {p.features.map((f, fi) => (
                        <li key={fi} className={`flex items-start gap-2 text-sm ${p.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                          <CheckCircle size={15} className={`mt-0.5 flex-shrink-0 ${p.highlight ? 'text-green-400' : 'text-green-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:w-56 flex flex-col justify-between">
                    {p.highlight && (
                      <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                      </div>
                    )}
                    <div className="mb-4">
                      <div className={`text-4xl font-black ${p.highlight ? 'text-yellow-400' : 'text-slate-900'}`}>{p.price}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-500 line-through text-sm">{p.originalPrice}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.highlight ? 'bg-red-900 text-red-400' : 'bg-blue-50 text-blue-600'}`}>{p.discount}</span>
                      </div>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 font-black py-3 px-6 rounded-xl text-sm transition-colors ${
                        p.highlight
                          ? 'bg-red-600 hover:bg-red-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      Buy Now <ArrowRight size={16} />
                    </a>
                    <p className={`text-xs text-center mt-2 ${p.highlight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Instant download · 30-day guarantee
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bundle teaser */}
        <div className="mt-12 text-center p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Coming Soon</div>
          <h3 className="text-xl font-black text-slate-700 mb-2">Japan Business Bundle</h3>
          <p className="text-slate-500 text-sm">Starter Kit + 50 Workflows + Exclusive bonus content. Save 30%.</p>
          <div className="text-3xl font-black text-slate-300 mt-3">$67 <span className="text-sm text-slate-400 line-through">$97</span></div>
        </div>
      </div>
    </div>
  );
}
