import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassGroup, CEFRLevel } from '../../types';
import {
  BookOpen,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle,
  TrendingUp,
  X,
  ClipboardList,
  GraduationCap,
} from 'lucide-react';

export const ClassesManager: React.FC = () => {
  const {
    classes,
    teachers,
    students,
    addClassGroup,
    setAdminSection,
    setActiveStudentId,
    setViewMode,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassGroup | null>(null);

  // New Class Form
  const [newClass, setNewClass] = useState({
    name: '',
    code: '',
    level: 'A1' as CEFRLevel,
    teacherId: teachers[0]?.id || '',
    schedule: 'Segundas e Quartas • 19:00 - 20:30',
    room: 'Sala 01 - London Hall',
    modality: 'Presencial' as 'Presencial' | 'Online Ao Vivo' | 'Híbrido',
    capacity: 12,
    currentUnit: 'Unit 1: Introductions & Phonetics',
    status: 'active' as 'active' | 'upcoming',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name) return;

    const teacher = teachers.find((t) => t.id === newClass.teacherId);
    addClassGroup({
      name: newClass.name,
      code: newClass.code || `ENG-${newClass.level}-${Math.floor(10 + Math.random() * 90)}`,
      level: newClass.level,
      teacherId: newClass.teacherId,
      teacherName: teacher ? teacher.name : 'Docente da Academia',
      schedule: newClass.schedule,
      room: newClass.room,
      modality: newClass.modality,
      capacity: Number(newClass.capacity) || 12,
      currentUnit: newClass.currentUnit,
      status: newClass.status,
    });

    setIsModalOpen(false);
    setNewClass({
      name: '',
      code: '',
      level: 'A1',
      teacherId: teachers[0]?.id || '',
      schedule: 'Segundas e Quartas • 19:00 - 20:30',
      room: 'Sala 01 - London Hall',
      modality: 'Presencial',
      capacity: 12,
      currentUnit: 'Unit 1: Introductions & Phonetics',
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Turmas & Horários Acadêmicos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gerencie as turmas ativas, salas presenciais, links de aula ao vivo e avanço do currículo pedagógico.
          </p>
        </div>

        <button
          id="open-create-class-btn"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Criar Nova Turma
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const teacher = teachers.find((t) => t.id === cls.teacherId);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Nível {cls.level}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        {cls.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cls.modality === 'Online Ao Vivo'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : cls.modality === 'Híbrido'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {cls.modality}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {cls.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedClassDetail(cls)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                    title="Ver alunos matriculados"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>

                {/* Details List */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Professor(a): <strong className="text-indigo-900">{cls.teacherName}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress & Topic */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium truncate max-w-[240px]">
                      {cls.currentUnit}
                    </span>
                    <span className="font-bold text-indigo-700">
                      {cls.syllabusProgress}% cumprido
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${cls.syllabusProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Enrollments & Quick actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {classStudents.slice(0, 3).map((st) => (
                      <img
                        key={st.id}
                        src={st.avatar}
                        alt={st.name}
                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {classStudents.length} / {cls.capacity} alunos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedClassDetail(cls);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                  >
                    Alunos ({classStudents.length})
                  </button>
                  <button
                    onClick={() => setAdminSection('attendance')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition cursor-pointer"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    Chamada
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Class Student Roster */}
      {selectedClassDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedClassDetail.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedClassDetail.schedule} • Prof. {selectedClassDetail.teacherName}
                </p>
              </div>
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              <h3 className="font-bold text-slate-700 uppercase tracking-wider">
                Alunos Matriculados nesta Turma ({students.filter((s) => s.classId === selectedClassDetail.id).length})
              </h3>

              {students.filter((s) => s.classId === selectedClassDetail.id).length === 0 ? (
                <p className="text-slate-400 py-4 text-center">
                  Nenhum aluno alocado nesta turma ainda.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {students
                    .filter((s) => s.classId === selectedClassDetail.id)
                    .map((st) => (
                      <div
                        key={st.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">{st.name}</span>
                            <span className="text-[11px] text-slate-400">{st.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-indigo-700">
                            {st.attendancePercent}% presença
                          </span>
                          <button
                            onClick={() => {
                              setActiveStudentId(st.id);
                              setViewMode('student');
                              setSelectedClassDetail(null);
                            }}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold cursor-pointer"
                          >
                            Ver App
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Criar Nova Turma de Inglês
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome da Turma *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Advanced Fluency & Debate (C1)"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nível CEFR</label>
                  <select
                    value={newClass.level}
                    onChange={(e) => setNewClass({ ...newClass, level: e.target.value as CEFRLevel })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="A1">A1 - Starter</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced Fluency</option>
                    <option value="C2">C2 - Mastery</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Modalidade</label>
                  <select
                    value={newClass.modality}
                    onChange={(e) => setNewClass({ ...newClass, modality: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Presencial">Presencial no Centro</option>
                    <option value="Online Ao Vivo">Online Ao Vivo</option>
                    <option value="Híbrido">Híbrido (Sala + Conexão)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Professor(a) Responsável</label>
                  <select
                    value={newClass.teacherId}
                    onChange={(e) => setNewClass({ ...newClass, teacherId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.accent})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Capacidade de Alunos</label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dias e Horário</label>
                <input
                  type="text"
                  placeholder="Ex: Terças e Quintas • 19:00 - 20:30"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sala / Espaço Físico</label>
                <input
                  type="text"
                  placeholder="Ex: Sala 03 - Cambridge Room"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition cursor-pointer"
                >
                  Cadastrar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
