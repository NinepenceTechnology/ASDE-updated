import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CEFR_IELTS_MAP } from '../../types';
import {
  Award,
  BookOpen,
  Mic,
  Headphones,
  FileEdit,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Save,
  MessageSquareQuote,
  ShieldCheck,
  Clock,
  Target,
  CheckSquare,
} from 'lucide-react';

export const GradesEvaluator: React.FC = () => {
  const { students, addStudentGrade, teachers, setActiveStudentId, setViewMode } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [termName, setTermName] = useState('Avaliação Bimestral 2025.1');
  const [evaluatorTeacherId, setEvaluatorTeacherId] = useState(teachers[0]?.id || '');

  // 5 CEFR Skills
  const [speaking, setSpeaking] = useState<number>(85);
  const [listening, setListening] = useState<number>(88);
  const [reading, setReading] = useState<number>(90);
  const [writing, setWriting] = useState<number>(82);
  const [grammar, setGrammar] = useState<number>(84);

  // App Specific Academic Metrics (Horas de exposição & Avaliação de exercícios no app)
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const [appExposureHours, setAppExposureHours] = useState<number>(
    selectedStudent?.appProgress.hoursStudied || 42.5
  );
  const [appExercisesScore, setAppExercisesScore] = useState<number>(
    selectedStudent?.appProgress.exercisesAverageScore || 92
  );
  const [appCompletedExercises, setAppCompletedExercises] = useState<number>(
    selectedStudent?.appProgress.exercisesCompletedCount || 36
  );

  const [feedback, setFeedback] = useState<string>(
    'Demonstrou excelente desenvoltura e autonomia comunicativa. Destacou-se pelo alto volume de horas de atividades e precisão nos exercícios práticos do aplicativo móvel.'
  );
  const [savedAlert, setSavedAlert] = useState(false);

  // Update app metrics defaults when student changes
  useEffect(() => {
    if (selectedStudent) {
      setAppExposureHours(selectedStudent.appProgress.hoursStudied || 30);
      setAppExercisesScore(selectedStudent.appProgress.exercisesAverageScore || 88);
      setAppCompletedExercises(selectedStudent.appProgress.exercisesCompletedCount || 25);
    }
  }, [selectedStudentId]);

  // Weighted overall calculation
  const overall = Math.round(
    speaking * 0.25 +
      listening * 0.2 +
      reading * 0.2 +
      writing * 0.15 +
      grammar * 0.1 +
      (appExercisesScore / 100) * 10
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName.trim()) return;

    const levelMap = CEFR_IELTS_MAP[selectedStudent?.level || 'B1'];

    addStudentGrade(selectedStudentId, {
      term: termName,
      date: new Date().toLocaleDateString('pt-PT'),
      speaking,
      listening,
      reading,
      writing,
      grammar,
      teacherFeedback: feedback,
      evaluatorTeacherId,
      appExposureHours: Number(appExposureHours),
      appExercisesScore: Number(appExercisesScore),
      appCompletedExercisesCount: Number(appCompletedExercises),
      ieltsEquivalentBand: levelMap?.ieltsBand || 'Band 5.5',
    });

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Lançamento de Notas & Avaliações CEFR / IELTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Avaliação integrada: Competências em sala + Espaço de Horas de Exposição e Notas de Exercícios no App.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="eval-student-select" className="text-xs text-slate-600 font-bold">
            Aluno Selecionado:
          </label>
          <select
            id="eval-student-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border border-emerald-300 bg-emerald-50/40 text-slate-900 shadow-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.level} • {s.className})
              </option>
            ))}
          </select>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            Avaliação gravada com sucesso! O boletim oficial de <strong>{selectedStudent?.name}</strong> foi atualizado com as horas de exposição e notas de exercícios do app.
          </span>
        </div>
      )}

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluation Input Form (2 cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-emerald-200/80 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Ficha Avaliativa Oficial de Desempenho
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Nível CEFR: {selectedStudent?.level}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {CEFR_IELTS_MAP[selectedStudent?.level || 'B1']?.ieltsBand}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome do Ciclo / Exame *</label>
              <input
                type="text"
                required
                value={termName}
                onChange={(e) => setTermName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Professor(a) Examinador(a)</label>
              <select
                value={evaluatorTeacherId}
                onChange={(e) => setEvaluatorTeacherId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.certifications[0] || 'Examiner'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DEDICATED SECTION: App Exposure Hours and Exercise Evaluation Score */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                Espaço de Horas de Exposição & Avaliação de Exercícios no App
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Sincronizado do Aplicativo ASDE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-200/80 space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> Horas de Exposição no App
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={appExposureHours}
                    onChange={(e) => setAppExposureHours(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 font-black text-sm text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-500 text-xs">horas</span>
                </div>
                <p className="text-[10px] text-slate-400">Tempo dedicado no app</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200/80 space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                  <Target className="w-3.5 h-3.5 text-amber-600" /> Nota Média dos Exercícios
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={appExercisesScore}
                    onChange={(e) => setAppExercisesScore(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 font-black text-sm text-amber-700 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-500 text-xs">/100</span>
                </div>
                <p className="text-[10px] text-slate-400">Precisão nos quizzes & testes</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200/80 space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" /> Exercícios Concluídos
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={appCompletedExercises}
                    onChange={(e) => setAppCompletedExercises(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 font-black text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-500 text-xs">unid.</span>
                </div>
                <p className="text-[10px] text-slate-400">Total de atividades feitas</p>
              </div>
            </div>
          </div>

          {/* 5 CEFR Skills Sliders */}
          <div className="space-y-4 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Competências Linguísticas Europeias (0 a 100)
            </h3>

            {/* Speaking */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  Speaking & Fluency (Oralidade e Pronúncia)
                </span>
                <span className="font-black text-sm text-emerald-700">{speaking}/100</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={speaking}
                onChange={(e) => setSpeaking(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Listening */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-teal-600" />
                  Listening Comprehension (Compreensão Auditiva)
                </span>
                <span className="font-black text-sm text-teal-700">{listening}/100</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={listening}
                onChange={(e) => setListening(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Reading */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Reading & Lexical Resource (Leitura e Vocabulário)
                </span>
                <span className="font-black text-sm text-emerald-700">{reading}/100</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={reading}
                onChange={(e) => setReading(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Writing & Grammar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <FileEdit className="w-3.5 h-3.5 text-purple-600" /> Writing (Produção Escrita)
                  </span>
                  <span className="font-black text-sm text-purple-700">{writing}/100</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={writing}
                  onChange={(e) => setWriting(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Grammar (Precisão Sintática)
                  </span>
                  <span className="font-black text-sm text-amber-700">{grammar}/100</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={grammar}
                  onChange={(e) => setGrammar(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Qualitative Teacher Feedback */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs">
              Parecer Pedagógico Descritivo & Orientações de Estudo
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              placeholder="Descreva a evolução do aluno, horas de app cumpridas e pontos a reforçar..."
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Média Geral Ponderada:</span>
              <span className="text-2xl font-black text-emerald-800">{overall} / 100</span>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lançar Avaliação no Boletim
            </button>
          </div>
        </form>

        {/* Student Profile & Historic Evaluations (1 col) */}
        <div className="space-y-4">
          {/* Card: Active Student Overview */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent?.avatar}
                alt={selectedStudent?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-slate-900 truncate">
                  {selectedStudent?.name}
                </h3>
                <span className="text-xs text-slate-500 font-mono block truncate">
                  Matrícula: {selectedStudent?.enrollmentCode}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold block truncate">
                  {selectedStudent?.className}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] text-emerald-900 font-bold block">HORAS NO APP</span>
                <span className="font-black text-emerald-800 text-sm">
                  {(selectedStudent?.appProgress.hoursStudied || 0).toFixed(1)}h
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] text-amber-900 font-bold block">MÉDIA EXERCÍCIOS</span>
                <span className="font-black text-amber-700 text-sm">
                  {(selectedStudent?.appProgress.exercisesAverageScore || 0).toFixed(1)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveStudentId(selectedStudent.id);
                setViewMode('student');
              }}
              className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-200"
            >
              Ver Boletim & App deste Aluno &rarr;
            </button>
          </div>

          {/* Past Evaluations list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Histórico de Avaliações Registradas
            </h4>

            {selectedStudent?.grades.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                Nenhuma nota anterior lançada.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedStudent?.grades.map((grd) => (
                  <div
                    key={grd.id}
                    className="p-3.5 rounded-xl border border-emerald-100 bg-slate-50/80 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{grd.term}</span>
                      <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                        {grd.overall}/100
                      </span>
                    </div>

                    {/* App Exposure & Exercise Score Tag */}
                    {(grd.appExposureHours !== undefined || grd.appExercisesScore !== undefined) && (
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          ⏱️ {grd.appExposureHours || 0}h no app
                        </span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          🎯 {grd.appExercisesScore || 0}% nos exercícios
                        </span>
                        {grd.ieltsEquivalentBand && (
                          <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded-md">
                            {grd.ieltsEquivalentBand}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 flex flex-wrap gap-2">
                      <span>Speaking: {grd.speaking}</span>
                      <span>•</span>
                      <span>Listening: {grd.listening}</span>
                      <span>•</span>
                      <span>Writing: {grd.writing}</span>
                      <span>•</span>
                      <span>Grammar: {grd.grammar}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{grd.teacherFeedback}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
