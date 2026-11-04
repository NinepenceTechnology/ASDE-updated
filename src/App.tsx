import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PortalGateway } from './components/auth/PortalGateway';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentsManager } from './components/admin/StudentsManager';
import { ClassesManager } from './components/admin/ClassesManager';
import { AttendanceTracker } from './components/admin/AttendanceTracker';
import { GradesEvaluator } from './components/admin/GradesEvaluator';
import { LevelStudentsListEvaluator } from './components/admin/LevelStudentsListEvaluator';
import { FinancialHub } from './components/admin/FinancialHub';
import { AppCurriculumManager } from './components/admin/AppCurriculumManager';
import { CoursesManager } from './components/admin/CoursesManager';
import { AdministrationManager } from './components/admin/AdministrationManager';
import { CommunicationCenter } from './components/admin/CommunicationCenter';

// Student App Views
import { LearningRoadmap } from './components/student/LearningRoadmap';
import { SpeechLab } from './components/student/SpeechLab';
import { RoleplaySimulator } from './components/student/RoleplaySimulator';
import { FlashcardsDeck } from './components/student/FlashcardsDeck';
import { SchoolHub } from './components/student/SchoolHub';
import { Leaderboard } from './components/student/Leaderboard';
import { PracticalExercises } from './components/student/PracticalExercises';
import { GamificationHub } from './components/student/GamificationHub';
import { AITutorChat } from './components/student/AITutorChat';
import { AppCompetitionSidebar } from './components/student/AppCompetitionSidebar';
import { StudentProfileBar } from './components/student/StudentProfileBar';

import {
  LayoutDashboard,
  Users,
  Layers,
  ClipboardCheck,
  Award,
  DollarSign,
  Sparkles,
  BookOpen,
  Mic,
  MessageSquare,
  Trophy,
  GraduationCap,
  Flame,
  ChevronRight,
  Smartphone,
  CheckCircle,
  ShieldCheck,
  Bot,
  CheckSquare,
  PanelRightClose,
  PanelRightOpen,
  FileSpreadsheet,
  Building2,
  Lock,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { adminSection, setAdminSection, students, invoices, classes, cfpAuth } = useApp();

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue').length;
  const lowAttendanceStudents = students.filter((s) => s.attendancePercent < 80).length;

  const allNavItems = [
    {
      id: 'dashboard' as const,
      label: 'Visão Geral & Métricas',
      icon: LayoutDashboard,
      badge: null,
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente', 'secretaria'],
    },
    {
      id: 'students' as const,
      label: 'Inscrições & Matrículas',
      icon: Users,
      badge: `${students.length}`,
      allowedRoles: ['admin_ceo', 'cfp_geral', 'secretaria'],
    },
    {
      id: 'level_evaluator' as const,
      label: 'Pauta por Nível & 5 Estilos',
      icon: FileSpreadsheet,
      badge: 'Excel & Estilos',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente', 'secretaria'],
    },
    {
      id: 'courses' as const,
      label: 'Cursos & Disciplinas',
      icon: BookOpen,
      badge: 'Matriz',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente'],
    },
    {
      id: 'classes' as const,
      label: 'Turmas & Horários',
      icon: Layers,
      badge: `${classes.length}`,
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente', 'secretaria'],
    },
    {
      id: 'attendance' as const,
      label: 'Diário & Chamada',
      icon: ClipboardCheck,
      badge: lowAttendanceStudents > 0 ? `${lowAttendanceStudents} alertas` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente'],
    },
    {
      id: 'grades' as const,
      label: 'Notas & Avaliação CEFR',
      icon: Award,
      badge: 'App & Provas',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente'],
    },
    {
      id: 'finance' as const,
      label: 'Secretaria & Pagamentos',
      icon: DollarSign,
      badge: overdueInvoices > 0 ? `${overdueInvoices} em atraso` : null,
      badgeColor: 'bg-rose-100 text-rose-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'secretaria'],
    },
    {
      id: 'administration' as const,
      label: 'Administração & Relatórios',
      icon: ShieldCheck,
      badge: 'Auditoria',
      badgeColor: 'bg-slate-100 text-slate-800',
      allowedRoles: ['admin_ceo', 'cfp_geral'],
    },
    {
      id: 'communication' as const,
      label: 'WhatsApp & Avisos',
      icon: Smartphone,
      badge: 'Disparos',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'secretaria'],
    },
    {
      id: 'app_manager' as const,
      label: 'Conteúdo do App (LMS)',
      icon: Sparkles,
      badge: 'App Sync',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      allowedRoles: ['admin_ceo', 'cfp_geral', 'docente'],
    },
  ];

  // Filter items based on CFP Role if role is defined
  const currentRole = cfpAuth?.role || 'admin_ceo';
  const navItems = allNavItems.filter((item) => item.allowedRoles.includes(currentRole));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role Banner */}
      {cfpAuth && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-3.5 rounded-2xl border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black tracking-wide flex items-center gap-2">
                <span>PORTAL CFP - ASDE</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 text-[10px] font-semibold">
                  Acesso Autorizado
                </span>
              </p>
              <p className="text-[11px] text-emerald-200/80">
                Sessão autorizada como: <strong>{cfpAuth.label}</strong> ({cfpAuth.description})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ambiente Seguro Autenticado</span>
          </div>
        </div>
      )}

      {/* Horizontal Subnav Tabs for Admin */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-emerald-100">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = adminSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminSection(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Admin Section */}
      <main>
        {adminSection === 'dashboard' && <AdminDashboard />}
        {adminSection === 'students' && <StudentsManager />}
        {adminSection === 'level_evaluator' && <LevelStudentsListEvaluator />}
        {adminSection === 'courses' && <CoursesManager />}
        {adminSection === 'classes' && <ClassesManager />}
        {adminSection === 'attendance' && <AttendanceTracker />}
        {adminSection === 'grades' && <GradesEvaluator />}
        {adminSection === 'finance' && <FinancialHub />}
        {adminSection === 'administration' && <AdministrationManager />}
        {adminSection === 'communication' && <CommunicationCenter />}
        {adminSection === 'app_manager' && <AppCurriculumManager />}
      </main>
    </div>
  );
};

const StudentLayout: React.FC = () => {
  const { studentTab, setStudentTab, mobilePreviewFrame, activeStudent } = useApp();
  const [showSideCompetition, setShowSideCompetition] = useState<boolean>(true);

  const studentNav = [
    { id: 'learn' as const, label: 'Aulas & Vídeos', icon: BookOpen },
    { id: 'exercises' as const, label: 'Exercícios Práticos', icon: CheckSquare },
    { id: 'ai_tutor' as const, label: 'Chatbot com IA', icon: Bot },
    { id: 'gamification' as const, label: 'Progresso & Badges', icon: Award },
    { id: 'speech_lab' as const, label: 'Speech Lab', icon: Mic },
    { id: 'roleplay' as const, label: 'Conversação', icon: MessageSquare },
    { id: 'flashcards' as const, label: 'Flashcards', icon: Layers },
    { id: 'ranking' as const, label: 'Ranking & Pódio', icon: Trophy },
    { id: 'school_hub' as const, label: 'Minha Escola & Boletim', icon: GraduationCap },
  ];

  const mainContentView = (
    <div className="transition-all space-y-4">
      {studentTab === 'learn' && <LearningRoadmap />}
      {studentTab === 'exercises' && <PracticalExercises />}
      {studentTab === 'ai_tutor' && <AITutorChat />}
      {studentTab === 'gamification' && <GamificationHub />}
      {studentTab === 'speech_lab' && <SpeechLab />}
      {studentTab === 'roleplay' && <RoleplaySimulator />}
      {studentTab === 'flashcards' && <FlashcardsDeck />}
      {studentTab === 'ranking' && <Leaderboard />}
      {studentTab === 'school_hub' && <SchoolHub />}
    </div>
  );

  const content = (
    <div className="space-y-5">
      {/* Student Profile Bar: Photo highlighted, level, trial vs unlimited, and photo edit */}
      <StudentProfileBar />

      {/* Student App Navigation Bar with Green Theme */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-1.5 flex items-center justify-between gap-1 overflow-x-auto">
        {studentNav.map((tab) => {
          const Icon = tab.icon;
          const isActive = studentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStudentTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid with Side Competition (No lado do app deve existir nome do aluno com mais horas e melhores notas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Column */}
        <div className={showSideCompetition ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {mainContentView}
        </div>

        {/* Side Competition Column */}
        {showSideCompetition && (
          <div className="lg:col-span-4 sticky top-4 space-y-4">
            <AppCompetitionSidebar onOpenFullView={() => setStudentTab('ranking')} />
          </div>
        )}
      </div>
    </div>
  );

  if (mobilePreviewFrame) {
    return (
      <div className="py-6 flex flex-col items-center justify-center bg-emerald-950/5 min-h-[calc(100vh-80px)] px-4">
        {/* Device Frame */}
        <div className="w-full max-w-sm sm:max-w-md bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/60 ring-1 ring-white/10">
          {/* Dynamic Island / Notch */}
          <div className="flex justify-center mb-2">
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="bg-slate-50 rounded-[34px] overflow-hidden flex flex-col h-[740px] border border-slate-200 text-slate-800">
            {/* App Header inside Mockup */}
            <div className="bg-emerald-800 text-white p-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-8 h-8 rounded-full border border-white/50 object-cover"
                />
                <div>
                  <p className="text-xs font-bold leading-tight">{activeStudent.name}</p>
                  <p className="text-[10px] text-emerald-200">
                    Nível {activeStudent.level} • {activeStudent.className}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-900/60 px-2 py-1 rounded-lg border border-emerald-700/40">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">
                  {activeStudent.appProgress.streakDays}d
                </span>
              </div>
            </div>

            {/* Scrollable Inside View */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Profile card inside mobile */}
              <StudentProfileBar />

              {/* Quick Tab Selector for Mobile Frame */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                {studentNav.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = studentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStudentTab(tab.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Side Competition Card on Mobile */}
              {showSideCompetition && (
                <div className="pb-2">
                  <AppCompetitionSidebar compact onOpenFullView={() => setStudentTab('ranking')} />
                </div>
              )}

              {mainContentView}
            </div>

            {/* Home Bar */}
            <div className="py-2 flex justify-center bg-white border-t border-slate-100 shrink-0">
              <div className="w-28 h-1 bg-slate-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {content}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { viewMode, portalGateOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 selection:bg-emerald-500 selection:text-white pb-12">
      <Header />
      {viewMode === 'admin' ? <AdminLayout /> : <StudentLayout />}
      {portalGateOpen && <PortalGateway />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
