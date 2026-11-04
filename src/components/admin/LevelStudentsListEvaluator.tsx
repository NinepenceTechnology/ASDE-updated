import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, CEFRLevel, CEFR_IELTS_MAP } from '../../types';
import { exportStudentsToExcel } from '../../utils/excelExport';
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Award,
  Clock,
  Target,
  Sparkles,
  Save,
  Search,
  UserCheck,
  BookOpen,
  Volume2,
  Edit3,
  BookMarked,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface EvaluationDraft {
  speaking: number;
  listening: number;
  writing: number;
  grammar: number;
  reading: number;
  appExposureHours: number;
  appExercisesScore: number;
  teacherFeedback: string;
}

export const LevelStudentsListEvaluator: React.FC = () => {
  const { students, addStudentGrade } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationDraft>>({});
  const [savedSuccessAlert, setSavedSuccessAlert] = useState<string | null>(null);

  // Filter students by selected level and search term
  const filteredStudents = students.filter((s) => {
    const matchLevel = selectedLevel === 'all' || s.level === selectedLevel;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLevel && matchSearch;
  });

  // Count per level for tabs
  const levelCounts: Record<string, number> = {
    all: students.length,
    A1: students.filter((s) => s.level === 'A1').length,
    A2: students.filter((s) => s.level === 'A2').length,
    B1: students.filter((s) => s.level === 'B1').length,
    B2: students.filter((s) => s.level === 'B2').length,
    C1: students.filter((s) => s.level === 'C1').length,
    C2: students.filter((s) => s.level === 'C2').length,
  };

  // Helper to initialize or get current draft for a student
  const getDraft = (student: Student): EvaluationDraft => {
    if (evaluations[student.id]) {
      return evaluations[student.id];
    }
    const latest = student.grades && student.grades.length > 0 ? student.grades[0] : null;
    return {
      speaking: latest?.speaking ?? 85,
      listening: latest?.listening ?? 85,
      writing: latest?.writing ?? 80,
      grammar: latest?.grammar ?? 80,
      reading: latest?.reading ?? 85,
      appExposureHours: latest?.appExposureHours ?? (student.appProgress.hoursStudied || 10),
      appExercisesScore: latest?.appExercisesScore ?? (student.appProgress.exercisesAverageScore || 85),
      teacherFeedback: latest?.teacherFeedback ?? 'Ótimo empenho nas atividades presenciais e no aplicativo.',
    };
  };

  const handleScoreChange = (
    studentId: string,
    student: Student,
    field: keyof EvaluationDraft,
    val: any
  ) => {
    const current = getDraft(student);
    setEvaluations((prev) => ({
      ...prev,
      [studentId]: {
        ...current,
        [field]: val,
      },
    }));
  };

  const calculateOverall = (draft: EvaluationDraft): number => {
    // Formula ponderada por estilos: Fala (25%), Escuta (20%), Leitura (20%), Escrita (15%), Gramática (10%), App (10%)
    const appScore = Math.min(100, Math.max(0, draft.appExercisesScore));
    const raw =
      draft.speaking * 0.25 +
      draft.listening * 0.20 +
      draft.reading * 0.20 +
      draft.writing * 0.15 +
      draft.grammar * 0.10 +
      appScore * 0.10;
    return Math.round(raw);
  };

  const handleSaveStudentEvaluation = (student: Student) => {
    const draft = getDraft(student);
    const overall = calculateOverall(draft);

    addStudentGrade(student.id, {
      term: `Pauta de Avaliação ASDE - ${student.level}`,
      date: new Date().toLocaleDateString('pt-PT'),
      speaking: Number(draft.speaking),
      listening: Number(draft.listening),
      reading: Number(draft.reading),
      writing: Number(draft.writing),
      grammar: Number(draft.grammar),
      teacherFeedback: draft.teacherFeedback,
      evaluatorTeacherId: 'tch-1',
      appExposureHours: Number(draft.appExposureHours),
      appExercisesScore: Number(draft.appExercisesScore),
      appCompletedExercisesCount: student.appProgress.exercisesCompletedCount || 0,
      ieltsEquivalentBand: CEFR_IELTS_MAP[student.level]?.ieltsBand || 'IELTS 5.0',
    });

    setSavedSuccessAlert(`Avaliação de ${student.name} salva com sucesso! Média: ${overall}/100.`);
    setTimeout(() => setSavedSuccessAlert(null), 4000);
  };

  const handleExportExcel = () => {
    const levelLabel =
      selectedLevel === 'all'
        ? 'Todos os Níveis'
        : `Nível ${selectedLevel} - ${CEFR_IELTS_MAP[selectedLevel as CEFRLevel]?.name || ''}`;
    exportStudentsToExcel(filteredStudents, levelLabel);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-emerald-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/20">
              Pauta Oficial de Avaliações
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              Centro de Formação Profissional ASDE
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Lista de Alunos por Nível & Avaliação por Estilos
          </h1>
          <p className="text-xs text-emerald-100/80 max-w-2xl">
            Gere e visualize a lista de formandos por nível (CEFR & IELTS), avalie por estilos
            (<strong>Fala, Escuta, Escrita, Gramática e Leitura</strong>) com horas de exposição no app e exporte diretamente para o Excel.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition transform hover:scale-102 cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exportar Lista via Excel (.csv)</span>
        </button>
      </div>

      {/* Alert Notification */}
      {savedSuccessAlert && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{savedSuccessAlert}</span>
          </div>
          <button
            onClick={() => setSavedSuccessAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Level Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Level Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedLevel === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Todos os Níveis</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {levelCounts.all}
              </span>
            </button>

            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
              const isSelected = selectedLevel === lvl;
              const count = levelCounts[lvl] || 0;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>Nível {lvl}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar formando ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Current Level Info Banner */}
        {selectedLevel !== 'all' && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>
                <strong>Nível {selectedLevel}</strong> • {CEFR_IELTS_MAP[selectedLevel as CEFRLevel]?.name} •{' '}
                {CEFR_IELTS_MAP[selectedLevel as CEFRLevel]?.ieltsBand}
              </span>
            </div>
            <span className="font-semibold text-emerald-800">
              {filteredStudents.length} formandos matriculados
            </span>
          </div>
        )}
      </div>

      {/* Evaluator Table with Fields for 5 Styles: Fala, Escuta, Escrita, Gramática, Leitura */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-emerald-100 bg-emerald-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Grade de Avaliação por Estilos Pedagógicos (Corpo Docente)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Escala: 0 a 100 pontos para cada estilo de competência
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Nenhum aluno encontrado para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                  <th className="py-3 px-4">Aluno & Inscrição</th>
                  <th className="py-3 px-2 text-center">Nível / Turma</th>
                  <th className="py-3 px-2 text-center bg-emerald-50/80 text-emerald-950">
                    🗣️ Fala (Speaking)
                  </th>
                  <th className="py-3 px-2 text-center bg-teal-50/80 text-teal-950">
                    🎧 Escuta (Listening)
                  </th>
                  <th className="py-3 px-2 text-center bg-purple-50/80 text-purple-950">
                    ✍️ Escrita (Writing)
                  </th>
                  <th className="py-3 px-2 text-center bg-amber-50/80 text-amber-950">
                    📖 Gramática
                  </th>
                  <th className="py-3 px-2 text-center bg-sky-50/80 text-sky-950">
                    📑 Leitura (Reading)
                  </th>
                  <th className="py-3 px-2 text-center bg-emerald-100/50 text-emerald-950">
                    ⏱️ App (h / %)
                  </th>
                  <th className="py-3 px-3 text-center">Média Geral</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const draft = getDraft(student);
                  const overall = calculateOverall(draft);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {student.enrollmentCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Level & Class */}
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {student.level}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5 truncate max-w-[100px]">
                          {student.className}
                        </span>
                      </td>

                      {/* Estilo 1: FALA (Speaking) */}
                      <td className="py-2 px-2 text-center bg-emerald-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.speaking}
                          onChange={(e) =>
                            handleScoreChange(student.id, student, 'speaking', Number(e.target.value))
                          }
                          className="w-16 text-center text-xs font-bold py-1 px-1.5 rounded-lg border border-emerald-300 bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Estilo 2: ESCUTA (Listening) */}
                      <td className="py-2 px-2 text-center bg-teal-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.listening}
                          onChange={(e) =>
                            handleScoreChange(student.id, student, 'listening', Number(e.target.value))
                          }
                          className="w-16 text-center text-xs font-bold py-1 px-1.5 rounded-lg border border-teal-300 bg-white focus:ring-1 focus:ring-teal-500"
                        />
                      </td>

                      {/* Estilo 3: ESCRITA (Writing) */}
                      <td className="py-2 px-2 text-center bg-purple-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.writing}
                          onChange={(e) =>
                            handleScoreChange(student.id, student, 'writing', Number(e.target.value))
                          }
                          className="w-16 text-center text-xs font-bold py-1 px-1.5 rounded-lg border border-purple-300 bg-white focus:ring-1 focus:ring-purple-500"
                        />
                      </td>

                      {/* Estilo 4: GRAMÁTICA (Grammar) */}
                      <td className="py-2 px-2 text-center bg-amber-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.grammar}
                          onChange={(e) =>
                            handleScoreChange(student.id, student, 'grammar', Number(e.target.value))
                          }
                          className="w-16 text-center text-xs font-bold py-1 px-1.5 rounded-lg border border-amber-300 bg-white focus:ring-1 focus:ring-amber-500"
                        />
                      </td>

                      {/* Estilo 5: LEITURA (Reading) */}
                      <td className="py-2 px-2 text-center bg-sky-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.reading}
                          onChange={(e) =>
                            handleScoreChange(student.id, student, 'reading', Number(e.target.value))
                          }
                          className="w-16 text-center text-xs font-bold py-1 px-1.5 rounded-lg border border-sky-300 bg-white focus:ring-1 focus:ring-sky-500"
                        />
                      </td>

                      {/* App metrics */}
                      <td className="py-2 px-2 text-center bg-emerald-100/30 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            title="Horas no App"
                            value={draft.appExposureHours}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                student,
                                'appExposureHours',
                                Number(e.target.value)
                              )
                            }
                            className="w-12 text-center text-[11px] font-bold py-1 px-0.5 rounded border border-emerald-300 bg-white"
                          />
                          <span className="text-[10px] text-slate-500">h</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            title="Nota Média nos Exercícios do App"
                            value={draft.appExercisesScore}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                student,
                                'appExercisesScore',
                                Number(e.target.value)
                              )
                            }
                            className="w-12 text-center text-[11px] font-bold py-1 px-0.5 rounded border border-amber-300 bg-white"
                          />
                          <span className="text-[10px] text-slate-500">%</span>
                        </div>
                      </td>

                      {/* Overall Average */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                            overall >= 70
                              ? 'bg-emerald-100 text-emerald-800'
                              : overall >= 50
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {overall}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">
                          Ponderada
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSaveStudentEvaluation(student)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Salvar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
