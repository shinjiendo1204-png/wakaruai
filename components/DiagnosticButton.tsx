"use client";

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

// Propsの型を定義
interface DiagnosticButtonProps {
  children: ReactNode;      // ボタンの中に表示するテキストや要素
  onClick: () => void;      // クリック時の関数
  active?: boolean;         // 選択状態（任意）
}

export const DiagnosticButton = ({ children, onClick, active = false }: DiagnosticButtonProps) => (
  <motion.button
    whileHover={{ 
      y: -4,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    }}
    whileTap={{ scale: 0.98, y: 0 }}
    onClick={onClick}
    className={`w-full p-6 text-left rounded-3xl border-2 transition-colors ${
      active ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'
    }`}
  >
    <div className="flex items-center justify-between">
      <span className="text-lg font-bold text-slate-700">{children}</span>
      <motion.div
        initial={false}
        animate={{ x: active ? 5 : 0 }}
        className={active ? 'text-blue-600' : 'text-slate-300'}
      >
        <ChevronRight />
      </motion.div>
    </div>
  </motion.button>
);