import React, { useState } from 'react';
import { INSTITUTIONAL_PROFILE } from '../../data/institutionalData';
import { BankingDetailsCard } from '../common/BankingDetailsCard';
import {
  Building2,
  X,
  Target,
  Compass,
  Award,
  BookOpen,
  Briefcase,
  Languages,
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface InstitutionalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstitutionalProfileModal: React.FC<InstitutionalProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'mission' | 'areas' | 'partners' | 'contacts'>('about');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-emerald-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Official Branding */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 flex items-center justify-center border-2 border-emerald-400">
              <img
                src="/asde_logo.jpg"
                alt="CFPA Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider">
                  Perfil Institucional Oficial • Beira | 2026
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold">
                  NUIT: {INSTITUTIONAL_PROFILE.nuit}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {INSTITUTIONAL_PROFILE.name} ({INSTITUTIONAL_PROFILE.acronym})
              </h2>

              <p className="text-xs sm:text-sm text-emerald-200 italic font-medium">
                "{INSTITUTIONAL_PROFILE.slogan}"
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Quem Somos & Histórico</span>
          </button>

          <button
            onClick={() => setActiveTab('mission')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mission'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Missão, Visão e Valores</span>
          </button>

          <button
            onClick={() => setActiveTab('areas')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'areas'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Áreas & Formações</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'partners'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Experiências & Parcerias</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Contactos & Banco BIM</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* TAB 1: Quem Somos & Histórico */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <h3 className="font-black text-sm uppercase tracking-wide text-emerald-950 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Quem Somos</span>
                </h3>
                <p className="leading-relaxed text-slate-700">
                  O <strong>Centro de Formação Profissional ASDE (CFPA)</strong> é uma instituição dedicada à criação, transmissão e difusão de conhecimento técnico e profissional, com sede na Cidade da Beira, Moçambique.
                </p>
                <p className="leading-relaxed text-slate-700">
                  Capacitamos formandos com as competências, conhecimentos e atitudes necessárias para o desempenho eficiente e produtivo no mercado de trabalho, facilitando a sua progressão e integração profissional. Com uma abordagem prática orientada para o <em>"saber fazer"</em>, o CFPA é hoje uma referência na formação técnica e profissional na Região Centro de Moçambique.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Histórico Institucional</span>
                </h3>
                <div className="space-y-2.5 text-slate-600 leading-relaxed">
                  <p>
                    O CFPA tem origem em <strong>2021</strong>, sob a designação <em>ASDE Learning</em>, como parte integrante do ASDE Group. A sua primeira actuação foi na área de explicações e apoio escolar, abrangendo desde o ensino primário ao universitário.
                  </p>
                  <p>
                    Face à crescente necessidade de formação em língua inglesa na Cidade da Beira — especialmente no modelo IELTS com foco na comunicação oral — surgiu o ASDE Learning, dedicado ao ensino intensivo de inglês em seis meses.
                  </p>
                  <p>
                    A elevada adesão a este programa revelou o desafio mais amplo da formação profissional, levando à criação do <strong>Centro de Formação Profissional ASDE</strong>, que hoje integra explicações, ensino de línguas e cursos técnicos e profissionais.
                  </p>
                </div>
              </div>

              {/* Objetivos Estratégicos */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-3">
                <h3 className="font-black text-sm uppercase tracking-wide text-emerald-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-700" />
                  <span>Objectivos Estratégicos</span>
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Formar quadros com elevado nível de competências científicas, técnicas, culturais, sociais e humanas, orientados para o saber fazer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Oferecer programas de docência de qualidade correspondentes às necessidades reais do mercado de trabalho.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Assegurar a ligação ao trabalho como meio de formação técnica e profissional, fomentando a empregabilidade a todos os níveis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Promover a cultura de qualidade no ensino, em alinhamento com critérios e práticas de referência nacionais e internacionais.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Missão, Visão e Valores */}
          {activeTab === 'mission' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" /> Missão
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {INSTITUTIONAL_PROFILE.mission}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-600" /> Visão
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {INSTITUTIONAL_PROFILE.vision}
                </p>
              </div>

              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 mb-3">
                  Valores Institucionais
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INSTITUTIONAL_PROFILE.values.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-emerald-300 transition space-y-1"
                    >
                      <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {val.title}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Áreas de Actuação & Outras Formações */}
          {activeTab === 'areas' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                O Centro de Formação Profissional ASDE abrange um leque diversificado de capacitações práticas adaptadas às exigências empresariais de Moçambique:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {INSTITUTIONAL_PROFILE.areas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-sm transition space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-xs text-slate-900">{area.title}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                          {area.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {area.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                      <span>Inscrições abertas em Beira</span>
                      <span className="text-slate-400 font-normal">Módulos Práticos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Experiências Realizadas & Parcerias */}
          {activeTab === 'partners' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                O CFPA tem um histórico comprovado de programas de capacitação realizados com empresas e instituições de referência:
              </div>

              <div className="space-y-3">
                {INSTITUTIONAL_PROFILE.successCases.map((cs, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border-l-4 border-l-emerald-600 border border-slate-200 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-xs text-emerald-950">
                        {cs.partner}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {cs.course}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cs.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs text-slate-800">Pontos Fortes do CFPA</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Histórico consolidado desde 2021 na Beira</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Metodologia orientada para o "saber fazer"</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Forte ligação a empregadores locais</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Equipa pedagógica e formadores qualificados</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: Contactos, Localização & Banco BIM */}
          {activeTab === 'contacts' && (
            <div className="space-y-5">
              {/* Strategic Banking Card */}
              <BankingDetailsCard />

              {/* Physical Location and Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Sede Institucional & Localização</span>
                  </h4>
                  <p className="text-xs text-slate-700 font-medium">
                    {INSTITUTIONAL_PROFILE.address}
                  </p>
                  <p className="text-xs text-slate-500">
                    {INSTITUTIONAL_PROFILE.city}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-900 font-bold bg-emerald-100/60 p-2 rounded-xl">
                    NUIT Oficial: {INSTITUTIONAL_PROFILE.nuit}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>Contactos & Atendimento</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">Telefones:</span>
                      <span>(+258) 853357973 / 875411436</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">Email:</span>
                      <a href={`mailto:${INSTITUTIONAL_PROFILE.email}`} className="text-emerald-700 hover:underline">
                        {INSTITUTIONAL_PROFILE.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">WhatsApp:</span>
                      <a
                        href={`https://wa.me/258${INSTITUTIONAL_PROFILE.whatsappContact}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        +258 846348589 (Suporte 9TECH / ASDE)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100/80 p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{INSTITUTIONAL_PROFILE.name}</span>
            <span>• Beira, Moçambique</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/258${INSTITUTIONAL_PROFILE.whatsappContact}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Falar com o CFPA no WhatsApp
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
