import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateModal } from '../common/CertificateModal';
import { CEFR_IELTS_MAP } from '../../types';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Award,
  CheckCircle2,
  FileText,
  AlertCircle,
  CreditCard,
  QrCode,
  BookOpen,
  User,
  Download,
  Flame,
  CheckSquare,
  Square,
  Target,
  Trophy,
  Building,
} from 'lucide-react';
import { BankingDetailsCard } from '../common/BankingDetailsCard';

export const SchoolHub: React.FC = () => {
  const { activeStudent, classes, teachers, sessions, invoices, markInvoicePaid } = useApp();

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certType, setCertType] = useState<'certificate' | 'declaration'>('certificate');
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Transferência BIM' | 'M-Pesa' | 'e-Mola' | 'Depósito Bancário'>('Transferência BIM');
  const [paymentRefCode, setPaymentRefCode] = useState('');

  // Completed homework tasks local state
  const [completedHw, setCompletedHw] = useState<Record<string, boolean>>({});

  const studentClass = classes.find((c) => c.id === activeStudent.classId);
  const studentTeacher = teachers.find((t) => t.id === studentClass?.teacherId);

  // Homeworks from class journal sessions
  const classSessions = sessions.filter((s) => s.classId === activeStudent.classId);
  const homeworkItems = classSessions.filter((s) => s.homeworkAssigned);

  // Student's invoices
  const studentInvoices = invoices.filter((i) => i.studentId === activeStudent.id);

  const toggleHw = (sessId: string) => {
    setCompletedHw((prev) => ({ ...prev, [sessId]: !prev[sessId] }));
  };

  const levelInfo = CEFR_IELTS_MAP[activeStudent.level] || CEFR_IELTS_MAP['B1'];

  return (
    <div className="space-y-6">
      {/* Header with Green Theme */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/20">
              Ambiente Acadêmico Conectado
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              Centro de Formação Profissional ASDE
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Portal Acadêmico & Boletim</h1>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Acesse suas informações acadêmicas, boletim com notas CEFR/IELTS, espaço de horas de exposição no app e emissão de certificados oficiais.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setCertType('certificate');
              setCertModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            Certificado CEFR
          </button>
          <button
            onClick={() => {
              setCertType('declaration');
              setCertModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Declaração de Matrícula
          </button>
        </div>
      </div>

      {/* Grid: Next Class, App Dedication, Financial status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Next Scheduled Class */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Sua Próxima Aula Presencial</h2>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900 text-sm">
                {studentClass?.name || 'Turma Regular'}
              </span>
              <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                {studentClass?.level}
              </span>
            </div>

            <div className="space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentClass?.schedule || 'Segunda e Quarta, 19:00 - 20:30'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentClass?.room || 'Sala 102 - Speaking Hub'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Professor(a): <strong>{studentTeacher?.name || 'Teacher Sarah'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Student Metric Card: Horas de Exposição & Notas no App */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Engajamento no Aplicativo</h2>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Tempo Real
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                Horas no App
              </span>
              <span className="text-xl font-black text-emerald-800">
                {(activeStudent.appProgress.hoursStudied || 0).toFixed(1)}h
              </span>
              <span className="text-[9px] text-emerald-700 block font-medium">Exposição ao idioma</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">
                Média Exercícios
              </span>
              <span className="text-xl font-black text-amber-700">
                {(activeStudent.appProgress.exercisesAverageScore || 0).toFixed(1)}%
              </span>
              <span className="text-[9px] text-amber-700 block font-medium">Precisão prática</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Equivalência IELTS:</span>
            <span className="font-extrabold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded-md text-[11px]">
              {levelInfo.ieltsBand}
            </span>
          </div>
        </div>

        {/* Attendance & Finance Status */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Frequência & Mensalidades</h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Presença</span>
              <span className="text-xl font-black text-emerald-700">
                {activeStudent.attendancePercent}%
              </span>
              <span className="text-[9px] text-emerald-600 font-bold block">Meta &ge; 75%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Matrícula</span>
              <span className="text-xs font-black text-slate-800 block truncate pt-1">
                {activeStudent.enrollmentCode}
              </span>
              <span className="text-[9px] text-slate-500 block font-medium">Status: Ativo</span>
            </div>
          </div>

          {studentInvoices.length > 0 && (
            <div className="pt-1">
              {studentInvoices.some((inv) => inv.status === 'pending' || inv.status === 'overdue') ? (
                <button
                  onClick={() => setPaymentModalInvoice(studentInvoices.find((i) => i.status === 'pending' || i.status === 'overdue'))}
                  className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                  <span>Liquidar Propina (Millennium BIM / M-Pesa)</span>
                </button>
              ) : (
                <div className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                  Todas as propinas em dia
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Official School Report Card (Boletim de Competências CEFR & App Metrics) */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Boletim Oficial de Competências Linguísticas (CEFR & IELTS)
            </h2>
            <p className="text-xs text-slate-500">
              Avaliações oficiais emitidas pelo corpo docente do Centro de Formação Profissional ASDE com espaço de desempenho no app.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Nível Certificado: {activeStudent.level}
            </span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {levelInfo.ieltsBand}
            </span>
          </div>
        </div>

        {activeStudent.grades.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Nenhum boletim oficial lançado até o momento.
          </p>
        ) : (
          <div className="space-y-4">
            {activeStudent.grades.map((grd) => (
              <div
                key={grd.id}
                className="p-5 rounded-2xl border border-emerald-100 bg-slate-50/70 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{grd.term}</h3>
                    <span className="text-xs text-slate-500">Data de Emissão: {grd.date}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Nota Geral Ponderada
                    </span>
                    <span className="text-2xl font-black text-emerald-700">
                      {grd.overall} / 100
                    </span>
                  </div>
                </div>

                {/* DEDICATED SPACE: Horas de Exposição e Notas de Avaliação de Exercícios no App */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      Espaço de Horas de Exposição & Avaliação de Exercícios no App
                    </span>
                    <span className="font-bold text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      {grd.ieltsEquivalentBand || levelInfo.ieltsBand}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Horas de Exposição no App
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        {(grd.appExposureHours ?? activeStudent.appProgress.hoursStudied ?? 0).toFixed(1)}h
                      </span>
                      <span className="text-[10px] text-emerald-700 block font-medium">Tempo de estudo no aplicativo</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Nota Média nos Exercícios
                      </span>
                      <span className="text-base font-black text-amber-700">
                        {(grd.appExercisesScore ?? activeStudent.appProgress.exercisesAverageScore ?? 0).toFixed(1)} / 100
                      </span>
                      <span className="text-[10px] text-amber-700 block font-medium">Aproveitamento nos quizzes</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Exercícios Concluídos
                      </span>
                      <span className="text-base font-black text-teal-800">
                        {grd.appCompletedExercisesCount ?? activeStudent.appProgress.exercisesCompletedCount ?? 0}
                      </span>
                      <span className="text-[10px] text-teal-700 block font-medium">Módulos finalizados no app</span>
                    </div>
                  </div>
                </div>

                {/* 5 CEFR Skills Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Speaking
                    </span>
                    <span className="text-base font-black text-emerald-700">{grd.speaking}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Listening
                    </span>
                    <span className="text-base font-black text-teal-700">{grd.listening}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Reading
                    </span>
                    <span className="text-base font-black text-emerald-700">{grd.reading}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Writing
                    </span>
                    <span className="text-base font-black text-purple-700">{grd.writing}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Grammar
                    </span>
                    <span className="text-base font-black text-amber-700">{grd.grammar}</span>
                  </div>
                </div>

                {/* Teacher Qualitative Feedback */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-emerald-950 block">
                    Parecer Pedagógico do Professor:
                  </span>
                  <p className="italic">"{grd.teacherFeedback}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Homework Tasks From Teacher Classroom Journal */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Tarefas de Casa (Homework) Lançadas pelo Professor
            </h2>
            <p className="text-xs text-slate-500">
              Atividades atribuídas em sala para consolidação autônoma no aplicativo.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {homeworkItems.length} tarefas atribuídas
          </span>
        </div>

        {homeworkItems.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Nenhuma tarefa pendente atribuída recentemente pelo seu professor.
          </p>
        ) : (
          <div className="space-y-2.5">
            {homeworkItems.map((sess) => {
              const isChecked = !!completedHw[sess.id];
              return (
                <div
                  key={sess.id}
                  onClick={() => toggleHw(sess.id)}
                  className={`p-3.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                      : 'bg-slate-50/70 border-slate-200 hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button type="button" className="text-emerald-600">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="space-y-0.5">
                      <span
                        className={`font-bold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}
                      >
                        {sess.homeworkAssigned}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Aula do dia {sess.date} • Tópico trabalhado: {sess.topic}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      isChecked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isChecked ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Strategic Banking Card on School Hub */}
      <BankingDetailsCard
        title="Dados Bancários Oficiais para Pagamento de Propinas (Millennium BIM)"
        showSupportContacts={true}
      />

      {/* Millennium BIM & Mobile Money Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-emerald-200 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-black text-slate-900 text-base text-center">
              Liquidação de Propina • CFP - ASDE
            </h3>
            <p className="text-xs text-slate-500 text-center">
              Efetue o pagamento através dos canais oficiais do Centro de Formação Profissional ASDE:
            </p>

            <BankingDetailsCard compact={true} />

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Fatura & Descrição:</span>
                <span className="text-xs font-bold text-slate-900">{paymentModalInvoice.description}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Valor a Pagar:</span>
                <span className="text-lg font-black text-emerald-800">
                  {paymentModalInvoice.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
                </span>
              </div>
            </div>

            {/* Method selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Canal de Pagamento Utilizado:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Transferência BIM', label: 'BIM Conta' },
                  { id: 'M-Pesa', label: 'M-Pesa' },
                  { id: 'e-Mola', label: 'e-Mola' },
                  { id: 'Depósito Bancário', label: 'Balcão BIM' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      paymentMethod === m.id
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Reference input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Referência / Código da Transação (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: BIM-83921 / MPESA-91820"
                value={paymentRefCode}
                onChange={(e) => setPaymentRefCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500 uppercase"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  markInvoicePaid(paymentModalInvoice.id, paymentMethod);
                  setPaymentModalInvoice(null);
                  setPaymentRefCode('');
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Liquidação em MT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate & Matricula Modal */}
      {certModalOpen && (
        <CertificateModal
          student={activeStudent}
          type={certType}
          onClose={() => setCertModalOpen(false)}
        />
      )}
    </div>
  );
};
