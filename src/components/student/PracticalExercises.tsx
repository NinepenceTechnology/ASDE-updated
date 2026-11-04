import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { playEnglishAudio } from '../../utils/speech';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  Award,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Flame,
  RotateCcw,
  Layers,
  Mic,
} from 'lucide-react';

interface GrammarQuestion {
  id: string;
  topic: string;
  question: string;
  sentenceWithBlank: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const GRAMMAR_DRILLS: GrammarQuestion[] = [
  {
    id: 'g-1',
    topic: 'Present Perfect vs. Past Simple',
    question: 'Escolha a forma verbal correta para expressar uma ação concluída com tempo definido no passado:',
    sentenceWithBlank: 'Lucas _____ to London last summer to attend an international seminar.',
    options: ['has gone', 'went', 'have went', 'was going'],
    correctAnswer: 'went',
    explanation: 'Usamos o Past Simple ("went") porque o adjunto temporal "last summer" especifica um momento concluído no passado.',
  },
  {
    id: 'g-2',
    topic: 'Second Conditional (Situações Hipotéticas)',
    question: 'Complete a oração condicional imaginária:',
    sentenceWithBlank: 'If I _____ more free time, I would join the ASDE Conversation Club every week.',
    options: ['have', 'had', 'would have', 'will have'],
    correctAnswer: 'had',
    explanation: 'Na Second Conditional, a oração com "if" requer o verbo no Simple Past ("had"), enquanto a oração principal leva "would + verbo base".',
  },
  {
    id: 'g-3',
    topic: 'Preposições de Tempo (In, On, At)',
    question: 'Selecione a preposição exata para dias e datas específicas:',
    sentenceWithBlank: 'Our English presentation is scheduled _____ Monday morning at 9:00 AM.',
    options: ['at', 'in', 'on', 'by'],
    correctAnswer: 'on',
    explanation: 'Usamos "on" para dias da semana ("on Monday") e datas completas ("on July 4th"). "At" é para horários e "in" para meses/anos.',
  },
  {
    id: 'g-4',
    topic: 'Modais de Obrigação & Recomendação',
    question: 'Qual modal expressa recomendação ou conselho pedagógico?',
    sentenceWithBlank: 'Students _____ practice pronunciation in the Speech Lab at least 15 minutes a day.',
    options: ['must', 'should', 'might', 'could'],
    correctAnswer: 'should',
    explanation: '"Should" expressa conselho ou recomendação saudável. "Must" indicaria obrigação legal ou compulsória extrema.',
  },
  {
    id: 'g-5',
    topic: 'Passive Voice in Corporate English',
    question: 'Transforme para a voz passiva profissional:',
    sentenceWithBlank: 'The quarterly financial report _____ by the director yesterday.',
    options: ['approved', 'was approved', 'has been approved', 'is approving'],
    correctAnswer: 'was approved',
    explanation: 'Voz passiva no passado simples: "was" + particípio passado ("approved").',
  },
];

interface VocabCard {
  id: string;
  term: string;
  phonetic: string;
  translation: string;
  category: string;
  exampleSentence: string;
  collocations: string[];
}

const VOCAB_DRILLS: VocabCard[] = [
  {
    id: 'v-1',
    term: 'Breakthrough',
    phonetic: '/ˈbreɪk.θruː/',
    translation: 'Avanço decisivo / Conquista marcante',
    category: 'Business & Academic',
    exampleSentence: 'Her fluent speech in the meeting was a real breakthrough in her career.',
    collocations: ['Major breakthrough', 'Technological breakthrough', 'Achieve a breakthrough'],
  },
  {
    id: 'v-2',
    term: 'Reliable',
    phonetic: '/rɪˈlaɪ.ə.bəl/',
    translation: 'Confiável / Seguro',
    category: 'Workplace & Character',
    exampleSentence: 'Sarah is the most reliable teacher on our pedagogical staff.',
    collocations: ['Reliable source', 'Highly reliable', 'Reliable data'],
  },
  {
    id: 'v-3',
    term: 'Streamline',
    phonetic: '/ˈstriːm.laɪn/',
    translation: 'Otimizar / Simplificar processos',
    category: 'Management & Technology',
    exampleSentence: 'The new ASDE management system streamlined all student enrollments.',
    collocations: ['Streamline processes', 'Streamline operations', 'Streamline workflow'],
  },
  {
    id: 'v-4',
    term: 'Fluency',
    phonetic: '/ˈfluː.ən.si/',
    translation: 'Fluência / Naturalidade',
    category: 'Language Learning',
    exampleSentence: 'Consistent daily practice is the fastest highway to oral fluency.',
    collocations: ['Near-native fluency', 'Achieve fluency', 'Oral fluency'],
  },
];

interface PronunciationDrill {
  id: string;
  pairName: string;
  soundA: string;
  soundB: string;
  wordA: string;
  wordB: string;
  tips: string;
}

const PRONUNCIATION_DRILLS: PronunciationDrill[] = [
  {
    id: 'p-1',
    pairName: 'Som /θ/ (Thank) vs. Som /s/ (Sink)',
    soundA: '/θ/ (Língua entre os dentes)',
    soundB: '/s/ (Dentes cerrados)',
    wordA: 'Think',
    wordB: 'Sink',
    tips: 'No som de /θ/ (think), posicione a ponta da língua suavemente entre os dentes incisivos superiores e assopre o ar sem vibrar a garganta.',
  },
  {
    id: 'p-2',
    pairName: 'Vogal Longa /iː/ vs. Vogal Curta /ɪ/',
    soundA: '/iː/ (Sorriso esticado)',
    soundB: '/ɪ/ (Relaxado entre e/i)',
    wordA: 'Sheep (Ovelha)',
    wordB: 'Ship (Navio)',
    tips: 'Sheep é longo e tenso: /ʃiːp/. Ship é curto e neutro: /ʃɪp/. Não pronuncie ship como "chipi"!',
  },
  {
    id: 'p-3',
    pairName: 'Som /b/ vs. /v/',
    soundA: '/b/ (Bilabial)',
    soundB: '/v/ (Labiodental)',
    wordA: 'Berry (Fruta silvestre)',
    wordB: 'Very (Muito)',
    tips: 'Para o /v/ (very), encoste os dentes superiores no lábio inferior e faça vibrar suas cordas vocais.',
  },
];

export const PracticalExercises: React.FC = () => {
  const { activeStudent, completeStudentLesson } = useApp();

  const [activeSection, setActiveSection] = useState<'grammar' | 'vocab' | 'pronunciation'>('grammar');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [completedDrillsCount, setCompletedDrillsCount] = useState(0);

  const handleSelectAnswer = (questionId: string, option: string) => {
    if (submitted[questionId]) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
  };

  const handleSubmitAnswer = (question: GrammarQuestion) => {
    const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
    setSubmitted({ ...submitted, [question.id]: true });

    if (isCorrect) {
      setCompletedDrillsCount((prev) => prev + 1);
      completeStudentLesson(activeStudent.id, `drill-${question.id}`, 25);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleResetSection = () => {
    setSelectedAnswers({});
    setSubmitted({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Módulo Prático de Fixação
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Exercícios Práticos de Inglês
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Pratique gramática estruturada, amplie seu vocabulário ativo e refine sua pronúncia com feedback instantâneo.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
          <Award className="w-5 h-5 text-indigo-600" />
          <div className="text-xs">
            <span className="font-bold text-indigo-950 block">Exercícios Concluídos</span>
            <span className="text-indigo-700 font-semibold">{completedDrillsCount} acertados (+{completedDrillsCount * 25} XP)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('grammar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'grammar'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Exercícios de Gramática ({GRAMMAR_DRILLS.length})
        </button>
        <button
          onClick={() => setActiveSection('vocab')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'vocab'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Vocabulário & Collocations ({VOCAB_DRILLS.length})
        </button>
        <button
          onClick={() => setActiveSection('pronunciation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'pronunciation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mic className="w-4 h-4" />
          Pares Mínimos & Pronúncia ({PRONUNCIATION_DRILLS.length})
        </button>
      </div>

      {/* SECTION 1: GRAMMAR DRILLS */}
      {activeSection === 'grammar' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Complete as lacunas escolhendo a melhor alternativa e clique em "Validar Resposta".
            </span>
            <button
              onClick={handleResetSection}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Recomeçar
            </button>
          </div>

          <div className="space-y-4">
            {GRAMMAR_DRILLS.map((drill, idx) => {
              const isChecked = submitted[drill.id];
              const selected = selectedAnswers[drill.id];
              const isCorrect = selected === drill.correctAnswer;

              return (
                <div
                  key={drill.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                    isChecked
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/10'
                        : 'border-rose-300 bg-rose-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      Questão {idx + 1} • {drill.topic}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600">+25 XP</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">{drill.question}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm font-semibold text-slate-900 mb-3">
                    {drill.sentenceWithBlank}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {drill.options.map((opt) => {
                      const isThisSelected = selected === opt;
                      let btnClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                      if (isChecked) {
                        if (opt === drill.correctAnswer) {
                          btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isThisSelected) {
                          btnClass = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                        }
                      } else if (isThisSelected) {
                        btnClass = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isChecked}
                          onClick={() => handleSelectAnswer(drill.id, opt)}
                          className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer flex items-center justify-between ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {isChecked && opt === drill.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isChecked && isThisSelected && opt !== drill.correctAnswer && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Explanations */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {!isChecked ? (
                      <button
                        disabled={!selected}
                        onClick={() => handleSubmitAnswer(drill)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 self-start"
                      >
                        Validar Resposta
                      </button>
                    ) : (
                      <div className="p-3 bg-slate-100/70 rounded-xl text-xs text-slate-700 space-y-1 w-full">
                        <strong className="block text-slate-900">
                          {isCorrect ? '✓ Resposta Correta!' : '✗ Resposta Incorreta:'}
                        </strong>
                        <p>{drill.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: VOCABULARY BUILDER */}
      {activeSection === 'vocab' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VOCAB_DRILLS.map((vocab) => (
            <div
              key={vocab.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-indigo-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {vocab.category}
                </span>
                <button
                  onClick={() => playEnglishAudio(vocab.term)}
                  className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Ouvir pronúncia nativa"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir</span>
                </button>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-black text-slate-900">{vocab.term}</h3>
                  <span className="text-xs font-mono text-slate-400">{vocab.phonetic}</span>
                </div>
                <p className="text-xs font-medium text-emerald-700 mt-0.5">{vocab.translation}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-600 block mb-1">Exemplo em Contexto:</span>
                <p className="text-slate-800 italic">"{vocab.exampleSentence}"</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Collocations mais frequentes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {vocab.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: PRONUNCIATION & MINIMAL PAIRS */}
      {activeSection === 'pronunciation' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs text-indigo-900">
            <strong>Dica de Pronúncia ASDE:</strong> Pares mínimos são pares de palavras que se diferenciam por apenas um fonema. Treinar a distinção entre esses sons é o segredo para ser compreendido perfeitamente no exterior.
          </div>

          <div className="space-y-4">
            {PRONUNCIATION_DRILLS.map((drill) => (
              <div
                key={drill.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{drill.pairName}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Word A */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{drill.soundA}</span>
                      <strong className="text-lg text-slate-900">{drill.wordA}</strong>
                    </div>
                    <button
                      onClick={() => playEnglishAudio(drill.wordA)}
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer shadow-xs"
                      title="Ouvir"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Word B */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{drill.soundB}</span>
                      <strong className="text-lg text-slate-900">{drill.wordB}</strong>
                    </div>
                    <button
                      onClick={() => playEnglishAudio(drill.wordB)}
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer shadow-xs"
                      title="Ouvir"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Técnica Articulatória:</span>
                  {drill.tips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
