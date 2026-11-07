import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASDELogo } from '../ASDELogo';
import { CEFRLevel, CEFR_IELTS_MAP } from '../../types';
import { INSTITUTIONAL_PROFILE } from '../../data/institutionalData';
import {
  Building2,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Lock,
  CreditCard,
  Copy,
  Check,
  Info,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Target,
  Compass,
  Award,
  Briefcase,
  ChevronRight,
  MessageCircle,
  X,
} from 'lucide-react';
import { CameraPhotoCapture } from '../common/CameraPhotoCapture';
import { BankingDetailsCard } from '../common/BankingDetailsCard';

interface PortalGatewayProps {
  onClose?: () => void;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({ onClose }) => {
  const {
    authenticateCFP,
    authenticateStudentCode,
    startStudentTrial,
    registerStudentProfile,
    cfpAuth,
    studentAuth,
  } = useApp();

  // Navigation tab for the initial screen: 'access' | 'profile' | 'banking' | 'courses' | 'contacts'
  const [activeTab, setActiveTab] = useState<'access' | 'profile' | 'banking' | 'courses' | 'contacts'>('access');

  // Sub-views for login/register flows
  const [subView, setSubView] = useState<'none' | 'cfp_login' | 'student_login' | 'student_register'>('none');

  // CFP Code State
  const [cfpCodeInput, setCfpCodeInput] = useState('');
  const [cfpError, setCfpError] = useState<string | null>(null);

  // Student Login State
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [studentError, setStudentError] = useState<string | null>(null);

  // Quick copy state
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Student Registration State
  const [registerData, setRegisterData] = useState({
    name: '',
    level: 'A1' as CEFRLevel,
    avatar: '',
    enrollmentCode: '',
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleCFPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCfpError(null);
    const res = authenticateCFP(cfpCodeInput);
    if (!res.success) {
      setCfpError(res.message);
    } else {
      if (onClose) onClose();
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    const res = authenticateStudentCode(studentCodeInput);
    if (!res.success) {
      setStudentError(res.message);
    } else {
      if (onClose) onClose();
    }
  };

  const handleTrialClick = () => {
    startStudentTrial();
    if (onClose) onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name.trim()) return;

    registerStudentProfile({
      name: registerData.name,
      avatar: registerData.avatar,
      level: registerData.level,
      enrollmentCode: registerData.enrollmentCode,
    });

    if (onClose) onClose();
  };

  const canDismiss = Boolean(cfpAuth || (studentAuth && studentAuth.isAuthenticated));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-emerald-200/80 overflow-hidden my-auto flex flex-col max-h-[96vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Executive Institutional Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-7 text-white relative shrink-0 border-b border-emerald-700/60">
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition cursor-pointer"
              title="Continuar no sistema"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 text-center md:text-left">
            <div className="shrink-0 p-1.5 bg-white/10 rounded-2xl border border-emerald-400/40 shadow-inner">
              <ASDELogo size="lg" variant="crest" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider text-emerald-200">
                  Instituição Oficial de Moçambique
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-emerald-100">
                  NUIT: {INSTITUTIONAL_PROFILE.nuit}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-[10px] font-bold text-emerald-200">
                  Sede: Beira, Sofala
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                {INSTITUTIONAL_PROFILE.name}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium italic">
                "{INSTITUTIONAL_PROFILE.slogan}"
              </p>

              <p className="text-[11px] sm:text-xs text-emerald-100/75 max-w-2xl">
                Sistema Integrado de Gestão Acadêmica, Secretaria Digital e Aplicativo de Ensino de Língua Inglesa & Formações Profissionais Técnicas.
              </p>
            </div>
          </div>

          {/* Quick Subview Back Button */}
          {subView !== 'none' && (
            <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between">
              <button
                onClick={() => setSubView('none')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                ← Voltar ao Ecrã Inicial
              </button>
              <span className="text-xs font-bold text-emerald-200">
                {subView === 'cfp_login' && 'Autenticação CFP - ASDE'}
                {subView === 'student_login' && 'Acesso do Formando'}
                {subView === 'student_register' && 'Novo Cadastro de Formando'}
              </span>
            </div>
          )}

          {/* Institutional Navigation Tabs on the Initial Screen */}
          {subView === 'none' && (
            <div className="mt-5 pt-3 border-t border-emerald-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('access')}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'access'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/15'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Portais de Acesso</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/15'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Perfil Institucional & Sobre Nós</span>
              </button>

              <button
                onClick={() => setActiveTab('banking')}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'banking'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/15'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Conta Bancária Millennium BIM</span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'courses'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/15'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Outras Formações & Cursos</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'contacts'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/15'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Contactos & Sede na Beira</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: ACESSO AO SISTEMA (2 MAIN BUTTONS + STRATEGIC CARDS) */}
          {/* ======================================================== */}
          {subView === 'none' && activeTab === 'access' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  Selecione o seu perfil para aceder ao sistema:
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ambiente unificado para a gestão institucional e formação ativa em língua inglesa e cursos técnicos.
                </p>
              </div>

              {/* The 2 Main Requested Doors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Door 1: CFP - ASDE */}
                <button
                  id="btn-portal-cfp-asde"
                  onClick={() => setSubView('cfp_login')}
                  className="group p-6 rounded-3xl border-2 border-emerald-600/40 hover:border-emerald-600 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 hover:shadow-xl transition-all text-left flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                        Gestão & Docência
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 text-xl group-hover:text-emerald-900 transition-colors">
                        CFP - ASDE
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        Módulos integrados para <strong>Administração Total</strong>, <strong>Secretaria Acadêmica</strong> (matrículas, propinas e recebimentos BIM/M-Pesa) e <strong>Corpo Docente</strong> (pautas de avaliação CEFR, diário de presença e chamada).
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        Secretaria & Propinas
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        Pautas de Notas CEFR
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        Matriz de Cursos
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-200/80 flex items-center justify-between text-xs font-extrabold text-emerald-800 group-hover:text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      Aceder com Código de Função
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>

                {/* Door 2: FORMANDO */}
                <button
                  id="btn-portal-formando"
                  onClick={() => setSubView('student_login')}
                  className="group p-6 rounded-3xl border-2 border-teal-600/40 hover:border-teal-600 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 hover:shadow-xl transition-all text-left flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-black uppercase">
                        Aplicativo do Aluno
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 text-xl group-hover:text-teal-900 transition-colors">
                        FORMANDO
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        Ambiente do estudante com <strong>Aulas de Inglês A1 a C2</strong>, <strong>Speech Lab</strong> de pronúncia por inteligência artificial, <strong>Chatbot Tutor IA</strong>, simuladores de conversação, pódio e boletim de notas oficial.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        Aulas Interativas
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        Speech Lab IA
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        7 Dias Grátis ou Matrícula
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-teal-200/80 flex items-center justify-between text-xs font-extrabold text-teal-800 group-hover:text-teal-950">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Aceder ao App de Inglês
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>
              </div>

              {/* USER REQUEST: Institutional Profile & Account Details Organised Professionally on Initial Screen */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                {/* Strategic Card 1: Millennium BIM Bank Account Details */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white border-2 border-emerald-500/40 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          Millennium BIM Oficial
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold">
                            Moçambique
                          </span>
                        </h4>
                        <span className="text-[11px] text-emerald-200/80">
                          Conta oficial para liquidação de propinas & inscrições
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-amber-300 uppercase">
                      Meticais (MT)
                    </span>
                  </div>

                  {/* Bank Numbers with 1-click copy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                          Conta Millennium BIM
                        </span>
                        <span className="font-mono font-bold text-base text-white tracking-wider">
                          {INSTITUTIONAL_PROFILE.bankDetails.accountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(INSTITUTIONAL_PROFILE.bankDetails.accountNumber, 'conta_home')
                        }
                        className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer"
                        title="Copiar Conta"
                      >
                        {copiedItem === 'conta_home' ? (
                          <Check className="w-4 h-4 text-emerald-300" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                          NIB (21 Dígitos)
                        </span>
                        <span className="font-mono font-bold text-xs text-white tracking-wider truncate block">
                          {INSTITUTIONAL_PROFILE.bankDetails.nib}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(INSTITUTIONAL_PROFILE.bankDetails.nib, 'nib_home')
                        }
                        className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer shrink-0"
                        title="Copiar NIB"
                      >
                        {copiedItem === 'nib_home' ? (
                          <Check className="w-4 h-4 text-emerald-300" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Money in Mozambique */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                        M-Pesa (Vodacom) & e-Mola (Movitel)
                      </span>
                      <span className="font-mono font-bold text-sm text-white">
                        (+258) 87 541 1436 / 85 335 7973
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('875411436', 'mpesa_home')}
                      className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer shrink-0"
                      title="Copiar M-Pesa"
                    >
                      {copiedItem === 'mpesa_home' ? (
                        <Check className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200/80">
                    <span>Titular: <strong>{INSTITUTIONAL_PROFILE.bankDetails.holderName}</strong></span>
                    <span>NUIT: <strong>{INSTITUTIONAL_PROFILE.nuit}</strong></span>
                  </div>
                </div>

                {/* Strategic Card 2: Institutional Profile Snapshot */}
                <div className="p-5 rounded-3xl bg-white border-2 border-emerald-200/80 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                          CFPA
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">
                            Perfil Institucional do CFPA
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Fundado em 2021 • Cidade da Beira, Moçambique
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                        Credenciado
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      O <strong>Centro de Formação Profissional ASDE</strong> actua na vanguarda da formação prática em Moçambique, com ensino intensivo de língua inglesa modelo IELTS e cursos técnicos direccionados ao mercado corporativo e industrial.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="font-bold text-slate-800 block">Metodologia Prática</span>
                        <span className="text-slate-500">Foco no "saber fazer" e inserção no emprego</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="font-bold text-slate-800 block">Grandes Parcerias</span>
                        <span className="text-slate-500">Inst. Náutico e Portuário, REVIMO, ESSOR</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Dossier Institucional Completo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://wa.me/258${INSTITUTIONAL_PROFILE.whatsappContact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Oficial</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust Footer */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <span>
                  🔒 Ambiente Oficial • Centro de Formação Profissional ASDE (CFPA) • Moçambique
                </span>
                <span className="font-semibold text-emerald-800">
                  Criado pela 9TECH (+258 84 634 8589)
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: PERFIL INSTITUCIONAL & DOSSIER */}
          {/* ======================================================== */}
          {subView === 'none' && activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    Quem Somos & Histórico do CFPA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dossier institucional oficial do Centro de Formação Profissional ASDE em Moçambique.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('access')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs hover:bg-emerald-200 transition cursor-pointer self-start sm:self-auto"
                >
                  Entrar no Sistema →
                </button>
              </div>

              {/* History */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  Origem e Trajetória Institucional
                </h4>
                <p className="whitespace-pre-line">{INSTITUTIONAL_PROFILE.history}</p>
              </div>

              {/* Mission, Vision, Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                    <Target className="w-4 h-4" />
                    <span>Missão Institucional</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {INSTITUTIONAL_PROFILE.mission}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-teal-800 font-black text-sm">
                    <Compass className="w-4 h-4" />
                    <span>Visão Estratégica</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {INSTITUTIONAL_PROFILE.vision}
                  </p>
                </div>
              </div>

              {/* Core Values */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900">
                  Valores que Norteiam a Nossa Atuação:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {INSTITUTIONAL_PROFILE.values.map((v, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-emerald-300 transition-colors"
                    >
                      <span className="font-extrabold text-xs text-emerald-900 block">
                        {v.title}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {v.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Partnerships in Mozambique */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  Experiências e Parcerias Realizadas de Grande Impacto:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {INSTITUTIONAL_PROFILE.successCases.map((sc, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2"
                    >
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                        {sc.partner}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900">{sc.course}</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {sc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: DADOS BANCÁRIOS MILLENNIUM BIM (FULL DETAILS) */}
          {/* ======================================================== */}
          {subView === 'none' && activeTab === 'banking' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-700" />
                    Conta Bancária Oficial Millennium BIM
                  </h3>
                  <p className="text-xs text-slate-500">
                    Utilize estes dados para depósitos ao balcão, transferências bancárias ou pagamento de propinas e taxas de inscrição.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('access')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs hover:bg-emerald-200 transition cursor-pointer self-start sm:self-auto"
                >
                  Entrar no Sistema →
                </button>
              </div>

              <BankingDetailsCard
                title="Conta Oficial Millennium BIM • Centro de Formação Profissional ASDE"
                showSupportContacts={true}
              />

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-700" />
                  Instruções para Confirmação de Pagamento:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>No campo "Descritivo / Referência" da transferência, indique o <strong>Nome do Formando</strong> ou o <strong>Código de Matrícula</strong> (ex: ASDE-2025-XXXX).</li>
                  <li>Envie o comprovativo de transferência ou talão de depósito para o nosso WhatsApp oficial: <strong>(+258) 87 541 1436</strong> ou por e-mail para <strong>cfpasde.geral@gmail.com</strong>.</li>
                  <li>A secretaria do CFP - ASDE procede à validação e emissão do recibo oficial com NUIT 401953728 no sistema em menos de 2 horas.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: OUTRAS FORMAÇÕES & CURSOS */}
          {/* ======================================================== */}
          {subView === 'none' && activeTab === 'courses' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                    Catálogo de Cursos & Outras Formações Profissionais
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cursos orientados para a prática, saber fazer e rápida empregabilidade em Moçambique.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('access')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs hover:bg-emerald-200 transition cursor-pointer self-start sm:self-auto"
                >
                  Inscrever-se Agora →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INSTITUTIONAL_PROFILE.areas.map((a, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                        {a.tag}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">CFPA Moçambique</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: CONTACTOS & SEDE */}
          {/* ======================================================== */}
          {subView === 'none' && activeTab === 'contacts' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                    Contactos Oficiais & Instalações
                  </h3>
                  <p className="text-xs text-slate-500">
                    Venha visitar a nossa sede na Beira ou contacte os canais de atendimento oficial.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('access')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs hover:bg-emerald-200 transition cursor-pointer self-start sm:self-auto"
                >
                  Entrar no Sistema →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase">Sede Oficial</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {INSTITUTIONAL_PROFILE.address}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    {INSTITUTIONAL_PROFILE.city}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase">Telefones Directos</h4>
                  <p className="text-xs text-slate-600 font-mono">
                    {INSTITUTIONAL_PROFILE.contacts.join(' / ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Segunda a Sábado • 07h30 às 18h00
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase">E-mail & WhatsApp</h4>
                  <p className="text-xs text-slate-600 font-mono">
                    {INSTITUTIONAL_PROFILE.email}
                  </p>
                  <a
                    href={`https://wa.me/258${INSTITUTIONAL_PROFILE.whatsappContact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp (+258 87 541 1436)</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SUBVIEW: CFP - ASDE PASSCODE LOGIN */}
          {/* ======================================================== */}
          {subView === 'cfp_login' && (
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
                  <Building2 className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  Acesso Restrito: CFP - ASDE
                </h2>
                <p className="text-xs text-slate-500">
                  Insira o código de função da Direção, Secretaria ou Docência:
                </p>
              </div>

              <form onSubmit={handleCFPSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Código de Acesso Institucional:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Ex: ASDE-CEO-2025 ou seu código"
                      value={cfpCodeInput}
                      onChange={(e) => setCfpCodeInput(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider"
                    />
                  </div>
                </div>

                {cfpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{cfpError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Validar & Entrar no CFP - ASDE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xs font-bold text-slate-700 block">
                  Área Exclusiva para Colaboradores
                </span>
                <p className="text-[11px] text-slate-500">
                  Dúvidas sobre o seu código de acesso? Contacte a Direção do CFPA na Beira.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SUBVIEW: FORMANDO LOGIN */}
          {/* ======================================================== */}
          {subView === 'student_login' && (
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 rounded-2xl bg-teal-100 text-teal-800 mb-1">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  Portal do Formando ASDE
                </h2>
                <p className="text-xs text-slate-500">
                  Insira o seu número de matrícula ou aceda ao teste de 7 dias grátis:
                </p>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Número de Inscrição / Matrícula ASDE:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: ASDE-2025-0142"
                      value={studentCodeInput}
                      onChange={(e) => setStudentCodeInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono uppercase tracking-wider"
                    />
                  </div>
                </div>

                {studentError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{studentError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aceder com Matrícula (Ilimitado)</span>
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-4 text-xs text-slate-400 font-bold uppercase">Ou</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleTrialClick}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Modo Degustação (7 Dias Grátis)</span>
                </button>

                <button
                  onClick={() => setSubView('student_register')}
                  className="w-full py-2.5 px-4 rounded-xl border border-teal-300 bg-teal-50/60 hover:bg-teal-100 text-teal-900 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-teal-700" />
                  <span>Novo Aluno? Criar Perfil com Foto pela Câmera</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SUBVIEW: STUDENT REGISTER WITH CAMERA PHOTO */}
          {/* ======================================================== */}
          {subView === 'student_register' && (
            <div className="max-w-md mx-auto space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-slate-900">
                  Registo de Perfil de Formando
                </h2>
                <p className="text-xs text-slate-500">
                  Fotografe-se diretamente com a câmera do seu dispositivo para personalizar o seu boletim e pódio.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <CameraPhotoCapture
                  currentPhoto={registerData.avatar}
                  onPhotoCaptured={(photo) => setRegisterData((prev) => ({ ...prev, avatar: photo }))}
                  label="Fotografia Obrigatória para a Inscrição (Câmera)"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Armando Manuel Sitoe"
                    value={registerData.name}
                    onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nível de Inscrição em Inglês (CEFR):
                  </label>
                  <select
                    value={registerData.level}
                    onChange={(e) =>
                      setRegisterData((p) => ({ ...p, level: e.target.value as CEFRLevel }))
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl} - {CEFR_IELTS_MAP[lvl].name} ({CEFR_IELTS_MAP[lvl].ieltsBand})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código de Matrícula (Opcional para modo 7 dias):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: ASDE-2025-0142"
                    value={registerData.enrollmentCode}
                    onChange={(e) =>
                      setRegisterData((p) => ({ ...p, enrollmentCode: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Perfil & Entrar no App</span>
                </button>
              </form>

              <div className="pt-2">
                <BankingDetailsCard
                  compact={true}
                  title="Dados Bancários BIM para Pagamento da Taxa de Inscrição"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
