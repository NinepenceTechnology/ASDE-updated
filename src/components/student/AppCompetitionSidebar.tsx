import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CEFRLevel, CEFR_IELTS_MAP } from '../../types';
import {
  Trophy,
  Clock,
  Award,
  Medal,
  Flame,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Users,
  Target,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface AppCompetitionSidebarProps {
  compact?: boolean;
  onOpenFullView?: () => void;
}

export const AppCompetitionSidebar: React.FC<AppCompetitionSidebarProps> = ({
  compact = false,
  onOpenFullView,
}) => {
  const { students, activeStudent, classes } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [metricTab, setMetricTab] = useState<'both' | 'hours' | 'grades'>('both');

  // Filter students based on selection
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchLevel = selectedLevel === 'all' || s.level === selectedLevel;
      const matchClass = selectedClass === 'all' || s.classId === selectedClass;
      return matchLevel && matchClass;
    });
  }, [students, selectedLevel, selectedClass]);

  // Winner by Hours of App Activity
  const winnerByHours = useMemo(() => {
    if (filteredStudents.length === 0) return null;
    return [...filteredStudents].sort(
      (a, b) => (b.appProgress.hoursStudied || 0) - (a.appProgress.hoursStudied || 0)
    )[0];
  }, [filteredStudents]);

  // Winner by App Exercises Grade Average
  const winnerByGrades = useMemo(() => {
    if (filteredStudents.length === 0) return null;
    return [...filteredStudents].sort(
      (a, b) => (b.appProgress.exercisesAverageScore || 0) - (a.appProgress.exercisesAverageScore || 0)
    )[0];
  }, [filteredStudents]);

  // Top ranked list for detailed leaderboard
  const rankedByHours = useMemo(() => {
    return [...filteredStudents].sort(
      (a, b) => (b.appProgress.hoursStudied || 0) - (a.appProgress.hoursStudied || 0)
    );
  }, [filteredStudents]);

  const rankedByGrades = useMemo(() => {
    return [...filteredStudents].sort(
      (a, b) => (b.appProgress.exercisesAverageScore || 0) - (a.appProgress.exercisesAverageScore || 0)
    );
  }, [filteredStudents]);

  // Find active student position
  const activeStudentHoursRank = rankedByHours.findIndex((s) => s.id === activeStudent.id) + 1;
  const activeStudentGradesRank = rankedByGrades.findIndex((s) => s.id === activeStudent.id) + 1;

  return (
    <aside
      id="asde-app-competition-board"
      className="bg-white rounded-2xl border border-emerald-200/80 shadow-md p-5 space-y-5 overflow-hidden"
    >
      {/* Header with Brand Green Gradient */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight flex items-center gap-1.5">
              Competição ASDE no App
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full border border-amber-300">
                Ao Vivo
              </span>
            </h3>
            <p className="text-[11px] text-emerald-800 font-medium">
              Horas de Atividades & Melhores Notas por Nível e Turma
            </p>
          </div>
        </div>

        {onOpenFullView && (
          <button
            onClick={onOpenFullView}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            Ver Geral <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
            Filtrar Nível
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full text-xs font-semibold bg-emerald-50/50 border border-emerald-200 rounded-lg p-1.5 text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">Todos os Níveis (A1-C2)</option>
            <option value="A1">A1 - Principiante (IELTS 2.0-3.0)</option>
            <option value="A2">A2 - Básico (IELTS 3.5-4.0)</option>
            <option value="B1">B1 - Intermediário (IELTS 4.5-5.0)</option>
            <option value="B2">B2 - Independente (IELTS 5.5-6.5)</option>
            <option value="C1">C1 - Avançado (IELTS 7.0-8.0)</option>
            <option value="C2">C2 - Proficiência (IELTS 8.5-9.0)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
            Filtrar Turma
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full text-xs font-semibold bg-emerald-50/50 border border-emerald-200 rounded-lg p-1.5 text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">Todas as Turmas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Mode Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
        <button
          onClick={() => setMetricTab('both')}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
            metricTab === 'both' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Destaques
        </button>
        <button
          onClick={() => setMetricTab('hours')}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
            metricTab === 'hours' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Clock className="w-3 h-3 text-emerald-600" /> Mais Horas
        </button>
        <button
          onClick={() => setMetricTab('grades')}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
            metricTab === 'grades' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Award className="w-3 h-3 text-amber-500" /> Melhores Notas
        </button>
      </div>

      {/* Destaques: Dois Campeões (Horas de Atividades vs Melhores Notas) */}
      {(metricTab === 'both' || metricTab === 'hours') && winnerByHours && (
        <div className="bg-linear-to-br from-emerald-50 to-teal-50/60 rounded-xl p-3.5 border border-emerald-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
              <Clock className="w-3 h-3 text-emerald-700" />
              Líder em Horas de Atividades no App
            </span>
            <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
              <Medal className="w-4 h-4 text-amber-500" /> 1º Lugar
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={winnerByHours.avatar}
              alt={winnerByHours.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 truncate">
                {winnerByHours.name}
              </h4>
              <p className="text-[11px] text-slate-600 truncate">
                {winnerByHours.className}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                  {winnerByHours.level} • {CEFR_IELTS_MAP[winnerByHours.level]?.ieltsBand}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  ⏱️ {(winnerByHours.appProgress.hoursStudied || 0).toFixed(1)}h no app
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(metricTab === 'both' || metricTab === 'grades') && winnerByGrades && (
        <div className="bg-linear-to-br from-amber-50/80 to-yellow-50/40 rounded-xl p-3.5 border border-amber-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              <Award className="w-3 h-3 text-amber-600" />
              Líder em Melhores Notas nos Exercícios
            </span>
            <span className="text-xs font-black text-amber-700 flex items-center gap-0.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Top Desempenho
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={winnerByGrades.avatar}
              alt={winnerByGrades.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 truncate">
                {winnerByGrades.name}
              </h4>
              <p className="text-[11px] text-slate-600 truncate">
                {winnerByGrades.className}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                  {winnerByGrades.level} • {CEFR_IELTS_MAP[winnerByGrades.level]?.ieltsBand}
                </span>
                <span className="text-xs font-black text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-300">
                  🎯 {(winnerByGrades.appProgress.exercisesAverageScore || 0).toFixed(1)}% média
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
          <span>Ranking de Alunos ({filteredStudents.length})</span>
          <span>
            {metricTab === 'grades' ? 'Nota dos Exercícios' : 'Horas de Atividade'}
          </span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {(metricTab === 'grades' ? rankedByGrades : rankedByHours).map((student, idx) => {
            const isMe = student.id === activeStudent.id;
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition ${
                  isMe
                    ? 'bg-emerald-100/80 border border-emerald-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate flex items-center gap-1">
                      {student.name}
                      {isMe && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1 rounded-sm">
                          Você
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {student.level} • {student.className}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {metricTab === 'grades' ? (
                    <div>
                      <span className="font-extrabold text-emerald-800 text-xs">
                        {(student.appProgress.exercisesAverageScore || 0).toFixed(1)}%
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        {student.appProgress.exercisesCompletedCount || 0} feitos
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-extrabold text-emerald-800 text-xs">
                        {(student.appProgress.hoursStudied || 0).toFixed(1)}h
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        {student.appProgress.xp} XP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Student Motivation Banner */}
      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-950">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-[11px] leading-tight">
          <strong>Sua posição atual:</strong> #{activeStudentHoursRank || 1} em horas e #
          {activeStudentGradesRank || 1} em exercícios na turma <strong>{activeStudent.className}</strong>.
          Pratique mais lições para subir no pódio da ASDE!
        </p>
      </div>
    </aside>
  );
};
