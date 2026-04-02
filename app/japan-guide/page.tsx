"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const mistakes = [
  {
    mistake: "Using \"#1 Best\" claims",
    why: "Japanese buyers find boastful claims suspicious. Specific proof converts better.",
    fix: "Replace with: \"Used by 12,000 marketers in 40 countries\""
  },
  {
    mistake: "Trusting star ratings alone",
    why: "Japanese reviewers are polite. A 3-star JP review = a 1-star Western review. Always read the text.",
    fix: "Analyze review language, not just scores."
  },
  {
    mistake: "Thin FAQ pages",
    why: "Japanese buyers research extensively before purchasing. Your FAQ IS your sales page.",
    fix: "Build comprehensive FAQ covering edge cases (gift wrapping, minor defects, packaging)."
  },
  {
    mistake: "Ignoring seasonal timing",
    why: "Japan has more culturally significant buying seasons than almost any other market.",
    fix: "Plan campaigns around Golden Week, Obon, year-end gifts 6-8 weeks ahead."
  },
  {
    mistake: "Hard-pressure urgency tactics",
    why: "\"Only 2 left!\" pressure tactics cause Japanese buyers to simply leave.",
    fix: "Use soft urgency: season-limited editions, honest limited stock notices."
  },
];

export default function JapanGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Free Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            5 Mistakes Foreign Marketers<br />
            <span className="text-red-600">Make in Japan</span>
          </h1>
          <p className="text-slate-500 text-lg">
            And exactly how to fix them with AI.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {mistakes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-black text-sm">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <h3 className="font-black text-slate-900">{item.mistake}</h3>
                    </div>
                    <p className="text-slate-500 text-sm mb-3">{item.why}</p>
                    <div className="flex items-start gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-green-800 text-sm font-medium">{item.fix}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-8 text-center">
          <TrendingUp size={32} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-black mb-3">
            Want the full AI playbook?
          </h2>
          <p className="text-slate-400 mb-6">
            50 copy-paste AI workflows covering every Japan marketing use case.
            Market research, content, customer support, launch strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://japan-marketing-lp.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Get 50 AI Workflows — $47 <ArrowRight size={18} />
            </Link>
            <Link
              href="https://speakjapan.gumroad.com/l/mzldw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 text-slate-900 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 border-2 border-slate-200 transition-colors"
            >
              Starter Kit — $9
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-4">30-day money-back guarantee · Instant download</p>
        </div>
      </div>
    </div>
  );
}
