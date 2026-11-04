import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceEntry } from '../../types';
import {
  ClipboardCheck,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  BookOpen,
  Clock,
  Sparkles,
  Check,
  History,
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { classes, students, sessions, saveAttendanceSession } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('pt-PT'));
  const [topic, setTopic] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [homeworkAssigned, setHomeworkAssigned] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected class students
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Attendance state for current session
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'justified'>>({});

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'justified') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const newMap: Record<string, 'present' | 'absent' | 'justified'> = {};
    classStudents.forEach((st) => {
      newMap[st.id] = 'present';
    });
    setAttendanceMap(newMap);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Por favor, informe o tópico/conteúdo trabalhado na aula.');
      return;
    }

    const records: AttendanceEntry[] = classStudents.map((st) => ({
      studentId: st.id,
      status: attendanceMap[st.id] || 'present',
    }));

    saveAttendanceSession({
      classId: selectedClassId,
      date,
      topic,
      summary,
      homeworkAssigned: homeworkAssigned || undefined,
      records,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    // Reset topic & summary
    setTopic('');
    setSummary('');
    setHomeworkAssigned('');
  };

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classSessionsHistory = sessions.filter((s) => s.classId === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Diário de Classe & Registro de Chamada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Lançamento de presença, tópicos ministrados e homework vinculado ao aplicativo do aluno.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setAttendanceMap({});
            }}
            className="py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white shadow-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Chamada e diário salvos com sucesso! A frequência dos alunos e as tarefas no aplicativo foram sincronizadas em tempo real.
          </span>
        </div>
      )}

      {/* Main Journal Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lesson details and Attendance roster */}
        <div className="lg:col-span-2 space-y-5">
          {/* Class details & Topic */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  {currentClass?.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                  {currentClass?.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Data da Aula:</span>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="font-bold text-slate-800 border-b border-slate-300 pb-0.5 w-24 text-center focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tópico / Conteúdo Ministrado nesta Aula *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Modal Verbs for polite requests & Speaking Drills on Airport Situations"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Resumo das Atividades em Sala / Observações do Professor
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prática em pares sobre situações de alfândega. Exercício de audição realizado no lab."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
                  <span>Tarefa de Casa (Homework) Atribuída no Aplicativo</span>
                  <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Aparecerá no App dos Alunos
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Completar Unidade 2 - Lição 1 no App e gravar 2 frases no Speech Lab"
                  value={homeworkAssigned}
                  onChange={(e) => setHomeworkAssigned(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Student Attendance List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Chamada dos Alunos ({classStudents.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Clique no status para alterar a presença do estudante
                </p>
              </div>

              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition cursor-pointer"
              >
                Marcar Todos Presentes
              </button>
            </div>

            {classStudents.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Nenhum aluno cadastrado nesta turma.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {classStudents.map((st) => {
                  const status = attendanceMap[st.id] || 'present';
                  return (
                    <div
                      key={st.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">
                            {st.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Frequência Acumulada: <strong>{st.attendancePercent}%</strong>
                          </span>
                        </div>
                      </div>

                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Presente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            status === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Ausente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'justified')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            status === 'justified'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Justificado
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Diário & Frequência
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Class History */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Aulas Anteriores desta Turma
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Registro histórico de tópicos já lecionados para acompanhamento curricular.
          </p>

          {classSessionsHistory.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Nenhuma sessão gravada anteriormente para esta turma.
            </p>
          ) : (
            <div className="space-y-3">
              {classSessionsHistory.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{sess.date}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {sess.attendance.filter((a) => a.status === 'present').length} presentes
                    </span>
                  </div>
                  <p className="font-medium text-indigo-900 text-xs">{sess.topic}</p>
                  <p className="text-slate-500 text-[11px] italic">{sess.summary}</p>
                  {sess.homeworkAssigned && (
                    <div className="text-[10px] text-indigo-700 bg-indigo-50/60 p-1.5 rounded border border-indigo-100">
                      <strong>HW:</strong> {sess.homeworkAssigned}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
