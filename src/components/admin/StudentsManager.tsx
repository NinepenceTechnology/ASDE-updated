import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, CEFRLevel } from '../../types';
import {
  Search,
  UserPlus,
  Filter,
  Eye,
  Award,
  BookOpen,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Smartphone,
  Trash2,
  X,
  Flame,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  GraduationCap,
} from 'lucide-react';
import { CertificateModal } from '../common/CertificateModal';
import { LevelStudentsListEvaluator } from './LevelStudentsListEvaluator';
import { UserPhoto } from '../common/UserPhoto';
import { CameraPhotoCapture } from '../common/CameraPhotoCapture';

export const StudentsManager: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    setActiveStudentId,
    setViewMode,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewSubTab, setViewSubTab] = useState<'table' | 'evaluator'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);
  const [certType, setCertType] = useState<'certificate' | 'declaration'>('certificate');

  // Form state for new student
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    biNumber: '',
    province: 'Sofala (Beira)',
    level: 'A1' as CEFRLevel,
    targetGoal: '',
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    status: 'active' as 'active' | 'inactive' | 'trial',
    tuitionStatus: 'paid' as 'paid' | 'pending',
    tuitionValue: 3500,
    attendancePercent: 100,
    avatar: '',
    notes: '',
  });

  const handleClassChange = (cId: string) => {
    const cls = classes.find((c) => c.id === cId);
    setFormData((prev) => ({
      ...prev,
      classId: cId,
      className: cls ? cls.name : '',
    }));
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addStudent({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      biNumber: formData.biNumber,
      province: formData.province,
      level: formData.level,
      targetGoal: formData.targetGoal || 'Fluência em Língua Inglesa',
      classId: formData.classId,
      className: formData.className,
      status: formData.status,
      tuitionStatus: formData.tuitionStatus,
      tuitionValue: Number(formData.tuitionValue) || 3500,
      attendancePercent: formData.attendancePercent,
      avatar: formData.avatar,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    // Reset
    setFormData({
      name: '',
      email: '',
      phone: '',
      biNumber: '',
      province: 'Sofala (Beira)',
      level: 'A1',
      targetGoal: '',
      classId: classes[0]?.id || '',
      className: classes[0]?.name || '',
      status: 'active',
      tuitionStatus: 'paid',
      tuitionValue: 3500,
      attendancePercent: 100,
      avatar: '',
      notes: '',
    });
  };

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === 'all' || s.level === levelFilter;
    const matchesClass = classFilter === 'all' || s.classId === classFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesLevel && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestão de Alunos & Matrículas CFP - ASDE
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Acompanhe o desempenho pedagógico, notas por estilos, frequência e sincronização com o aplicativo de cada aluno.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewSubTab(viewSubTab === 'table' ? 'evaluator' : 'table')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shadow-xs ${
              viewSubTab === 'evaluator'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>
              {viewSubTab === 'evaluator'
                ? 'Ver Tabela Geral de Alunos'
                : 'Lista por Nível & Avaliação (Excel)'}
            </span>
          </button>

          <button
            id="open-add-student-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nova Inscrição / Matrícula</span>
          </button>
        </div>
      </div>

      {/* Mode Subtabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setViewSubTab('table')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            viewSubTab === 'table'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Todos os Formandos ({students.length})</span>
        </button>
        <button
          onClick={() => setViewSubTab('evaluator')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            viewSubTab === 'evaluator'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lista por Nível & Avaliação 5 Estilos</span>
        </button>
      </div>

      {viewSubTab === 'evaluator' ? (
        <LevelStudentsListEvaluator />
      ) : (
        <>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Nível:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Todos os Níveis</option>
              <option value="A1">A1 - Starter</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Int.</option>
              <option value="C1">C1 - Advanced</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Turma:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">Todas as Turmas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="trial">Experimental</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Aluno / Matrícula</th>
                <th className="py-3 px-3">Nível CEFR</th>
                <th className="py-3 px-3">Turma Alocada</th>
                <th className="py-3 px-3">Frequência</th>
                <th className="py-3 px-3">App Sync</th>
                <th className="py-3 px-3">Mensalidade</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhum aluno encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <UserPhoto
                          src={st.avatar}
                          name={st.name}
                          size="md"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{st.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {st.enrollmentCode} • {st.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {st.level}
                      </span>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-3 max-w-[200px]">
                      <span className="font-medium text-slate-800 block truncate" title={st.className}>
                        {st.className || 'Sem Turma'}
                      </span>
                      <span className="text-[10px] text-slate-400">{st.targetGoal}</span>
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.attendancePercent >= 85
                                ? 'bg-emerald-500'
                                : st.attendancePercent >= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${st.attendancePercent}%` }}
                          />
                        </div>
                        <span
                          className={`font-bold ${
                            st.attendancePercent >= 85
                              ? 'text-emerald-700'
                              : st.attendancePercent >= 75
                              ? 'text-amber-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {st.attendancePercent}%
                        </span>
                      </div>
                    </td>

                    {/* App Sync: XP & Streak */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 font-bold text-amber-600">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {st.appProgress.streakDays}d
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-indigo-700">
                          {st.appProgress.xp} XP
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Fala: {st.appProgress.speakingAccuracyAvg}% acurácia
                      </span>
                    </td>

                    {/* Tuition Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          st.tuitionStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : st.tuitionStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {st.tuitionStatus === 'paid'
                          ? 'Pago'
                          : st.tuitionStatus === 'pending'
                          ? 'Pendente'
                          : 'Atrasado'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {st.tuitionValue} MT/mês
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          title="Ver Ficha Acadêmica Completa"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveStudentId(st.id);
                            setViewMode('student');
                          }}
                          title="Simular e Abrir App de Inglês deste aluno"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCertificateStudent(st);
                            setCertType('certificate');
                          }}
                          title="Emitir Certificado Oficial CEFR"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja realmente remover a matrícula de ${st.name}?`)) {
                              deleteStudent(st.id);
                            }
                          }}
                          title="Remover Matrícula"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* STUDENT DETAIL MODAL / DRAWER */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-4">
                <UserPhoto
                  src={selectedStudent.avatar}
                  name={selectedStudent.name}
                  size="xl"
                  borderClassName="border-2 border-white/60 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-indigo-400/30 text-indigo-200 border border-indigo-300/30">
                      {selectedStudent.level}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 font-mono">
                    Matrícula: {selectedStudent.enrollmentCode} • Desde {selectedStudent.enrolledAt}
                  </p>
                  <p className="text-xs text-indigo-100/90 mt-1">
                    Meta: {selectedStudent.targetGoal}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Tabs & Info */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* App Real-time Sync Status */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Sincronização com o App ASDE
                  </span>
                  <button
                    onClick={() => {
                      setActiveStudentId(selectedStudent.id);
                      setViewMode('student');
                      setSelectedStudent(null);
                    }}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    Abrir Experiência no App &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
                    <span className="text-[10px] text-slate-400 font-bold block">EXPERIÊNCIA</span>
                    <span className="text-base font-extrabold text-indigo-700">
                      {selectedStudent.appProgress.xp} XP
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
                    <span className="text-[10px] text-slate-400 font-bold block">OFENSIVA</span>
                    <span className="text-base font-extrabold text-amber-600">
                      {selectedStudent.appProgress.streakDays} Dias
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
                    <span className="text-[10px] text-slate-400 font-bold block">VOCABULÁRIO</span>
                    <span className="text-base font-extrabold text-slate-800">
                      {selectedStudent.appProgress.vocabularyMastered}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
                    <span className="text-[10px] text-slate-400 font-bold block">FALA / PRONÚNCIA</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {selectedStudent.appProgress.speakingAccuracyAvg}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Performance & CEFR Grades */}
              <div>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Boletim Acadêmico & Parecer Pedagógico
                </h3>

                {selectedStudent.grades.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl">
                    Nenhuma avaliação formal lançada ainda para este estudante.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedStudent.grades.map((grd) => (
                      <div
                        key={grd.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{grd.term}</span>
                          <span className="text-slate-400">{grd.date}</span>
                        </div>

                        {/* Scores */}
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-semibold">Speaking</span>
                            <span className="font-bold text-slate-800">{grd.speaking}/100</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-semibold">Listening</span>
                            <span className="font-bold text-slate-800">{grd.listening}/100</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-semibold">Reading</span>
                            <span className="font-bold text-slate-800">{grd.reading}/100</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-semibold">Writing</span>
                            <span className="font-bold text-slate-800">{grd.writing}/100</span>
                          </div>
                          <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                            <span className="text-[10px] text-indigo-700 block font-bold">MÉDIA GERAL</span>
                            <span className="font-black text-indigo-900">{grd.overall}/100</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                          "{grd.teacherFeedback}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Class & Contacts */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Turma e Local</span>
                  <p className="font-bold text-slate-800">{selectedStudent.className}</p>
                  <p className="text-slate-500">Frequência Escolar: {selectedStudent.attendancePercent}%</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contato Direto</span>
                  <p className="text-slate-800 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedStudent.email}
                  </p>
                  <p className="text-slate-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedStudent.phone}
                  </p>
                </div>
              </div>

              {/* Action buttons inside drawer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCertificateStudent(selectedStudent);
                      setCertType('certificate');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Certificado CEFR
                  </button>
                  <button
                    onClick={() => {
                      setCertificateStudent(selectedStudent);
                      setCertType('declaration');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Declaração
                  </button>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW STUDENT ENROLLMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Nova Matrícula de Aluno
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Monteiro Ramos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="gabriela@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Telefone / WhatsApp (Moçambique)</label>
                  <input
                    type="text"
                    placeholder="(+258) 84 634 8589"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">B.I. / Documento de Identidade</label>
                  <input
                    type="text"
                    placeholder="Ex: 070100345678B"
                    value={formData.biNumber}
                    onChange={(e) => setFormData({ ...formData, biNumber: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Província / Cidade</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Sofala (Beira)">Sofala (Beira - Sede)</option>
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Maputo Província">Maputo Província</option>
                    <option value="Tete">Tete</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Cabo Delgado (Pemba)">Cabo Delgado (Pemba)</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Manica (Chimoio)">Manica (Chimoio)</option>
                    <option value="Zambézia (Quelimane)">Zambézia (Quelimane)</option>
                    <option value="Gaza (Xai-Xai)">Gaza (Xai-Xai)</option>
                    <option value="Niassa (Lichinga)">Niassa (Lichinga)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nível CEFR</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="A1">A1 - Starter (Iniciante)</option>
                    <option value="A2">A2 - Elementary (Básico)</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced Fluency</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Turma</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Propina Mensal em Meticais (MT)</label>
                  <input
                    type="number"
                    value={formData.tuitionValue}
                    onChange={(e) => setFormData({ ...formData, tuitionValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Meta do Formando</label>
                  <input
                    type="text"
                    placeholder="Ex: IELTS 7.5, Promoção Corporativa"
                    value={formData.targetGoal}
                    onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* USER REQUEST: Photo Capture with Camera at registration */}
              <CameraPhotoCapture
                currentPhoto={formData.avatar}
                onPhotoCaptured={(photo) => setFormData((prev) => ({ ...prev, avatar: photo }))}
                label="Foto Obrigatória para o Processo de Inscrição (Câmera)"
              />

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observações Pedagógicas</label>
                <textarea
                  rows={2}
                  placeholder="Informações adicionais, disponibilidade ou histórico..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition cursor-pointer"
                >
                  Concluir Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate & Declaration Modal */}
      {certificateStudent && (
        <CertificateModal
          student={certificateStudent}
          isOpen={!!certificateStudent}
          onClose={() => setCertificateStudent(null)}
          type={certType}
        />
      )}
    </div>
  );
};
