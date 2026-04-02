import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-white font-black text-lg mb-3">WAKARUAI</div>
            <p className="text-sm leading-relaxed">
              Japan market intelligence for global marketers.
              AI news, tools, and playbooks.
            </p>
          </div>
          <div>
            <div className="text-white font-bold mb-3">Resources</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="hover:text-white transition-colors">AI News</Link></li>
              <li><Link href="/tools" className="hover:text-white transition-colors">AI Tools Directory</Link></li>
              <li><Link href="/diagnostic" className="hover:text-white transition-colors">AI Diagnostic</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-bold mb-3">Products</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://japan-marketing-lp.vercel.app" target="_blank" className="hover:text-white transition-colors">
                  Speak Japan: 50 AI Workflows — $47
                </Link>
              </li>
              <li>
                <Link href="https://speakjapan.gumroad.com/l/mzldw" target="_blank" className="hover:text-white transition-colors">
                  Japan Starter Kit — $9
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 WAKARUAI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:support@wakaruai.net" className="hover:text-white transition-colors">support@wakaruai.net</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
