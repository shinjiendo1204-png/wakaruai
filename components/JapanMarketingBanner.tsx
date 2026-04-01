"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function JapanMarketingBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="max-w-5xl mx-auto px-6 pb-16"
    >
      <a
        href="https://japan-marketing-lp.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 border border-slate-800 hover:border-blue-500 transition-all duration-300">
          <div className="absolute top-0 right-0 text-[180px] leading-none opacity-5 select-none pointer-events-none">
            🇯🇵
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                <Zap size={12} />
                New Product
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-black mb-3 leading-tight">
                Break into Japan&apos;s $4T market<br className="hidden md:block" />
                without a local team
              </h3>
              <p className="text-slate-400 text-sm md:text-base max-w-lg">
                50 AI prompt workflows for market research, content localization, customer support, and launch strategy — all tuned for Japan.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-blue-600 group-hover:bg-blue-500 transition-colors text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 text-lg whitespace-nowrap">
                Get the playbook
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.section>
  );
}
