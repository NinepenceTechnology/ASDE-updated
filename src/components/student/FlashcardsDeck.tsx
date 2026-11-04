import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { playEnglishAudio } from '../../utils/speech';
import confetti from 'canvas-confetti';
import {
  Layers,
  Volume2,
  RotateCw,
  Check,
  Flame,
  ThumbsUp,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface FlashcardItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translation: string;
  category: string;
  exampleSentence: string;
  exampleTranslation: string;
}

const INITIAL_CARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    word: 'Overcome',
    phonetic: '/ˌoʊ.vɚˈkʌm/',
    partOfSpeech: 'verb',
    translation: 'Superar, vencer um obstáculo',
    category: 'Essential',
    exampleSentence: 'With consistent practice, you can overcome any language barrier.',
    exampleTranslation: 'Com prática constante, você consegue superar qualquer barreira linguística.',
  },
  {
    id: 'fc-2',
    word: 'Thoroughly',
    phonetic: '/ˈθɝː.oʊ.li/',
    partOfSpeech: 'adverb',
    translation: 'Minuciosamente, a fundo',
    category: 'Advanced',
    exampleSentence: 'The teacher thoroughly reviewed every paragraph of the essay.',
    exampleTranslation: 'O professor revisou minuciosamente cada parágrafo da redação.',
  },
  {
    id: 'fc-3',
    word: 'Leverage',
    phonetic: '/ˈlev.ɚ.ɪdʒ/',
    partOfSpeech: 'verb / noun',
    translation: 'Potencializar, alavancar',
    category: 'Business',
    exampleSentence: 'We must leverage modern technologies to expand our international reach.',
    exampleTranslation: 'Devemos alavancar tecnologias modernas para expandir nosso alcance internacional.',
  },
  {
    id: 'fc-4',
    word: 'Compelling',
    phonetic: '/kəmˈpel.ɪŋ/',
    partOfSpeech: 'adjective',
    translation: 'Convincente, cativante, irrecusável',
    category: 'Business & Academic',
    exampleSentence: 'Her presentation delivered a very compelling argument for the new policy.',
    exampleTranslation: 'A apresentação dela apresentou um argumento muito convincente para a nova política.',
  },
  {
    id: 'fc-5',
    word: 'Seamless',
    phonetic: '/ˈsiːm.ləs/',
    partOfSpeech: 'adjective',
    translation: 'Perfeito, sem atritos ou interrupções',
    category: 'Modern Living',
    exampleSentence: 'The transition from the classroom to the mobile app was completely seamless.',
    exampleTranslation: 'A transição da sala de aula para o aplicativo móvel foi totalmente integrada e sem atrito.',
  },
];

export const FlashcardsDeck: React.FC = () => {
  const { activeStudent, completeStudentLesson } = useApp();

  const [cards, setCards] = useState<FlashcardItem[]>(INITIAL_CARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (quality: 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);

    if (quality === 'easy') {
      completeStudentLesson(activeStudent.id, `fc-${currentCard.id}`, 10);
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed full deck
      confetti({ particleCount: 50, spread: 60 });
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] uppercase font-bold text-indigo-600 tracking-wider">
          Spaced Repetition System (SRS)
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Flashcards de Vocabulário & Fonética
        </h1>
        <p className="text-xs text-slate-500">
          Revise termos essenciais, memorize a ortografia e pratique a pronúncia gravada.
        </p>
      </div>

      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Cartão <strong>{currentIndex + 1}</strong> de <strong>{cards.length}</strong>
        </span>
        <span className="font-semibold text-indigo-700">
          {reviewedCount} revisões completadas nesta sessão
        </span>
      </div>

      {/* FLASHCARD CONTAINER */}
      <div
        onClick={handleFlip}
        className="relative min-h-[340px] bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-400 shadow-md cursor-pointer transition-all duration-300 p-8 flex flex-col justify-between select-none group"
      >
        {/* Card Top Details */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {currentCard.category}
          </span>
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            Clique para virar
          </span>
        </div>

        {/* Card Main Body */}
        <div className="my-auto text-center space-y-3">
          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="space-y-2 animate-in fade-in">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {currentCard.word}
              </h2>
              <p className="text-sm font-mono font-semibold text-indigo-600">
                {currentCard.phonetic}
              </p>
              <span className="text-xs text-slate-400 italic block">
                ({currentCard.partOfSpeech})
              </span>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playEnglishAudio(currentCard.word);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  Ouvir Pronúncia Nativa
                </button>
              </div>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="space-y-3 animate-in fade-in">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                Tradução em Português
              </span>
              <h3 className="text-2xl font-black text-slate-900">{currentCard.translation}</h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-1 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Frase de Exemplo:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playEnglishAudio(currentCard.exampleSentence);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-semibold text-indigo-950 italic font-serif">
                  "{currentCard.exampleSentence}"
                </p>
                <p className="text-slate-500">{currentCard.exampleTranslation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Hint */}
        <div className="text-center text-[11px] text-slate-400">
          {!isFlipped ? 'Como você traduziria essa palavra?' : 'Avalie sua facilidade de recall:'}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleReview('hard')}
          className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition cursor-pointer text-center space-y-1"
        >
          <span className="block font-black">Difícil</span>
          <span className="text-[10px] text-rose-600 font-normal">Rever logo</span>
        </button>

        <button
          onClick={() => handleReview('good')}
          className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition cursor-pointer text-center space-y-1"
        >
          <span className="block font-black">Bom</span>
          <span className="text-[10px] text-amber-600 font-normal">+5 XP</span>
        </button>

        <button
          onClick={() => handleReview('easy')}
          className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer text-center space-y-1"
        >
          <span className="block font-black">Fácil</span>
          <span className="text-[10px] text-emerald-600 font-normal">+10 XP</span>
        </button>
      </div>
    </div>
  );
};
