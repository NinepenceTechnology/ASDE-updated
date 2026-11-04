import React from 'react';
import { Student } from '../../types';
import { Award, CheckCircle, Download, Printer, X, ShieldCheck, Calendar, BookOpen } from 'lucide-react';

interface CertificateModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  type?: 'certificate' | 'declaration';
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  isOpen,
  onClose,
  type = 'certificate',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const levelDescriptions: Record<string, string> = {
    A1: 'Iniciante / Breakthrough - Compreensão e uso de expressões cotidianas essenciais.',
    A2: 'Básico / Waystage - Comunicação simples sobre tarefas rotineiras e passado pessoal.',
    B1: 'Intermediário / Threshold - Fluência funcional, compreensão dos pontos principais em viagens e trabalho.',
    B2: 'Intermediário Superior / Vantage - Conversação fluente e espontânea, argumentação e textos complexos.',
    C1: 'Avançado / Effective Operational Proficiency - Domínio flexível do idioma para fins acadêmicos e corporativos.',
    C2: 'Domínio Pleno / Mastery - Compreensão total com distinção de sutilezas de significado e sotaque.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-900 font-bold">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>
              {type === 'certificate'
                ? 'Certificado Oficial de Proficiência em Inglês'
                : 'Declaração Oficial de Matrícula e Frequência'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (High Polish Layout) */}
        <div className="p-8 sm:p-12 bg-linear-to-b from-amber-50/20 via-white to-indigo-50/30 print:p-0">
          <div className="border-4 border-double border-indigo-950/20 p-6 sm:p-10 rounded-xl relative bg-white/80 backdrop-blur-xs shadow-inner">
            {/* Watermark & Badges */}
            <div className="absolute top-6 right-6 opacity-20 pointer-events-none">
              <Award className="w-32 h-32 text-indigo-900" />
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                CENTRO DE FORMAÇÃO PROFISSIONAL ASDE • NUIT: 401953728 • Beira, Moçambique
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {type === 'certificate' ? 'CERTIFICADO DE PROFICIÊNCIA' : 'DECLARAÇÃO DE MATRÍCULA'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-serif italic">
                O Conselho Pedagógico e a Direção Acadêmica do Centro de Formação Profissional ASDE certificam para os devidos fins legais que:
              </p>

              <div className="py-2">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-700 font-serif border-b-2 border-indigo-200 inline-block px-8 pb-1">
                  {student.name}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Matrícula: {student.enrollmentCode} • Registro: LB-{student.id}
                </p>
              </div>

              <div className="max-w-xl mx-auto text-slate-700 text-sm leading-relaxed text-justify sm:text-center">
                {type === 'certificate' ? (
                  <>
                    Completou com êxito os módulos teóricos, avaliações práticas e laboratoriais do programa de ensino da língua inglesa, atingindo a banda de proficiência <strong className="text-indigo-900 font-bold font-sans">Nível CEFR {student.level}</strong> ({levelDescriptions[student.level] || 'Quadro Comum Europeu de Referência para Línguas'}), com frequência acadêmica de <strong className="text-slate-900">{student.attendancePercent}%</strong> e aproveitamento de excelência.
                  </>
                ) : (
                  <>
                    Encontra-se regularmente matriculado(a) e ativo(a) na turma <strong className="text-indigo-900">{student.className}</strong>, cursando o nível <strong className="text-slate-900">CEFR {student.level}</strong>, com taxa de presença apurada em <strong className="text-emerald-700">{student.attendancePercent}%</strong> até a presente data.
                  </>
                )}
              </div>

              {/* Skills Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-lg mx-auto text-left">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Speaking / Fala</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {student.grades[0]?.speaking || 90}/100
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Listening / Escuta</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {student.grades[0]?.listening || 92}/100
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Reading / Leitura</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {student.grades[0]?.reading || 90}/100
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Grammar & Writing</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {student.grades[0]?.grammar || 88}/100
                  </span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 border-t border-slate-200 mt-6 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="w-36 sm:w-48 mx-auto border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-600">
                    Sarah Jenkins, M.Ed.
                  </div>
                  <span className="text-slate-500 font-medium">Coordenação Pedagógica</span>
                  <span className="block text-[10px] text-slate-400">Head of Academic Studies</span>
                </div>
                <div>
                  <div className="w-36 sm:w-48 mx-auto border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-600">
                    Dr. Alistair Ward, DELTA
                  </div>
                  <span className="text-slate-500 font-medium">Diretoria Acadêmica</span>
                  <span className="block text-[10px] text-slate-400">Centro de Formação Profissional ASDE</span>
                </div>
              </div>

              {/* Verification hash */}
              <div className="text-[10px] text-slate-400 font-mono pt-4">
                Autenticidade verificável em: verify.asde.edu • Cód: {student.enrollmentCode}-ASDE-2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
