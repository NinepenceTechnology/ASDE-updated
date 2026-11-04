import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppUnit, AppLesson, CEFRLevel } from '../../types';
import { playEnglishAudio } from '../../utils/speech';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Plus,
  Mic,
  CheckCircle,
  Eye,
  Layers,
  ChevronRight,
  ListPlus,
  X,
} from 'lucide-react';

export const AppCurriculumManager: React.FC = () => {
  const { units, addNewLessonToUnit, setViewMode, setStudentTab } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || '');
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);

  // New lesson form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [grammarFocus, setGrammarFocus] = useState('');
  const [xpValue, setXpValue] = useState(120);
  const [vocabWord, setVocabWord] = useState('');
  const [vocabPhonetic, setVocabPhonetic] = useState('');
  const [vocabTranslation, setVocabTranslation] = useState('');
  const [vocabExample, setVocabExample] = useState('');
  const [speechPrompt, setSpeechPrompt] = useState('');
  const [speechTips, setSpeechTips] = useState('');

  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNewLessonToUnit(activeUnit.id, {
      unitNumber: activeUnit.number,
      title,
      subtitle,
      level: activeUnit.level,
      estimatedMinutes: 12,
      xpValue,
      grammarFocus: grammarFocus || 'Contextual grammar application and patterns',
      vocabulary: vocabWord
        ? [
            {
              id: `v-${Date.now()}`,
              word: vocabWord,
              phonetic: vocabPhonetic || `/${vocabWord.toLowerCase()}/`,
              translation: vocabTranslation || 'Tradução',
              partOfSpeech: 'noun',
              exampleSentence: vocabExample || `This is a clear example of ${vocabWord}.`,
              exampleTranslation: 'Exemplo prático de aplicação.',
            },
          ]
        : [],
      pronunciationPrompts: speechPrompt
        ? [
            {
              phrase: speechPrompt,
              phoneticTips: speechTips || 'Mantenha a fluidez natural e ritmo.',
              translation: 'Tradução da frase prática.',
              context: 'Situação comunicativa cotidiana',
            },
          ]
        : [],
      questions: [
        {
          id: `q-${Date.now()}`,
          type: 'multiple_choice',
          prompt: `Qual o significado da palavra chave "${vocabWord || title}"?`,
          explanation: 'Compreensão contextual do vocabulário introduzido.',
          options: [
            vocabTranslation || 'Significado correto',
            'Opção alternativa incorreta',
            'Outro termo',
          ],
          correctAnswer: vocabTranslation || 'Significado correto',
        },
      ],
    });

    setIsAddLessonOpen(false);
    // Reset
    setTitle('');
    setSubtitle('');
    setGrammarFocus('');
    setVocabWord('');
    setVocabPhonetic('');
    setVocabTranslation('');
    setVocabExample('');
    setSpeechPrompt('');
    setSpeechTips('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gerenciador do Aplicativo do Aluno (LMS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Crie e publique conteúdos, áudios fonéticos, exercícios de pronúncia e testes interativos para o app.
          </p>
        </div>

        <button
          onClick={() => {
            setViewMode('student');
            setStudentTab('learn');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          Testar no App do Aluno &rarr;
        </button>
      </div>

      {/* Unit Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnitId(u.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedUnitId === u.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-[10px]">
              {u.number}
            </span>
            <span>{u.title}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                selectedUnitId === u.id
                  ? 'bg-indigo-800 text-indigo-100'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {u.level}
            </span>
          </button>
        ))}
      </div>

      {/* Active Unit Overview & Lesson List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Unidade {activeUnit?.number} • Nível CEFR {activeUnit?.level}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {activeUnit?.lessons.length} Lições publicadas
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{activeUnit?.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{activeUnit?.description}</p>
          </div>

          <button
            onClick={() => setIsAddLessonOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nova Lição nesta Unidade
          </button>
        </div>

        {/* Lessons List in this Unit */}
        <div className="space-y-4">
          {activeUnit?.lessons.map((les, idx) => (
            <div
              key={les.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{les.title}</h3>
                    <p className="text-xs text-slate-500">{les.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    +{les.xpValue} XP
                  </span>
                  <span className="text-slate-500">{les.estimatedMinutes} min</span>
                </div>
              </div>

              {/* Grammar Focus Pill */}
              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                <strong className="text-indigo-900">Foco Gramatical:</strong> {les.grammarFocus}
              </div>

              {/* Vocabulary Preview */}
              {les.vocabulary.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Vocabulário Chave & Pronúncia Fonética
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {les.vocabulary.map((voc) => (
                      <div
                        key={voc.id}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{voc.word}</span>
                            <span className="text-indigo-600 font-mono text-[11px]">
                              {voc.phonetic}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[11px]">{voc.translation}</span>
                        </div>

                        <button
                          onClick={() => playEnglishAudio(voc.word)}
                          title="Ouvir pronúncia nativa"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pronunciation Prompts */}
              {les.pronunciationPrompts.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Frases para Prática de Fala (Speech Lab)
                  </span>
                  <div className="space-y-1.5">
                    {les.pronunciationPrompts.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 italic">"{p.phrase}"</p>
                          <p className="text-[11px] text-slate-400">{p.translation} • {p.phoneticTips}</p>
                        </div>
                        <button
                          onClick={() => playEnglishAudio(p.phrase)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD LESSON */}
      {isAddLessonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-indigo-600" />
                Criar Nova Lição no App ({activeUnit.title})
              </h2>
              <button
                onClick={() => setIsAddLessonOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título da Lição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Master the Art of Persuasive Emails"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtítulo / Objetivo</label>
                <input
                  type="text"
                  placeholder="Ex: Expressar urgência educada e estruturar propostas"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recompensa em XP</label>
                  <input
                    type="number"
                    value={xpValue}
                    onChange={(e) => setXpValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tópico Gramatical</label>
                  <input
                    type="text"
                    placeholder="Ex: Conditionals & Hedging"
                    value={grammarFocus}
                    onChange={(e) => setGrammarFocus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase">
                  Vocabulário Chave Inicial
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Palavra (Ex: Breakthrough)"
                    value={vocabWord}
                    onChange={(e) => setVocabWord(e.target.value)}
                    className="p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Fonética (/ˈbreɪk.θruː/)"
                    value={vocabPhonetic}
                    onChange={(e) => setVocabPhonetic(e.target.value)}
                    className="p-2 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Tradução (Avanço)"
                    value={vocabTranslation}
                    onChange={(e) => setVocabTranslation(e.target.value)}
                    className="p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Frase de exemplo em inglês"
                  value={vocabExample}
                  onChange={(e) => setVocabExample(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase">
                  Frase para Treino de Fala no Microfone
                </span>
                <input
                  type="text"
                  placeholder="Frase em inglês para o aluno falar no Speech Lab"
                  value={speechPrompt}
                  onChange={(e) => setSpeechPrompt(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Dica de pronúncia (Ex: Conecte as consoantes finais)"
                  value={speechTips}
                  onChange={(e) => setSpeechTips(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLessonOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition cursor-pointer"
                >
                  Publicar no App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
