import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CEFR_IELTS_MAP, CEFRLevel } from '../../types';
import {
  Trophy,
  Medal,
  Flame,
  Award,
  Sparkles,
  TrendingUp,
  Crown,
  Users,
  Clock,
  Target,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { students, activeStudent } = useApp();

  const [rankingMetric, setRankingMetric] = useState<'hours' | 'grades' | 'xp'>('hours');
  const [scope, setScope] = useState<'all' | 'class' | 'level'>('all');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(activeStudent.level);

  // Filter students based on scope
  const filteredStudents = students.filter((s) => {
    if (scope === 'class') {
      return s.classId === activeStudent.classId;
    }
    if (scope === 'level') {
      return s.level === selectedLevel;
    }
    return true;
  });

  // Sort based on chosen ranking metric
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (rankingMetric === 'hours') {
      return (b.appProgress.hoursStudied || 0) - (a.appProgress.hoursStudied || 0);
    }
    if (rankingMetric === 'grades') {
      return (b.appProgress.exercisesAverageScore || 0) - (a.appProgress.exercisesAverageScore || 0);
    }
    return b.appProgress.xp - a.appProgress.xp;
  });

  // Find Champions in current scope
  const topHoursStudent = [...filteredStudents].sort(
    (a, b) => (b.appProgress.hoursStudied || 0) - (a.appProgress.hoursStudied || 0)
  )[0];

  const topGradesStudent = [...filteredStudents].sort(
    (a, b) => (b.appProgress.exercisesAverageScore || 0) - (a.appProgress.exercisesAverageScore || 0)
  )[0];

  const myRank = sortedStudents.findIndex((s) => s.id === activeStudent.id) + 1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center justify-center gap-1.5">
          <Trophy className="w-4 h-4 text-emerald-600" />
          Competição & Quadro de Honra ASDE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Ranking de Atividades & Notas no App
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Veja quem lidera em <strong>horas de dedicação</strong> e <strong>melhores notas nos exercícios</strong> por turma e nível de proficiência.
        </p>
      </div>

      {/* Spotlight Champions Cards (Horas de Actividades & Melhores Notas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champion 1: Mais Horas de Atividades */}
        {topHoursStudent && (
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 border border-emerald-600/40 shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-800/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                <Crown className="w-4 h-4 text-amber-400" />
                Líder em Horas no App
              </span>
              <span className="text-[10px] font-bold bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
                Mais Exposição
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-3">
              <div className="relative shrink-0">
                <img
                  src={topHoursStudent.avatar}
                  alt={topHoursStudent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                  🥇
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {topHoursStudent.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <span className="font-semibold">{topHoursStudent.className}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-amber-300">{topHoursStudent.level}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-black text-emerald-300 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    {(topHoursStudent.appProgress.hoursStudied || 0).toFixed(1)}h
                  </span>
                  <span className="text-[11px] text-emerald-200/80">de atividades</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Champion 2: Melhores Notas Obtidas nos Exercícios */}
        {topGradesStudent && (
          <div className="bg-gradient-to-br from-amber-950/90 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 border border-amber-600/40 shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-800/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                Melhores Notas nos Exercícios
              </span>
              <span className="text-[10px] font-bold bg-amber-900/70 px-2 py-0.5 rounded-full text-amber-200">
                Precisão Máxima
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-3">
              <div className="relative shrink-0">
                <img
                  src={topGradesStudent.avatar}
                  alt={topGradesStudent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                  🏆
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {topGradesStudent.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <span className="font-semibold">{topGradesStudent.className}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-emerald-300">{topGradesStudent.level}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-black text-amber-300 flex items-center gap-1">
                    <Target className="w-4 h-4 text-amber-400" />
                    {(topGradesStudent.appProgress.exercisesAverageScore || 0).toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-amber-200/80">média nos quizzes</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar: Metric Switcher & Scope Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Metric Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setRankingMetric('hours')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              rankingMetric === 'hours'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Horas no App
          </button>
          <button
            onClick={() => setRankingMetric('grades')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              rankingMetric === 'grades'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Melhores Notas
          </button>
          <button
            onClick={() => setRankingMetric('xp')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              rankingMetric === 'xp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Total de XP
          </button>
        </div>

        {/* Scope Filters (Toda a Escola / Minha Turma / Nível) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                scope === 'all'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Geral ({students.length})
            </button>
            <button
              onClick={() => setScope('class')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                scope === 'class'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Minha Turma
            </button>
            <button
              onClick={() => setScope('level')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                scope === 'level'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Por Nível
            </button>
          </div>

          {scope === 'level' && (
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as CEFRLevel)}
              className="text-xs font-bold bg-emerald-50 border border-emerald-300 rounded-lg py-1.5 px-2 text-emerald-900 cursor-pointer"
            >
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                <option key={lvl} value={lvl}>
                  Nível {lvl} ({CEFR_IELTS_MAP[lvl]?.name})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Your Rank Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
            #{myRank || '-'}
          </div>
          <div>
            <span className="font-black text-slate-900 block sm:inline mr-2">
              Sua Posição Atual:
            </span>
            <span className="text-emerald-800">
              {activeStudent.name} • {(activeStudent.appProgress.hoursStudied || 0).toFixed(1)}h no app • {(activeStudent.appProgress.exercisesAverageScore || 0).toFixed(1)}% nas notas
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-block font-extrabold text-[11px] bg-emerald-200 text-emerald-950 px-2.5 py-1 rounded-lg">
          Turma: {activeStudent.className}
        </span>
      </div>

      {/* Podium Top 3 */}
      {sortedStudents.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 items-end pt-4 pb-2">
          {/* Rank 2 - Silver */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center space-y-2 shadow-xs order-1">
            <div className="relative inline-block">
              <img
                src={sortedStudents[1].avatar}
                alt={sortedStudents[1].name}
                className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-slate-300 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 truncate">
                {sortedStudents[1].name}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {sortedStudents[1].level} • {sortedStudents[1].className}
              </span>
            </div>
            <div className="text-xs font-black text-emerald-700">
              {rankingMetric === 'hours' && `${(sortedStudents[1].appProgress.hoursStudied || 0).toFixed(1)}h`}
              {rankingMetric === 'grades' && `${(sortedStudents[1].appProgress.exercisesAverageScore || 0).toFixed(1)}%`}
              {rankingMetric === 'xp' && `${sortedStudents[1].appProgress.xp} XP`}
            </div>
          </div>

          {/* Rank 1 - Gold */}
          <div className="bg-gradient-to-b from-amber-50 via-emerald-50/40 to-white rounded-2xl border-2 border-amber-300 p-5 text-center space-y-2 shadow-md order-2 -translate-y-2">
            <div className="relative inline-block">
              <Crown className="w-6 h-6 text-amber-500 mx-auto -mb-1 animate-bounce" />
              <img
                src={sortedStudents[0].avatar}
                alt={sortedStudents[0].name}
                className="w-16 h-16 rounded-full object-cover mx-auto border-3 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                1
              </span>
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 truncate">
                {sortedStudents[0].name}
              </h3>
              <span className="text-[10px] text-emerald-800 font-bold">
                {sortedStudents[0].level} • {sortedStudents[0].className}
              </span>
            </div>
            <div className="text-sm font-black text-amber-700 bg-amber-100/70 py-0.5 px-2 rounded-lg inline-block">
              {rankingMetric === 'hours' && `${(sortedStudents[0].appProgress.hoursStudied || 0).toFixed(1)}h no app`}
              {rankingMetric === 'grades' && `${(sortedStudents[0].appProgress.exercisesAverageScore || 0).toFixed(1)}% nas notas`}
              {rankingMetric === 'xp' && `${sortedStudents[0].appProgress.xp} XP`}
            </div>
          </div>

          {/* Rank 3 - Bronze */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center space-y-2 shadow-xs order-3">
            <div className="relative inline-block">
              <img
                src={sortedStudents[2].avatar}
                alt={sortedStudents[2].name}
                className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-amber-700/40 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 truncate">
                {sortedStudents[2].name}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {sortedStudents[2].level} • {sortedStudents[2].className}
              </span>
            </div>
            <div className="text-xs font-black text-emerald-700">
              {rankingMetric === 'hours' && `${(sortedStudents[2].appProgress.hoursStudied || 0).toFixed(1)}h`}
              {rankingMetric === 'grades' && `${(sortedStudents[2].appProgress.exercisesAverageScore || 0).toFixed(1)}%`}
              {rankingMetric === 'xp' && `${sortedStudents[2].appProgress.xp} XP`}
            </div>
          </div>
        </div>
      )}

      {/* Complete Rankings List */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {sortedStudents.map((st, index) => {
          const isMe = st.id === activeStudent.id;
          return (
            <div
              key={st.id}
              className={`p-4 flex items-center justify-between transition ${
                isMe ? 'bg-emerald-50/80 font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-7 text-center font-black text-xs ${
                    index === 0
                      ? 'text-amber-500 text-sm'
                      : index === 1
                      ? 'text-slate-400 text-sm'
                      : index === 2
                      ? 'text-amber-700 text-sm'
                      : 'text-slate-400'
                  }`}
                >
                  #{index + 1}
                </span>

                <img
                  src={st.avatar}
                  alt={st.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {st.name}
                    </span>
                    {isMe && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                        Você
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{st.className}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">{st.level}</span>
                    <span>•</span>
                    <span className="text-slate-400">
                      {CEFR_IELTS_MAP[st.level]?.ieltsBand}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                {/* Secondary details */}
                <div className="hidden sm:flex flex-col text-right text-[11px]">
                  <span className="text-slate-500 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {(st.appProgress.hoursStudied || 0).toFixed(1)}h
                  </span>
                  <span className="text-slate-500 flex items-center justify-end gap-1">
                    <Target className="w-3 h-3 text-amber-600" />
                    {(st.appProgress.exercisesAverageScore || 0).toFixed(1)}% notas
                  </span>
                </div>

                {/* Primary Metric Display */}
                <div className="text-right min-w-[70px]">
                  {rankingMetric === 'hours' && (
                    <span className="font-black text-xs sm:text-sm text-emerald-800">
                      {(st.appProgress.hoursStudied || 0).toFixed(1)}h
                    </span>
                  )}
                  {rankingMetric === 'grades' && (
                    <span className="font-black text-xs sm:text-sm text-amber-700">
                      {(st.appProgress.exercisesAverageScore || 0).toFixed(1)}%
                    </span>
                  )}
                  {rankingMetric === 'xp' && (
                    <span className="font-black text-xs sm:text-sm text-emerald-700">
                      {st.appProgress.xp} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
