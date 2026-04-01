"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ChevronRight, Sparkles } from 'lucide-react';
import ResultView from './ResultView';
import { audio } from 'framer-motion/client';

// 高級イージングの定義
const premiumTransition = {
  duration: 0.5,
  ease: [0.23, 1, 0.32, 1] as const
};

const pageVariants = {
  enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d < 0 ? 100 : -100, opacity: 0 })
};
// 用途ごとの詳細選択肢
const subQuestionsMap: Record<string, { label: string, value: string }[]> = {
  writing: [
    { label: 'SEOブログ・長文記事', value: 'seo' },
    { label: 'メール・ビジネス文書', value: 'business' },
    { label: '広告コピー・SNS投稿', value: 'ad' },
    { label: '物語・創作・壁打ち', value: 'creative' }
  ],
  image: [
    { label: 'ロゴ・アイコン作成', value: 'logo' },
    { label: 'バナー・図解デザイン', value: 'design' },
    { label: '実写・アート画像生成', value: 'art' }
  ],
  video: [
    { label: 'YouTube動画編集', value: 'editor' },
    { label: 'テキストから動画生成', value: 'gen' },
    { label: 'AIアバター・ナレーション', value: 'avatar' }
  ],
   audio: [
    { label: 'Tiktok用音楽', value: 'editor' },
    { label: 'テキストから音楽生成', value: 'gen' },
  ],
  auto: [
    { label: '議事録・文字起こし', value: 'transcribe' },
    { label: 'ツール間の連携・自動化', value: 'zap' },
    { label: '社内ナレッジ検索', value: 'search' }
  ]
};

export default function DiagnosticFlow() {
  const [step, setStep] = useState(1); // 1: 診断, 2: ローディング, 3: 結果
  const [questionIndex, setQuestionIndex] = useState(0); // 質問の進行度
  const [direction, setDirection] = useState(1);
  const [results, setResults] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({ 
  purpose: '', 
  subPurpose: '', // これを追加
  budget: '', 
  needJp: '' 
});

  useEffect(() => {
    setMounted(true);
  }, []);

const [isProcessing, setIsProcessing] = useState(false);

// やり直し機能
const handleReset = () => {
  setIsProcessing(false);
  setDirection(-1);
  setStep(1);
  setQuestionIndex(0);
  setAnswers({ purpose: '', subPurpose: '', budget: '', needJp: '' });
};
  
  const fetchRecommendations = async (params: any) => {
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleAnswer = async (value: string) => {
    // 【ガード1】すでに処理中、または「診断中(step 1)」でない場合は即終了
    // これにより連打や、ローディング遷移中のクリックを完全に無視します
    if (isProcessing || step !== 1) return;

    // 【ガード2】現在の質問が存在するかチェック
    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return;

    // 即座にロックをかける（最優先）
    setIsProcessing(true);

    // 回答を保存
    const newAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(newAnswers);

    // 次のステップがあるか判定
    const isLast = questionIndex >= questions.length - 1;

    if (!isLast) {
      // --- 次の質問へ進む ---
      setDirection(1);
      setQuestionIndex(prev => prev + 1);
      
      // アニメーションが終わるまで（500ms）次の入力を受け付けない
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    } else {
      // --- 最後の質問：ローディングへ ---
      setDirection(1);
      setStep(2);
      
      try {
        const data = await fetchRecommendations(newAnswers);
        // 最低2秒はLoadingを見せて「考えている感」を出す
        setTimeout(() => {
          setResults(data);
          setStep(3);
          setIsProcessing(false);
        }, 2000);
      } catch (error) {
        console.error("エラーが発生しました:", error);
        handleReset(); // 失敗時は安全に最初に戻す
      }
    }
  };
  // 質問の定義
  const questions = [
    {
      key: 'experience',
      title: 'AIツールの経験は？',
      options: [
        { label: 'ほぼ初めて', value: 'beginner' },
        { label: '少し使ったことがある', value: 'intermediate' },
        { label: 'かなり使いこなしている', value: 'advanced' },
      ]
    },
    {
      key: 'purpose',
      title: '何を実現したいですか？',
      options: [
        { label: '文章作成・ライティング', value: 'writing' },
        { label: '画像生成・デザイン', value: 'image' },
        { label: '動画・音声制作', value: 'video' },
        { label: '楽曲制作', value: 'audio' },
        { label: '業務自動化・開発', value: 'auto' },
      ]
    },
    { 
      key: 'subPurpose', 
      title: 'さらに詳しく教えてください', 
      options: subQuestionsMap[answers.purpose] || [] 
    },
    {
      key: 'goal',
      title: '最も重視するのは？',
      options: [
        { label: 'とにかく簡単に使える', value: 'easy' },
        { label: '高機能・高性能', value: 'power' },
        { label: 'コスパ', value: 'cost' },
      ]
    },
    {
      key: 'budget',
      title: '予算のイメージは？',
      options: [
        { label: 'まずは無料で使いたい', value: 'free' },
        { label: '月3,000円程度までなら', value: 'low' },
        { label: '金額よりも高品質重視', value: 'high' },
      ]
    },
    {
      key: 'needJp',
      title: '日本語対応は必須ですか？',
      options: [
        { label: '日本語は絶対（必須）', value: 'required' },
        { label: '英語UIでも構わない', value: 'any' },
      ]
    }
  ];
 
   if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait" custom={direction}>
        {/* --- STEP 1: 診断中 --- */}
    {step === 1 && questions[questionIndex] ? (
      <motion.div
        key={`question-${questionIndex}`} // Indexをkeyにすることで確実に要素を切り替え
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={premiumTransition}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-50">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-4 text-sm">
            <Sparkles size={18} />
            <span>STEP {Math.min(questionIndex + 1, questions.length)} / {questions.length}</span>
          </div>
          
          {/* 直接参照せず、存在が確定している時のみ描画 */}
          <h2 className="text-3xl font-black text-slate-900 mb-10 leading-tight">
            {questions[questionIndex].title}
          </h2>

          <div className="space-y-4">
            {questions[questionIndex].options.map((option) => (
              <motion.button
                key={option.value}
                disabled={isProcessing} // ロック中はボタンを物理的に無効化
                onClick={() => handleAnswer(option.value)}
                // スタイリング（isProcessing中は見た目を変える）
                className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex justify-between items-center group ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed border-slate-100' 
                    : 'border-slate-100 hover:border-blue-600 hover:bg-slate-50'
                }`}
              >
                <span className={`text-lg font-bold ${isProcessing ? 'text-slate-400' : 'text-slate-700'} group-hover:text-blue-600`}>
                  {option.label}
                </span>
                <ChevronRight className={isProcessing ? 'text-slate-200' : 'text-slate-300 group-hover:text-blue-600'} />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    ) : step === 1 ? (
      // 万が一Indexがズレた場合のセーフティ（何も出さないか、Loadingを出す）
      <div className="text-slate-400 text-sm animate-pulse">読み込み中...</div>
    ) : null}

        {/* --- STEP 2: ローディング演出 --- */}
        {step === 2 && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={premiumTransition}
            className="text-center py-20"
          >
            <div className="relative flex justify-center mb-12">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute w-40 h-40 bg-blue-100 rounded-full"
              />
              <div className="relative bg-white p-10 rounded-full shadow-2xl border border-blue-50">
                <BrainCircuit className="text-blue-600 w-20 h-20" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                AIが100超のデータベースから選定中...
              </h3>
              <p className="text-lg text-slate-500 font-medium">
                あなたのビジネスに最適な「3つ」を計算しています
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-xs font-mono text-slate-300 uppercase tracking-widest"
            >
              Analyzing requirements... Scoring match rates...
            </motion.div>
          </motion.div>
        )}

        {/* --- STEP 3: 結果表示 --- */}
        {step === 3 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={premiumTransition}
          >
            <ResultView tools={results} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}