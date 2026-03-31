// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* ロゴとキャッチコピー */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="font-black text-xl tracking-tighter text-slate-900 mb-2">
              ワカル<span className="text-blue-600">AI</span>
            </Link>
            <p className="text-xs text-slate-400 font-bold">世界一分かりやすいAI総合プラットフォーム</p>
          </div>

          {/* リンク集 */}
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <Link href="/news" className="hover:text-blue-600 transition-colors">ニュース</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">プライバシー</Link>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-black tracking-widest uppercase">
            © 2026 WAKARU AI. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}