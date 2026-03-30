import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 pb-32 text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-black text-slate-900 mb-8">プライバシーポリシー</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">1. 個人情報の収集について</h2>
        <p>本サイトでは、お問い合わせの際等に氏名やメールアドレス等の個人情報を取得する場合がありますが、これらの情報は目的以外には利用いたしません。</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">2. 広告の配信について</h2>
        <p>本サイトは、eBay、楽天、CJアフィリエイト等のアフィリエイトプログラムに参加しています。第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにクッキーを設定したり、これを認識したりする場合があります。</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">3. アクセス解析ツールについて</h2>
        <p>本サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しています。このデータは匿名で収集されており、個人を特定するものではありません。</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">4. 免責事項</h2>
        <p>本サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</p>
      </section>

      <Link href="/" className="text-blue-600 font-bold hover:underline">トップページに戻る</Link>
    </div>
  );
}