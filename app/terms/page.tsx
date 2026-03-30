import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 pb-32 text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-black text-slate-900 mb-8">利用規約</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">1. はじめに</h2>
        <p>本規約は、「ワカルAI」（以下「本サイト」）が提供するサービスの利用条件を定めるものです。ユーザーは本サイトを利用することで、本規約に同意したものとみなされます。</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">2. 禁止事項</h2>
        <p>ユーザーは、本サイトの利用にあたり以下の行為を行ってはなりません。</p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>本サイトの内容を無断で転載、複製、または二次利用する行為</li>
          <li>自動化ツール（スクレイピング等）を用いて情報を取得する行為</li>
          <li>本サイトの運営を妨害する行為</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">3. 免責事項</h2>
        <p>本サイトに掲載されている情報は、AIによって自動生成・要約されたものが含まれます。情報の正確性、完全性を保証するものではありません。本サイトの利用により生じた損害について、運営者は一切の責任を負いません。</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">4. サービスの変更・停止</h2>
        <p>運営者は、ユーザーに事前に通知することなく、本サイトの内容を変更し、または提供を中止することができるものとします。</p>
      </section>

      <Link href="/" className="text-blue-600 font-bold hover:underline">トップページに戻る</Link>
    </div>
  );
}