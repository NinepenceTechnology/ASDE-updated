import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLesson, AppUnit, QuizQuestion, CEFR_IELTS_MAP, CEFRLevel } from '../../types';
import { playEnglishAudio } from '../../utils/speech';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Lock,
  Play,
  Pause,
  Volume2,
  Sparkles,
  BookOpen,
  ArrowRight,
  HelpCircle,
  X,
  Flame,
  Award,
  ChevronRight,
  Video,
  FileText,
  Clock,
  ShieldCheck,
  Unlock,
} from 'lucide-react';

const LEVEL_RANK: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export const LearningRoadmap: React.FC = () => {
  const { units, activeStudent, completeStudentLesson } = useApp();

  const [activeLesson, setActiveLesson] = useState<AppLesson | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Video, 1: Vocab, 2: Grammar & Dialogue, 3: Quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [lessonCompletedAlert, setLessonCompletedAlert] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [unlockedPreviews, setUnlockedPreviews] = useState<Record<string, boolean>>({});

  const completedLessonIds = activeStudent.appProgress.completedLessonIds || [];
  const studentRank = LEVEL_RANK[activeStudent.level] || 3;
  const studentLevelInfo = CEFR_IELTS_MAP[activeStudent.level] || CEFR_IELTS_MAP['B1'];

  const handleStartLesson = (lesson: AppLesson, isLocked: boolean) => {
    if (isLocked && !unlockedPreviews[lesson.id]) {
      const confirmUnlock = window.confirm(
        `Esta lição pertence ao Nível ${lesson.level} (${CEFR_IELTS_MAP[lesson.level]?.name}). Como aluno do Nível ${activeStudent.level}, você gostaria de liberar acesso para praticar antecipadamente?`
      );
      if (confirmUnlock) {
        setUnlockedPreviews((prev) => ({ ...prev, [lesson.id]: true }));
      } else {
        return;
      }
    }

    setActiveLesson(lesson);
    setCurrentStep(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setLessonCompletedAlert(false);
  };

  const handleFinishLesson = () => {
    if (!activeLesson) return;

    completeStudentLesson(activeStudent.id, activeLesson.id, activeLesson.xpValue);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setLessonCompletedAlert(true);
    setTimeout(() => {
      setActiveLesson(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Student Top Bar Summary with Green Theme */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-5 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="flex items-center gap-3.5">
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold">{activeStudent.name}</h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-600/60 text-white border border-emerald-400/40">
                Nível {activeStudent.level} • {studentLevelInfo.ieltsBand}
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Turma: {activeStudent.className} • Centro de Formação Profissional ASDE
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-300/80 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acesso total liberado para o nível matriculado ({studentLevelInfo.name})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] uppercase text-emerald-200 block font-bold">Ofensiva</span>
            <span className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              {activeStudent.appProgress.streakDays} Dias
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] uppercase text-emerald-200 block font-bold">Horas no App</span>
            <span className="text-base font-extrabold text-emerald-300 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-emerald-400" />
              {(activeStudent.appProgress.hoursStudied || 0).toFixed(1)}h
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] uppercase text-emerald-200 block font-bold">Total XP</span>
            <span className="text-base font-extrabold text-teal-300">
              {activeStudent.appProgress.xp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum Levels Overview Banner (CEFR A1 to C2 / IELTS) */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            Trilha de Fluência: Principiante ao Avançado (Quadro Europeu & IELTS)
          </span>
          <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Sua Matrícula Atual: Nível {activeStudent.level}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-3 text-center">
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
            const info = CEFR_IELTS_MAP[lvl];
            const isStudentLevel = activeStudent.level === lvl;
            const isUnlocked = LEVEL_RANK[lvl] <= studentRank;

            return (
              <div
                key={lvl}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isStudentLevel
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400/40'
                    : isUnlocked
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="font-black text-sm">{lvl}</span>
                  {isUnlocked && <CheckCircle2 className={`w-3.5 h-3.5 ${isStudentLevel ? 'text-white' : 'text-emerald-600'}`} />}
                </div>
                <div className="text-[10px] font-bold truncate mt-0.5">
                  {info?.name}
                </div>
                <div className={`text-[9px] font-mono mt-0.5 ${isStudentLevel ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {info?.ieltsBand}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Units Roadmap */}
      <div className="space-y-6">
        {units.map((unit) => {
          const unitRank = LEVEL_RANK[unit.level] || 1;
          const hasTotalAccess = unitRank <= studentRank;
          const unitLevelInfo = CEFR_IELTS_MAP[unit.level];

          const unitCompletedLessons = unit.lessons.filter((l) =>
            completedLessonIds.includes(l.id)
          ).length;
          const unitProgressPercent = Math.round(
            (unitCompletedLessons / (unit.lessons.length || 1)) * 100
          );

          return (
            <div
              key={unit.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                hasTotalAccess
                  ? 'border-emerald-200'
                  : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              {/* Unit Header */}
              <div
                className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  hasTotalAccess
                    ? 'bg-emerald-50/50 border-emerald-100'
                    : 'bg-slate-100/70 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        hasTotalAccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 text-slate-800'
                      }`}
                    >
                      Unidade {unit.number}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-slate-800 border border-slate-200">
                      Nível {unit.level} ({unitLevelInfo?.ieltsBand})
                    </span>
                    {hasTotalAccess ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Acesso Total Liberado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                        <Lock className="w-3 h-3 text-amber-700" /> Nível Avançado (Pré-visualização liberada)
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-semibold">
                      {unitCompletedLessons}/{unit.lessons.length} Concluídas
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {unit.title}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-2xl">{unit.description}</p>
                </div>

                {/* Progress bar */}
                <div className="sm:text-right min-w-[140px]">
                  <span className="text-xs font-bold text-emerald-800">
                    {unitProgressPercent}% Dominado
                  </span>
                  <div className="w-full sm:w-36 bg-slate-200 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${unitProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Unit Lessons Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.lessons.map((les, idx) => {
                  const isDone = completedLessonIds.includes(les.id);
                  const isLocked = !hasTotalAccess;
                  const isUnlockedManually = !!unlockedPreviews[les.id];

                  return (
                    <div
                      key={les.id}
                      onClick={() => handleStartLesson(les, isLocked && !isUnlockedManually)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
                          : 'border-slate-200 bg-white hover:border-emerald-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isLocked && !isUnlockedManually
                              ? 'bg-slate-100 text-slate-500 border border-slate-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isLocked && !isUnlockedManually ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {les.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{les.subtitle}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            <span className="font-semibold text-amber-600">+{les.xpValue} XP</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{les.estimatedMinutes} min</span>
                            {isLocked && !isUnlockedManually && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="text-amber-700 font-bold">Nível {unit.level}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className={`p-2 rounded-xl transition shrink-0 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isLocked && !isUnlockedManually
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isLocked && !isUnlockedManually ? (
                          <Unlock className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE LESSON MODAL PLAYER */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Player Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-emerald-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300">
                  Lição Interativa • Nível {activeLesson.level} ({CEFR_IELTS_MAP[activeLesson.level]?.ieltsBand})
                </span>
                <h2 className="text-base sm:text-lg font-bold">{activeLesson.title}</h2>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Navigation Bar */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 shrink-0 overflow-x-auto">
              <button
                onClick={() => setCurrentStep(0)}
                className={`flex-1 min-w-[120px] py-2.5 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStep === 0
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                1. Vídeo da Aula
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex-1 min-w-[120px] py-2.5 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStep === 1
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                2. Vocabulário & Áudios
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className={`flex-1 min-w-[120px] py-2.5 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStep === 2
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                3. Diálogo & Gramática
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className={`flex-1 min-w-[120px] py-2.5 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStep === 3
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                4. Quiz de Fixação
              </button>
            </div>

            {/* Player Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {lessonCompletedAlert ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Lição Concluída com Sucesso!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Você ganhou <strong className="text-amber-600">+{activeLesson.xpValue} XP</strong> e seu tempo de dedicação foi computado para o ranking da sua turma.
                  </p>
                </div>
              ) : currentStep === 0 ? (
                /* STEP 0: VIDEO LESSON */
                <div className="space-y-4">
                  {/* Interactive Video Frame */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex flex-col justify-between p-4 shadow-xl border border-slate-800">
                    <div className="flex items-center justify-between text-white/80 text-[11px] z-10">
                      <span className="bg-emerald-600/80 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                        Masterclass HD • {activeLesson.title}
                      </span>
                      <span className="bg-black/50 px-2 py-0.5 rounded-md font-mono">
                        Duração: {activeLesson.estimatedMinutes} min
                      </span>
                    </div>

                    {/* Center Action */}
                    <div className="text-center z-10">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="w-16 h-16 rounded-full bg-white/95 hover:bg-white text-emerald-900 flex items-center justify-center mx-auto shadow-2xl transition transform hover:scale-105 cursor-pointer"
                      >
                        {isVideoPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                      </button>
                      <p className="text-white text-xs font-semibold mt-3">
                        {isVideoPlaying ? 'Vídeo em reprodução com legendas interativas' : 'Clique para iniciar a vídeo-aula com professor nativo'}
                      </p>
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between text-white/70 text-[11px] pt-2 border-t border-white/10 z-10">
                      <span>Centro de Formação Profissional ASDE • Video Classroom</span>
                      <span>1080p 60fps</span>
                    </div>

                    {/* Background Visual Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-black opacity-90" />
                  </div>

                  {/* Video Takeaways */}
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-950 text-xs uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Pontos-Chave & Objetivos desta Vídeo-Aula:
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      <li>Entendimento contextual da língua inglesa e desenvoltura vocal.</li>
                      <li>Articulação fonética de expressões de nível {activeLesson.level} com foco em naturalidade.</li>
                      <li>Prática de vocabulário aplicado e preparação para os exercícios do próximo passo.</li>
                    </ul>
                  </div>
                </div>
              ) : currentStep === 1 ? (
                /* STEP 1: VOCABULARY & AUDIO PLAYBACK */
                <div className="space-y-4">
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-slate-700">
                    <span className="font-bold text-emerald-950 block">Dica de Pronúncia:</span>
                    Clique no botão de áudio para escutar a pronúncia nativa de cada palavra.
                  </div>

                  <div className="space-y-3">
                    {activeLesson.vocabulary.map((voc) => (
                      <div
                        key={voc.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-emerald-300 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-extrabold text-slate-900">
                              {voc.word}
                            </span>
                            <span className="text-emerald-700 font-mono text-xs font-semibold">
                              {voc.phonetic}
                            </span>
                          </div>

                          <button
                            onClick={() => playEnglishAudio(voc.word)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer shadow-xs"
                          >
                            <Volume2 className="w-4 h-4" />
                            Escutar
                          </button>
                        </div>

                        <p className="text-slate-700 font-medium">
                          Significado: <strong>{voc.translation}</strong>
                        </p>

                        <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-0.5">
                          <p className="italic font-serif text-slate-800">"{voc.exampleSentence}"</p>
                          <p className="text-slate-500">{voc.exampleTranslation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentStep === 2 ? (
                /* STEP 2: GRAMMAR & REAL DIALOGUE */
                <div className="space-y-4">
                  {/* Grammar Focus */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                    <span className="font-bold text-amber-900 text-xs uppercase block">
                      Foco Gramatical da Lição
                    </span>
                    <p className="text-slate-700 font-medium">{activeLesson.grammarFocus}</p>
                  </div>

                  {/* Dialogue */}
                  {activeLesson.dialogue && activeLesson.dialogue.length > 0 && (
                    <div className="space-y-3">
                      <span className="font-bold text-slate-700 uppercase tracking-wider block">
                        Diálogo no Mundo Real
                      </span>
                      {activeLesson.dialogue.map((d) => (
                        <div
                          key={d.id}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                            d.speakerRole === 'user'
                              ? 'bg-emerald-50 border-emerald-200 ml-4'
                              : 'bg-slate-50 border-slate-200 mr-4'
                          }`}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-950">{d.speaker}</span>
                              <button
                                onClick={() => playEnglishAudio(d.text)}
                                className="text-emerald-600 hover:text-emerald-800 cursor-pointer p-1"
                                title="Ouvir fala"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-slate-800 text-xs font-medium">{d.text}</p>
                            <p className="text-[11px] text-slate-500 italic">{d.translation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* STEP 3: FIXATION QUIZ */
                <div className="space-y-5">
                  <div className="space-y-4">
                    {activeLesson.questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900">
                            {qIdx + 1}. {q.prompt}
                          </span>
                          {q.audioVoiceText && (
                            <button
                              onClick={() => playEnglishAudio(q.audioVoiceText!)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Ouvir
                            </button>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-1.5">
                          {q.options?.map((opt, oIdx) => {
                            const isChosen = selectedAnswers[q.id] === opt;
                            const isCorrect = opt === q.correctAnswer;
                            const showResult = quizSubmitted;

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                }
                                className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                                  showResult
                                    ? isCorrect
                                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                                      : isChosen
                                      ? 'bg-rose-100 border-rose-300 text-rose-950'
                                      : 'bg-white border-slate-200 text-slate-500'
                                    : isChosen
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <span>{opt}</span>
                                {showResult && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                            <strong>Explicação:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer shadow-md"
                    >
                      Verificar Respostas
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishLesson}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Concluir Lição & Resgatar +{activeLesson.xpValue} XP
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Player Footer Controls */}
            {!lessonCompletedAlert && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                {currentStep > 0 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold cursor-pointer"
                  >
                    &larr; Voltar
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Próximo Passo <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
