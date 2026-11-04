import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Star,
  BookOpen,
  Mic,
  Bot,
} from 'lucide-react';

export const GamificationHub: React.FC = () => {
  const { activeStudent, badges, students, setStudentTab } = useApp();

  const xp = activeStudent.appProgress.xp;
  const streak = activeStudent.appProgress.streakDays;
  const completedLessons = activeStudent.appProgress.completedLessonIds?.length || 0;
  const vocabCount = activeStudent.appProgress.vocabularyMastered || 42;
  const speakingAccuracy = activeStudent.appProgress.speakingAccuracyAvg || 88;

  // Calculate Level and XP to Next Level
  const currentLevel = Math.floor(xp / 500) + 1;
  const xpCurrentLevel = xp % 500;
  const progressToNextLevel = Math.min(100, Math.round((xpCurrentLevel / 500) * 100));

  // Sort students for leaderboard
  const sortedStudents = [...students].sort((a, b) => b.appProgress.xp - a.appProgress.xp);
  const activeStudentRank = sortedStudents.findIndex((s) => s.id === activeStudent.id) + 1;

  // Icon mapper for badges
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic':
        return <Mic className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with XP and Progression */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] border border-white">
                Nível {currentLevel}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                  {activeStudent.className}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300">
                  CEFR {activeStudent.level}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{activeStudent.name}</h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Posição no Ranking Escolar: <strong className="text-amber-300">#{activeStudentRank} lugar</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                <Sparkles className="w-4 h-4" />
                <span className="font-black text-lg sm:text-xl">{xp}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-300">Total XP</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-orange-400 mb-0.5">
                <Flame className="w-4 h-4" />
                <span className="font-black text-lg sm:text-xl">{streak}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-300">Dias Seguidos</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                <Zap className="w-4 h-4" />
                <span className="font-black text-lg sm:text-xl">{speakingAccuracy}%</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-300">Fala Lab</span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">
              Progresso para o Nível {currentLevel + 1}
            </span>
            <span className="text-indigo-200 font-mono">
              {xpCurrentLevel} / 500 XP ({progressToNextLevel}%)
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-linear-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Badges & Competencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Badges Collection */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Galeria de Conquistas & Insígnias (Badges)
              </h3>
              <p className="text-xs text-slate-500">
                Complete atividades e desafios no aplicativo para desbloquear títulos exclusivos da ASDE.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              4 / {badges.length} Desbloqueadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {badges.map((badge, idx) => {
              // Simulated unlock state
              const isUnlocked = idx < 4;

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'border-indigo-200 bg-indigo-50/30'
                      : 'border-slate-200 bg-slate-50/50 opacity-65'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      isUnlocked
                        ? 'bg-linear-to-br from-amber-400 to-orange-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? getBadgeIcon(badge.iconName) : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{badge.name}</h4>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {isUnlocked ? '✓ Conquistada' : 'Bloqueada'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Personalized Skills Radar / Competencies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Progressão Personalizada
            </h3>
            <p className="text-xs text-slate-500">
              Desempenho individual por competência CEFR.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { skill: 'Speaking (Expressão Oral)', percent: speakingAccuracy, color: 'bg-indigo-600' },
              { skill: 'Listening (Compreensão Auditiva)', percent: 84, color: 'bg-emerald-600' },
              { skill: 'Grammar (Precisão Gramatical)', percent: 80, color: 'bg-blue-600' },
              { skill: 'Vocabulary (Riqueza Lexical)', percent: 86, color: 'bg-amber-500' },
              { skill: 'Reading & Writing', percent: 78, color: 'bg-purple-600' },
            ].map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{item.skill}</span>
                  <span className="font-bold text-slate-900">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block">Diagnóstico do Professor:</span>
            <p>
              Lucas apresenta excelente ritmo de fala e confiança comunicativa. O foco deste bimestre é refinar tempos verbais compostos e phrasal verbs corporativos.
            </p>
          </div>

          <button
            onClick={() => setStudentTab('ranking')}
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-4 h-4" />
            Ver Ranking Completo da Turma
          </button>
        </div>
      </div>
    </div>
  );
};
