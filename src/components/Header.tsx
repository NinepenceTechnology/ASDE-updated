import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ASDELogo } from './ASDELogo';
import { PWAInstallButton } from './common/PWAInstallButton';
import { InstitutionalProfileModal } from './institutional/InstitutionalProfileModal';
import { QuickSearchAIModal } from './common/QuickSearchAIModal';
import {
  Smartphone,
  LayoutDashboard,
  Users,
  RotateCcw,
  CheckCircle2,
  Monitor,
  Trophy,
  KeyRound,
  LogOut,
  ShieldCheck,
  GraduationCap,
  Building2,
  Sparkles,
  Info,
  Phone,
  MessageCircle,
  Search,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    students,
    activeStudentId,
    setActiveStudentId,
    activeStudent,
    resetAllData,
    mobilePreviewFrame,
    setMobilePreviewFrame,
    portalGateOpen,
    setPortalGateOpen,
    cfpAuth,
    studentAuth,
    logoutPortal,
    isQuickSearchOpen,
    setIsQuickSearchOpen,
    quickSearchInitialQuery,
    quickSearchInitialCategory,
    openQuickSearch,
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Global Ctrl+K / Cmd+K keyboard shortcut to open Quick Search AI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openQuickSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openQuickSearch]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        {/* Top Mini Bar with Credits & Institutional Quick Access */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-3 sm:px-6 py-1 border-b border-emerald-800/60">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-2 truncate">
              <span className="hidden md:inline font-bold text-emerald-300">
                CFPA • Centro de Formação Profissional ASDE
              </span>
              <span className="hidden lg:inline text-emerald-200/70">
                | Beira, Moçambique • NUIT: 401953728
              </span>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold underline cursor-pointer"
              >
                <Info className="w-3 h-3" />
                <span>Perfil Institucional & Banco BIM</span>
              </button>
            </div>

            {/* User Request: Link to WhatsApp (846348589) with stamp "Criado pela 9TECH" very small in top right */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <a
                href="https://wa.me/258846348589"
                target="_blank"
                rel="noopener noreferrer"
                title="Fale com a 9TECH no WhatsApp (+258 846348589)"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/40 text-[9px] sm:text-[10px] font-black tracking-tight transition-all shadow-xs cursor-pointer group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                <MessageCircle className="w-3 h-3 text-emerald-300" />
                <span>Criado pela 9TECH</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-18 gap-2">
            {/* Logo & School Identity using official ASDE crest */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPortalGateOpen(true)}
                className="flex items-center gap-2 cursor-pointer text-left group"
                title="Abrir Seleção de Portal (CFP - ASDE ou FORMANDO)"
              >
                <ASDELogo size="md" variant="full" />
              </button>
            </div>

            {/* Quick Search AI Trigger Button */}
            <button
              onClick={() => openQuickSearch()}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition shadow-xs cursor-pointer group shrink-0"
              title="Buscar Gramática e Dicionário com IA (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Quick Search AI • Gramática & Dicionário</span>
              <span className="hidden sm:inline lg:hidden">Quick Search AI</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-emerald-800 border border-emerald-200 shadow-xs">
                Ctrl+K
              </kbd>
            </button>

            {/* Central Two Portal Switcher */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-xs shrink-0">
              <button
                id="switch-admin-portal-btn"
                onClick={() => {
                  if (!cfpAuth) {
                    setPortalGateOpen(true);
                  } else {
                    setViewMode('admin');
                  }
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'admin'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-700" />
                <span>CFP - ASDE</span>
                {cfpAuth && (
                  <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                    {cfpAuth.role === 'admin_ceo'
                      ? 'CEO'
                      : cfpAuth.role === 'secretaria'
                      ? 'Secretaria'
                      : cfpAuth.role === 'docente'
                      ? 'Docente'
                      : 'Geral'}
                  </span>
                )}
              </button>

              <button
                id="switch-student-app-btn"
                onClick={() => {
                  setViewMode('student');
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'student'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>FORMANDO</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </button>
            </div>

            {/* Right Controls: Student Selector, PWA Install, Switch Portal Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {viewMode === 'student' ? (
                <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-1 sm:p-1.5 px-2">
                  <Users className="w-3.5 h-3.5 text-emerald-600 hidden sm:block" />
                  <label htmlFor="student-selector" className="text-xs text-emerald-800 font-bold hidden md:inline">
                    Aluno:
                  </label>
                  <select
                    id="student-selector"
                    value={activeStudentId}
                    onChange={(e) => setActiveStudentId(e.target.value)}
                    className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer max-w-[110px] sm:max-w-[170px] truncate"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.level})
                      </option>
                    ))}
                  </select>

                  {/* Smartphone Preview toggle */}
                  <button
                    id="toggle-mobile-frame-btn"
                    title={mobilePreviewFrame ? 'Alternar para Tela Cheia' : 'Alternar para Modo Smartphone'}
                    onClick={() => setMobilePreviewFrame(!mobilePreviewFrame)}
                    className={`p-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer hidden sm:flex ${
                      mobilePreviewFrame
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mobilePreviewFrame ? (
                      <Monitor className="w-3.5 h-3.5" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {cfpAuth ? cfpAuth.label : 'Acesso Restrito CFP - ASDE'}
                  </span>
                </div>
              )}

              {/* Universal PWA Install Button for iOS, APK, and Windows */}
              <PWAInstallButton />

              {/* Trocar Portal / Sair */}
              <button
                onClick={() => setPortalGateOpen(true)}
                title="Trocar de Portal (CFP - ASDE ou FORMANDO)"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">Trocar Portal</span>
              </button>

              {/* Reset Data for Testing */}
              <button
                id="reset-demo-data-btn"
                onClick={() => {
                  if (window.confirm('Deseja restaurar os dados originais do Centro de Formação ASDE e do App?')) {
                    resetAllData();
                  }
                }}
                title="Restaurar dados originais"
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Institutional Profile & Millennium BIM Dossier Modal */}
      <InstitutionalProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Quick Search AI Modal • Grammar & Dictionary */}
      <QuickSearchAIModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        initialQuery={quickSearchInitialQuery}
        initialCategory={quickSearchInitialCategory}
      />
    </>
  );
};
