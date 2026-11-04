import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  DollarSign,
  Calendar,
  Sparkles,
  Award,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  UserPlus,
  ClipboardList,
  Building2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { UserPhoto } from '../common/UserPhoto';
import { BankingDetailsCard } from '../common/BankingDetailsCard';
import { INSTITUTIONAL_PROFILE } from '../../data/institutionalData';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    classes,
    teachers,
    invoices,
    setAdminSection,
    units,
    setActiveStudentId,
    setViewMode,
  } = useApp();

  // Metrics calculations
  const activeStudents = students.filter((s) => s.status === 'active');
  const totalTuitionExpected = activeStudents.reduce((acc, curr) => acc + curr.tuitionValue, 0);
  const paidInvoicesTotal = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const overdueInvoicesCount = invoices.filter((inv) => inv.status === 'overdue').length;

  const avgAttendance = activeStudents.length
    ? Math.round(
        activeStudents.reduce((acc, curr) => acc + curr.attendancePercent, 0) /
          activeStudents.length
      )
    : 0;

  const totalAppXp = activeStudents.reduce((acc, curr) => acc + curr.appProgress.xp, 0);
  const avgSpeakingAccuracy = activeStudents.length
    ? Math.round(
        activeStudents.reduce((acc, curr) => acc + (curr.appProgress.speakingAccuracyAvg || 80), 0) /
          activeStudents.length
      )
    : 0;

  // Students requiring pedagogical or administrative attention
  const atRiskStudents = students.filter(
    (s) =>
      s.attendancePercent < 80 ||
      s.tuitionStatus === 'overdue' ||
      s.appProgress.lastActiveDate.includes('dias')
  );

  // CEFR Distribution
  const cefrCounts = {
    A1: students.filter((s) => s.level === 'A1').length,
    A2: students.filter((s) => s.level === 'A2').length,
    B1: students.filter((s) => s.level === 'B1').length,
    B2: students.filter((s) => s.level === 'B2').length,
    C1: students.filter((s) => s.level === 'C1').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/20">
              Painel Geral de Gestão
            </span>
            <span className="text-xs text-emerald-200">
              Ano Letivo 2025 • Beira, Moçambique
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Centro de Formação Profissional ASDE
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl">
            {INSTITUTIONAL_PROFILE.slogan} Gestão acadêmica, corpo docente, controle de propinas e acompanhamento de fluência em inglês e cursos profissionais.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="quick-add-student-btn"
            onClick={() => setAdminSection('students')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            Nova Matrícula
          </button>
          <button
            id="quick-attendance-btn"
            onClick={() => setAdminSection('attendance')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm border border-emerald-500/40 transition-all cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            Diário de Classe
          </button>
        </div>
      </div>

      {/* Strategic Mozambican Institutional & Millennium BIM Account Details on Dashboard */}
      <BankingDetailsCard
        title="Dados Bancários Millennium BIM Oficiais para Pagamento de Propinas & Inscrições"
        showSupportContacts={true}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alunos Ativos
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeStudents.length}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12% no mês
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Distribuídos em {classes.length} turmas em andamento
          </p>
        </div>

        {/* Card 2: Financial Billing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faturamento Mensal
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {totalTuitionExpected.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            Recebido: <span className="font-semibold text-emerald-700">{paidInvoicesTotal.toLocaleString('pt-PT')} MT</span>
            {overdueInvoicesCount > 0 && (
              <span className="text-amber-600 ml-1">({overdueInvoicesCount} pendentes)</span>
            )}
          </p>
        </div>

        {/* Card 3: School Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Frequência Média
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{avgAttendance}%</span>
            <span className="text-xs text-emerald-600 font-semibold">Meta &gt; 85%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${avgAttendance}%` }}
            />
          </div>
        </div>

        {/* Card 4: Integrated App Engagement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Engajamento no App
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {totalAppXp.toLocaleString('pt-PT')} XP
            </span>
            <span className="text-xs font-semibold text-indigo-600">Total</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Precisão de fala no app: <strong className="text-indigo-700">{avgSpeakingAccuracy}%</strong>
          </p>
        </div>
      </div>

      {/* Middle Grid: Active Classes & At-Risk Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Overview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Turmas em Andamento</h2>
              <p className="text-xs text-slate-500">
                Horários de aula, salas e avanço curricular programático
              </p>
            </div>
            <button
              onClick={() => setAdminSection('classes')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              Ver todas <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                      {cls.level}
                    </span>
                    <span className="font-bold text-sm text-slate-800">{cls.name}</span>
                    <span className="text-xs font-mono text-slate-400">({cls.code})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {cls.schedule}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {cls.room} ({cls.modality})
                    </span>
                    <span className="text-indigo-700 font-medium">Prof. {cls.teacherName}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="flex items-center sm:justify-end gap-2 text-xs">
                    <span className="text-slate-500">Alunos:</span>
                    <span className="font-bold text-slate-800">
                      {cls.currentEnrollments}/{cls.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${cls.syllabusProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">
                      {cls.syllabusProgress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Radar / Students in Focus (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">Radar Pedagógico</h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {atRiskStudents.length} em atenção
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Alunos com frequência baixa (&lt;80%), mensalidade em aberto ou ausência de prática no app.
            </p>

            <div className="space-y-2.5">
              {atRiskStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <UserPhoto
                      src={st.avatar}
                      name={st.name}
                      size="sm"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-800">{st.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Freq: <strong className={st.attendancePercent < 80 ? 'text-rose-600' : 'text-slate-700'}>{st.attendancePercent}%</strong></span>
                        <span>•</span>
                        <span className={st.tuitionStatus === 'overdue' ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                          {st.tuitionStatus === 'overdue' ? 'Mensalidade Atrasada' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveStudentId(st.id);
                      setViewMode('student');
                    }}
                    title="Simular e visualizar app deste aluno"
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition cursor-pointer"
                  >
                    Ver App
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setAdminSection('students')}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 bg-slate-50 hover:bg-slate-100 transition cursor-pointer text-center block"
            >
              Abrir Gestão de Todos os Alunos &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: CEFR Distribution & App Content Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CEFR Level Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Distribuição de Nível CEFR dos Alunos
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Quadro Comum Europeu de Referência para Línguas
          </p>

          <div className="space-y-2.5">
            {Object.entries(cefrCounts).map(([lvl, count]) => {
              const pct = activeStudents.length ? Math.round((count / activeStudents.length) * 100) : 0;
              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Nível {lvl}</span>
                    <span className="text-slate-500">
                      {count} alunos ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content App Manager Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">
                Conteúdo Disponível no Aplicativo
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                Sincronizado
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Unidades e lições interativas que os alunos praticam em seus smartphones ou computadores.
            </p>

            <div className="space-y-2">
              {units.map((u) => (
                <div
                  key={u.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                      {u.number}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800">{u.title}</span>
                      <span className="text-[10px] text-slate-400 block">Nível {u.level}</span>
                    </div>
                  </div>
                  <span className="font-medium text-slate-500">{u.lessons.length} lições</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setAdminSection('app_manager')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gerenciar Conteúdo & Lições do App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
