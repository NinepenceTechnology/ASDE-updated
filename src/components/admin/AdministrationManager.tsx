import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffUser } from '../../types';
import {
  ShieldCheck,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
  DollarSign,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdministrationManager: React.FC = () => {
  const { staffUsers, updateStaffPermissions, students, classes, invoices, teachers, courses } = useApp();

  const [activeTab, setActiveTab] = useState<'team' | 'reports' | 'dashboard'>('team');
  const [selectedReport, setSelectedReport] = useState<'attendance' | 'grades' | 'finance' | 'teachers'>('attendance');
  const [selectedUser, setSelectedUser] = useState<StaffUser>(staffUsers[0]);

  // Derived metrics for Dashboard
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const lowAttendanceStudents = students.filter((s) => s.attendancePercent < 80);
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const totalOverdueAmount = overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const averageAttendance = Math.round(
    students.reduce((acc, curr) => acc + curr.attendancePercent, 0) / (totalStudents || 1)
  );

  const handleTogglePermission = (
    userId: string,
    key: keyof StaffUser['permissions']
  ) => {
    const targetUser = staffUsers.find((u) => u.id === userId);
    if (!targetUser) return;

    const updated = {
      ...targetUser.permissions,
      [key]: !targetUser.permissions[key],
    };
    updateStaffPermissions(userId, updated);
    if (selectedUser.id === userId) {
      setSelectedUser({ ...targetUser, permissions: updated });
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Controle Administrativo & Auditoria
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Administração, Equipe & Relatórios Automáticos
          </h1>
          <p className="text-slate-500 text-xs mt-1 max-w-2xl">
            Gestão de permissões de acesso por perfil (Diretoria, Coordenação, Docentes, Secretaria, Financeiro) e emissão instantânea de relatórios executivos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('reports');
              setTimeout(printReport, 200);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Relatório Oficial
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'team'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Permissões de Usuários ({staffUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Relatórios Automáticos em 1 Clique
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Painel de Auditoria & Indicadores
        </button>
      </div>

      {/* TAB 1: PERMISSIONS MATRIX */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Colaboradores Cadastrados
            </h3>
            {staffUsers.map((user) => {
              const isSelected = selectedUser.id === user.id;
              const roleLabels: Record<StaffUser['role'], string> = {
                director: 'Diretor Geral',
                coordinator: 'Coordenadora Pedagógica',
                teacher: 'Docente de Língua Inglesa',
                secretary: 'Secretária Acadêmica',
                finance: 'Gestor Financeiro',
              };

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {user.name}
                        </h4>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 shrink-0">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{roleLabels[user.role]}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Último acesso: {user.lastLogin}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permissions Matrix Configurator */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-xl object-cover border border-indigo-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedUser.name}</h3>
                  <span className="text-xs text-indigo-600 font-semibold">{selectedUser.email}</span>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 self-start">
                <CheckCircle className="w-3.5 h-3.5" />
                Acesso Ativo no Sistema
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Matriz de Privilégios & Permissões Granulares
              </h4>

              <div className="space-y-3">
                {[
                  {
                    key: 'canManageStudents' as const,
                    title: 'Gestão de Alunos & Matrículas',
                    description: 'Cadastrar novos alunos, emitir históricos escolares, transferências e atestados.',
                  },
                  {
                    key: 'canManageCourses' as const,
                    title: 'Gestão de Cursos & Grade Horária',
                    description: 'Criar disciplinas, alterar carga horária e alocar professores em salas.',
                  },
                  {
                    key: 'canManageGrades' as const,
                    title: 'Lançamento de Notas & Avaliações CEFR',
                    description: 'Atribuir notas por competência (Speaking, Listening, Reading, Writing) e registrar presenças.',
                  },
                  {
                    key: 'canManageFinance' as const,
                    title: 'Gestão Financeira & Baixa de Mensalidades',
                    description: 'Acessar balanço contábil, dar baixa em pagamentos e emitir recibos fiscais.',
                  },
                  {
                    key: 'canManageTeam' as const,
                    title: 'Administração de Usuários & Equipe',
                    description: 'Modificar permissões de outros funcionários e criar novos logins corporativos.',
                  },
                  {
                    key: 'canExportReports' as const,
                    title: 'Geração e Exportação de Relatórios Oficiais',
                    description: 'Extrair relatórios de evasão, rendimento acadêmico e inadimplência.',
                  },
                  {
                    key: 'canBroadcastNotices' as const,
                    title: 'Comunicação Oficial & Disparo de Notificações',
                    description: 'Publicar no mural da escola e disparar mensagens automáticas via WhatsApp/E-mail.',
                  },
                ].map((perm) => {
                  const isChecked = selectedUser.permissions[perm.key];
                  return (
                    <div
                      key={perm.key}
                      onClick={() => handleTogglePermission(selectedUser.id, perm.key)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isChecked
                          ? 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70'
                          : 'border-slate-200 bg-slate-50/40 hover:bg-white'
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{perm.title}</h5>
                        <p className="text-xs text-slate-500">{perm.description}</p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                          isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATIC 1-CLICK REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Report Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'attendance' as const, label: '1. Frequência & Risco de Evasão', icon: AlertTriangle },
              { id: 'grades' as const, label: '2. Rendimento Acadêmico & CEFR', icon: Award },
              { id: 'finance' as const, label: '3. Inadimplência & Cobrança', icon: DollarSign },
              { id: 'teachers' as const, label: '4. Distribuição Docente & Carga Horária', icon: Users },
            ].map((rep) => {
              const Icon = rep.icon;
              const isSelected = selectedReport === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReport(rep.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{rep.label}</span>
                </button>
              );
            })}
          </div>

          {/* Printable Report Card Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
            {/* Report Header Timbre */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white font-black flex items-center justify-center text-lg shadow-sm">
                  ASDE
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Centro de formação Professional ASDE
                  </h2>
                  <p className="text-xs text-slate-500">
                    Sistema Integrado de Gestão Acadêmica & Pedagógica de Língua Inglesa
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <p>
                  <strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-PT')}
                </p>
                <p>
                  <strong>Autenticação:</strong> ASDE-DOC-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>

            {/* REPORT CONTENT 1: ATTENDANCE & EVASION */}
            {selectedReport === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Relatório Geral de Frequência Escolar & Alerta Preventivo de Evasão
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">
                    Critério Mínimo: 75% Presença
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Total de Alunos</span>
                    <strong className="text-base text-slate-900">{totalStudents}</strong>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-emerald-700 block">Frequência Média Geral</span>
                    <strong className="text-base text-emerald-800">{averageAttendance}%</strong>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                    <span className="text-rose-700 block">Alunos em Alerta (&lt;80%)</span>
                    <strong className="text-base text-rose-800">{lowAttendanceStudents.length}</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Aluno</th>
                        <th className="p-3">Turma</th>
                        <th className="p-3">Frequência</th>
                        <th className="p-3">Status de Presença</th>
                        <th className="p-3">Ação Pedagógica Sugerida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {students.map((stu) => {
                        const isRisk = stu.attendancePercent < 80;
                        return (
                          <tr key={stu.id} className={isRisk ? 'bg-rose-50/30' : 'bg-white'}>
                            <td className="p-3 font-semibold text-slate-900">{stu.name}</td>
                            <td className="p-3 text-slate-600">{stu.className}</td>
                            <td className="p-3 font-bold">
                              <span className={isRisk ? 'text-rose-600' : 'text-emerald-700'}>
                                {stu.attendancePercent}%
                              </span>
                            </td>
                            <td className="p-3">
                              {isRisk ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                                  Risco de Reprovação
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                  Regular
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-500">
                              {isRisk ? 'Contatar via WhatsApp e agendar tutoria' : 'Manter acompanhamento de rotina'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORT CONTENT 2: GRADES & CEFR PERFORMANCE */}
            {selectedReport === 'grades' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Relatório de Rendimento Acadêmico & Proficiência por Banda CEFR
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Estudante</th>
                        <th className="p-3">Nível CEFR</th>
                        <th className="p-3">Speaking (Oral)</th>
                        <th className="p-3">Listening</th>
                        <th className="p-3">Writing</th>
                        <th className="p-3">Média Global</th>
                        <th className="p-3">Parecer Pedagógico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {students.map((stu) => {
                        const latestGrade = stu.grades[0] || {
                          speaking: 85,
                          listening: 82,
                          writing: 80,
                          reading: 84,
                          overall: 83,
                          feedback: 'Excelente engajamento e fluência contínua.',
                        };
                        return (
                          <tr key={stu.id} className="bg-white">
                            <td className="p-3 font-semibold text-slate-900">{stu.name}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                {stu.level}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-indigo-700">{latestGrade.speaking}/100</td>
                            <td className="p-3 font-bold text-indigo-700">{latestGrade.listening}/100</td>
                            <td className="p-3 font-bold text-indigo-700">{latestGrade.writing}/100</td>
                            <td className="p-3 font-black text-emerald-700">{latestGrade.overall}/100</td>
                            <td className="p-3 text-slate-500 max-w-xs truncate">{latestGrade.feedback}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORT CONTENT 3: FINANCE & INVOICES */}
            {selectedReport === 'finance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Relatório Financeiro de Mensalidades & Inadimplência
                  </h3>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
                    Total em Atraso: {totalOverdueAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Código Fatura</th>
                        <th className="p-3">Aluno</th>
                        <th className="p-3">Vencimento</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Situação</th>
                        <th className="p-3">Canal de Contato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className={inv.status === 'overdue' ? 'bg-rose-50/40' : 'bg-white'}>
                          <td className="p-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                          <td className="p-3 font-semibold text-slate-900">{inv.studentName}</td>
                          <td className="p-3 text-slate-600">{inv.dueDate}</td>
                          <td className="p-3 font-bold text-slate-900">{inv.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'overdue'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {inv.status === 'paid' ? 'Pago' : inv.status === 'overdue' ? 'Vencido' : 'Pendente'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">WhatsApp Oficial ASDE</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORT CONTENT 4: TEACHERS WORKLOAD */}
            {selectedReport === 'teachers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Relatório de Carga Horária Docente & Alocação Semanal
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Professor</th>
                        <th className="p-3">Titulação / Certificação</th>
                        <th className="p-3">Sotaque Referência</th>
                        <th className="p-3">Turmas Ativas</th>
                        <th className="p-3">Avaliação dos Alunos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {teachers.map((tch) => (
                        <tr key={tch.id} className="bg-white">
                          <td className="p-3 font-semibold text-slate-900">{tch.name}</td>
                          <td className="p-3 text-slate-600">{tch.certifications.join(', ')}</td>
                          <td className="p-3 font-medium text-indigo-700">{tch.accent}</td>
                          <td className="p-3 font-bold text-slate-900">{tch.activeClassesCount} turmas</td>
                          <td className="p-3 font-bold text-amber-600">★ {tch.rating} / 5.0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Timbre Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>Centro de formação Professional ASDE • CNPJ 42.180.912/0001-94</span>
              <span>Coordenação Geral & Secretaria Acadêmica</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Cursos Homologados</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{courses.length}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">100% alinhados ao CEFR</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Turmas em Andamento</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{classes.length}</p>
              <span className="text-[11px] text-slate-500 font-medium">Salas Oxford, London e Cambridge</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Corpo Docente</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
              <span className="text-[11px] text-indigo-600 font-semibold">Professores nativos & bilíngues</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Saúde Operacional</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600">98.4%</p>
              <span className="text-[11px] text-slate-500 font-medium">Sincronização LMS Ativa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
