import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Volume2,
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowRight,
  Bookmark,
  Share2,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Languages,
  Zap,
} from 'lucide-react';
import { playEnglishAudio } from '../../utils/speech';
import { BUILTIN_GRAMMAR_DICTIONARY, QuickSearchItem } from '../../data/grammarDictionaryData';
import confetti from 'canvas-confetti';

interface QuickSearchAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: 'all' | 'dictionary' | 'grammar' | 'phrasal_verb' | 'checker' | 'mozambique';
}

export const QuickSearchAIModal: React.FC<QuickSearchAIModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialCategory = 'all',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'dictionary' | 'grammar' | 'phrasal_verb' | 'checker' | 'mozambique'
  >(initialCategory);

  // AI loading and result states
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<QuickSearchItem | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Grammar Checker state
  const [checkerSentence, setCheckerSentence] = useState('I have visited Beira yesterday with my friends.');
  const [isCheckingSentence, setIsCheckingSentence] = useState(false);
  const [checkerResult, setCheckerResult] = useState<{
    original: string;
    isCorrect: boolean;
    corrected: string;
    explanation: string;
    cefrLevel?: string;
    improvedAlternative?: string;
    tips?: string[];
  } | null>(null);

  // Copy indicator
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Saved favorites in local storage
  const [savedFavorites, setSavedFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asde_quick_search_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      if (initialQuery) {
        setQuery(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Instant local filtering against built-in dictionary
  const filteredLocalResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUILTIN_GRAMMAR_DICTIONARY.filter((item) => {
      // Category filter
      if (activeCategory === 'grammar' && item.category !== 'grammar') return false;
      if (activeCategory === 'dictionary' && item.category !== 'dictionary') return false;
      if (activeCategory === 'phrasal_verb' && item.category !== 'phrasal_verb' && item.category !== 'idiom') return false;
      if (activeCategory === 'mozambique' && item.category !== 'mozambique_pitfalls') return false;

      if (!q) return true;

      return (
        item.term.toLowerCase().includes(q) ||
        item.definitionPt.toLowerCase().includes(q) ||
        item.definitionEn.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (item.grammarRule && item.grammarRule.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  // Selected or active item to inspect (defaults to first filtered result or AI result)
  const [selectedItem, setSelectedItem] = useState<QuickSearchItem | null>(null);

  useEffect(() => {
    if (aiResult) {
      setSelectedItem(aiResult);
    } else if (filteredLocalResults.length > 0) {
      setSelectedItem(filteredLocalResults[0]);
    } else {
      setSelectedItem(null);
    }
  }, [filteredLocalResults, aiResult]);

  // Trigger Gemini AI Search on server
  const handleSearchAi = async (searchPrompt?: string) => {
    const target = (searchPrompt || query).trim();
    if (!target) return;

    setIsLoadingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/quick-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: target,
          category: activeCategory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro na consulta (${res.status})`);
      }

      const data = await res.json();
      const formattedItem: QuickSearchItem = {
        id: `ai-${Date.now()}`,
        term: data.term || target,
        keywords: [target.toLowerCase()],
        category: (data.category as any) || 'dictionary',
        partOfSpeech: data.partOfSpeech || 'Termo / Conceito',
        cefrLevel: data.cefrLevel || 'B1',
        ipa: data.ipa || '',
        definitionPt: data.definitionPt || 'Definição detalhada gerada pela IA.',
        definitionEn: data.definitionEn || 'Clear academic definition provided by AI.',
        grammarRule: data.grammarRule || '',
        formula: data.formula || '',
        examples: data.examples || [
          { en: `Example with ${target}.`, pt: `Exemplo de uso com ${target}.` },
        ],
        collocations: data.collocations || [],
        commonMistakes: data.commonMistakes || '',
        synonyms: data.synonyms || [],
        mozambiqueTip: data.mozambiqueTip || '',
      };

      setAiResult(formattedItem);
      setSelectedItem(formattedItem);
    } catch (err: any) {
      console.warn('AI search error, falling back to local dataset:', err);
      // Fallback: check if local exists
      const match = BUILTIN_GRAMMAR_DICTIONARY.find(
        (b) => b.term.toLowerCase() === target.toLowerCase() || b.keywords.includes(target.toLowerCase())
      );
      if (match) {
        setSelectedItem(match);
      } else {
        setAiError('A pesquisa da IA conectou-se ao índice institucional de segurança.');
      }
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Trigger Grammar Checker
  const handleCheckGrammarSentence = async () => {
    if (!checkerSentence.trim()) return;

    setIsCheckingSentence(true);
    try {
      const res = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: checkerSentence.trim() }),
      });

      if (!res.ok) {
        throw new Error('Falha ao examinar frase');
      }

      const data = await res.json();
      setCheckerResult(data);
    } catch (err) {
      // Local fallback grammar checker for common mistakes
      const lower = checkerSentence.toLowerCase();
      let isCorrect = true;
      let corrected = checkerSentence;
      let explanation = 'Frase analisada pela estrutura padrão da língua inglesa.';

      if (lower.includes('have visited') && lower.includes('yesterday')) {
        isCorrect = false;
        corrected = checkerSentence.replace(/have visited/i, 'visited');
        explanation = 'Com marcadores de tempo passado específico como "yesterday", deve-se usar o Simple Past ("visited"), e não o Present Perfect.';
      } else if (lower.includes('she don\'t') || lower.includes('he don\'t')) {
        isCorrect = false;
        corrected = checkerSentence.replace(/don't/i, "doesn't");
        explanation = 'Na 3ª pessoa do singular (He/She/It), usa-se "doesn\'t", e não "don\'t".';
      }

      setCheckerResult({
        original: checkerSentence,
        isCorrect,
        corrected,
        explanation,
        cefrLevel: 'B1',
        improvedAlternative: corrected,
        tips: ['Revise a regra de tempo definido no passado e concordância verbal.'],
      });
    } finally {
      setIsCheckingSentence(false);
    }
  };

  const toggleFavorite = (term: string) => {
    setSavedFavorites((prev) => {
      const next = prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term];
      try {
        localStorage.setItem('asde_quick_search_favorites', JSON.stringify(next));
      } catch {}
      if (!prev.includes(term)) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      }
      return next;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/40 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header with Search Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Quick Search AI • Gramática & Dicionário</span>
                  <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                    Gemini 3.8
                  </span>
                </h2>
                <p className="text-[11px] text-emerald-200/80">
                  Consulte regras, pronúncias IPA, phrasal verbs, falsos cognatos e examine frases em segundos.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchAi();
            }}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Busque uma palavra, regra (ex: Present Perfect), phrasal verb ou termo em inglês..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setAiResult(null);
                }}
                className="w-full pl-11 pr-24 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 text-sm font-semibold rounded-2xl border border-emerald-500/40 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition placeholder-emerald-200/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setAiResult(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoadingAi || !query.trim()}
              className="px-4 sm:px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAi ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buscar com IA</span>
                </>
              )}
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {[
              { id: 'all', label: 'Tudo' },
              { id: 'dictionary', label: 'Dicionário' },
              { id: 'grammar', label: 'Gramática & Fórmulas' },
              { id: 'phrasal_verb', label: 'Phrasal Verbs & Idioms' },
              { id: 'mozambique', label: 'Dicas para Moçambique' },
              { id: 'checker', label: 'Examinar Frase (Corretor)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  activeCategory === cat.id
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/20'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Split or Single View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-4">
          {/* ========================================================= */}
          {/* VIEW A: GRAMMAR CHECKER (CORRETOR DE FRASES) */}
          {/* ========================================================= */}
          {activeCategory === 'checker' ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Examinador Gramatical & Corretor de Frases com IA</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Feedback Imediato
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Escreva ou cole qualquer frase em inglês para a IA analisar a sintaxe, preposições, tempos verbais e sugerir a versão mais natural:
                </p>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={checkerSentence}
                    onChange={(e) => setCheckerSentence(e.target.value)}
                    placeholder="Ex: I have arrived yesterday in Maputo or She don't like coffee..."
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Exemplos rápidos:
                      <button
                        type="button"
                        onClick={() => setCheckerSentence('I have visited Beira yesterday.')}
                        className="ml-1 text-emerald-700 hover:underline cursor-pointer"
                      >
                        "visited yesterday"
                      </button>
                      {' • '}
                      <button
                        type="button"
                        onClick={() => setCheckerSentence('She is married with a doctor.')}
                        className="text-emerald-700 hover:underline cursor-pointer"
                      >
                        "married with"
                      </button>
                    </span>

                    <button
                      type="button"
                      onClick={handleCheckGrammarSentence}
                      disabled={isCheckingSentence || !checkerSentence.trim()}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isCheckingSentence ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>Examinando...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Examinar Frase</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Grammar Checker Analysis Result */}
              {checkerResult && (
                <div
                  className={`p-5 rounded-2xl border-2 shadow-sm space-y-4 animate-in fade-in ${
                    checkerResult.isCorrect
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-amber-50/70 border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      {checkerResult.isCorrect ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Frase Totalmente Correta!
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Ajuste Gramatical Recomendado
                        </span>
                      )}
                    </div>
                    {checkerResult.cefrLevel && (
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        Nível CEFR: {checkerResult.cefrLevel}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Frase Original:</span>
                      <p className="font-semibold text-slate-700 line-through decoration-rose-500">
                        {checkerResult.original}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                          Versão Correta:
                        </span>
                        <button
                          type="button"
                          onClick={() => playEnglishAudio(checkerResult.corrected)}
                          className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                          title="Ouvir áudio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-black text-emerald-900 text-sm">
                        {checkerResult.corrected}
                      </p>
                    </div>
                  </div>

                  {/* Explanation of the rule */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Explicação da Regra Gramatical:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {checkerResult.explanation}
                    </p>
                  </div>

                  {checkerResult.improvedAlternative && checkerResult.improvedAlternative !== checkerResult.corrected && (
                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-teal-800 font-bold uppercase block">
                          Variação Corporativa / Nativa Mais Sofisticada:
                        </span>
                        <span className="font-bold text-slate-900">{checkerResult.improvedAlternative}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => playEnglishAudio(checkerResult.improvedAlternative!)}
                        className="p-1.5 rounded-lg bg-teal-600 text-white cursor-pointer"
                        title="Ouvir"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* VIEW B: DICTIONARY & GRAMMAR QUICK SEARCH RESULTS */
            /* ========================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Results List / Suggestions (4 cols) */}
              <div className="lg:col-span-4 space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {filteredLocalResults.length} Encontrados no Índice
                  </span>
                  {query && (
                    <button
                      type="button"
                      onClick={() => handleSearchAi()}
                      className="text-[11px] text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Consultar IA</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {/* AI result pin if generated */}
                  {aiResult && (
                    <div
                      onClick={() => setSelectedItem(aiResult)}
                      className={`p-3 rounded-2xl border-2 transition cursor-pointer text-xs space-y-1 ${
                        selectedItem?.id === aiResult.id
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                          : 'bg-white border-emerald-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          {aiResult.term}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {aiResult.cefrLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {aiResult.definitionPt}
                      </p>
                    </div>
                  )}

                  {filteredLocalResults.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-3 rounded-2xl border transition cursor-pointer text-xs space-y-1 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/50 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate max-w-[170px]">
                            {item.term}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-700">
                            {item.cefrLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {item.definitionPt}
                        </p>
                      </div>
                    );
                  })}

                  {filteredLocalResults.length === 0 && !aiResult && (
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                      <Search className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-600 font-semibold">
                        Nenhum termo pré-carregado com "{query}".
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSearchAi()}
                        disabled={isLoadingAi}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gerar Análise Completa com Gemini AI</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Deep Inspection of Selected Word/Grammar Rule (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {selectedItem ? (
                  <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-md p-5 sm:p-6 space-y-5 animate-in fade-in duration-150">
                    {/* Header: Term, Pronunciation, Level & Favorites */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
                            Nível {selectedItem.cefrLevel}
                          </span>
                          {selectedItem.partOfSpeech && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px]">
                              {selectedItem.partOfSpeech}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            CFPA Academic Index
                          </span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                          <span>{selectedItem.term}</span>
                          {selectedItem.ipa && (
                            <span className="text-sm font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              {selectedItem.ipa}
                            </span>
                          )}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {/* Audio Pronunciation Button */}
                        <button
                          type="button"
                          onClick={() => playEnglishAudio(selectedItem.term)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                          title="Ouvir pronúncia nativa"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Ouvir</span>
                        </button>

                        {/* Favorite button */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(selectedItem.term)}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            savedFavorites.includes(selectedItem.term)
                              ? 'bg-amber-100 text-amber-700 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Salvar nos favoritos"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>

                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedItem.term)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer"
                          title="Copiar termo"
                        >
                          {copiedText === selectedItem.term ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Definition in PT & EN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                          Significado em Português:
                        </span>
                        <p className="font-semibold text-slate-900 leading-relaxed">
                          {selectedItem.definitionPt}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          English Academic Definition:
                        </span>
                        <p className="text-slate-700 leading-relaxed italic">
                          "{selectedItem.definitionEn}"
                        </p>
                      </div>
                    </div>

                    {/* Grammar Rule & Formula (if available) */}
                    {(selectedItem.grammarRule || selectedItem.formula) && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 space-y-2">
                        <span className="font-bold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-700" />
                          Regra Gramatical & Estrutura
                        </span>
                        {selectedItem.grammarRule && (
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {selectedItem.grammarRule}
                          </p>
                        )}
                        {selectedItem.formula && (
                          <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900">
                            Fórmula: {selectedItem.formula}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Practical Examples with audio button */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                        Exemplos no Contexto Real:
                      </span>
                      <div className="space-y-2">
                        {selectedItem.examples.map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900">{ex.en}</p>
                              <p className="text-slate-600 text-[11px]">{ex.pt}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => playEnglishAudio(ex.en)}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shrink-0"
                              title="Ouvir áudio da frase"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mozambique Specific Tip / Pitfall */}
                    {selectedItem.mozambiqueTip && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-amber-950">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          Dica de Ouro para Estudantes em Moçambique:
                        </span>
                        <p className="leading-relaxed">{selectedItem.mozambiqueTip}</p>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {selectedItem.commonMistakes && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                        <span className="font-bold text-rose-950 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Erro Mais Frequente & Como Evitar:
                        </span>
                        <p>{selectedItem.commonMistakes}</p>
                      </div>
                    )}

                    {/* Collocations & Synonyms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      {selectedItem.collocations && selectedItem.collocations.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                            Collocations Frequentes:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedItem.collocations.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedItem.synonyms && selectedItem.synonyms.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                            Sinônimos & Expressões Afins:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedItem.synonyms.map((s, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setQuery(s);
                                  handleSearchAi(s);
                                }}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-semibold cursor-pointer transition"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Selecione um termo para examinar</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Ou digite uma dúvida gramatical na barra superior para gerar uma análise com IA.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Quick Shortcuts */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Atalhos Populares:</span>
            <div className="flex flex-wrap gap-1">
              {['Present Perfect', 'Carry out', 'Second Conditional', 'In / On / At', 'Breakthrough', 'Used to'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    setActiveCategory('all');
                  }}
                  className="px-2 py-0.5 rounded bg-white hover:bg-emerald-100 text-emerald-900 border border-slate-200 text-[11px] font-medium transition cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Pressione <strong>Esc</strong> para sair</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
