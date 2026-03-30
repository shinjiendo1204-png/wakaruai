// app/diagnostic/page.tsx
"use client"; // 追加しておくとより安全です

import dynamic from 'next/dynamic';

// DiagnosticFlow をクライアントサイド限定で読み込む
const DiagnosticFlow = dynamic(() => import('@/components/DiagnosticFlow'), {
  ssr: false,
});

export default function DiagnosticPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="w-full max-w-4xl mx-auto px-4">
        <DiagnosticFlow />
      </div>
    </main>
  );
}