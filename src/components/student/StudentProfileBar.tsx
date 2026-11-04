import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CEFRLevel, CEFR_IELTS_MAP } from '../../types';
import { UserPhoto } from '../common/UserPhoto';
import { CameraPhotoCapture } from '../common/CameraPhotoCapture';
import {
  User,
  CheckCircle2,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  Edit3,
  X,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const StudentProfileBar: React.FC = () => {
  const {
    activeStudent,
    studentAuth,
    authenticateStudentCode,
    registerStudentProfile,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: activeStudent.name,
    level: activeStudent.level,
    avatar: activeStudent.avatar,
    enrollmentCode: activeStudent.enrollmentCode || '',
  });
  const [codeActivationInput, setCodeActivationInput] = useState('');
  const [activationMsg, setActivationMsg] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const levelDetails = CEFR_IELTS_MAP[activeStudent.level];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    registerStudentProfile({
      name: formData.name,
      avatar: formData.avatar,
      level: formData.level,
      enrollmentCode: formData.enrollmentCode,
    });
    setIsEditModalOpen(false);
  };

  const handleActivateUnlimited = (e: React.FormEvent) => {
    e.preventDefault();
    const res = authenticateStudentCode(codeActivationInput);
    setActivationMsg({
      success: res.success,
      text: res.message,
    });
    if (res.success) {
      setTimeout(() => {
        setActivationMsg(null);
        setCodeActivationInput('');
      }, 3000);
    }
  };

  return (
    <>
      {/* Student Profile Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 text-white shadow-md border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: UserPhoto with Highlight Glow Ring + Student Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <UserPhoto
              src={activeStudent.avatar}
              name={activeStudent.name}
              size="lg"
              highlightRing={true}
              borderClassName="border-2 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 p-1 bg-amber-500 text-slate-950 rounded-full shadow-xs border border-white">
              <Award className="w-3 h-3 font-bold" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>{activeStudent.name}</span>
                <button
                  onClick={() => {
                    setFormData({
                      name: activeStudent.name,
                      level: activeStudent.level,
                      avatar: activeStudent.avatar,
                      enrollmentCode: activeStudent.enrollmentCode || '',
                    });
                    setIsEditModalOpen(true);
                  }}
                  title="Editar dados e foto oficial do perfil"
                  className="p-1 rounded-md text-emerald-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </h2>

              {/* Status Badge */}
              {studentAuth?.isTrial ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Clock className="w-3 h-3" />
                  <span>Modo Experimental</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Matriculado Oficial</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200">
              <span className="bg-white/10 px-2 py-0.5 rounded-md font-bold text-white">
                Nível {activeStudent.level} • {levelDetails.name}
              </span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">
                {levelDetails.ieltsBand}
              </span>
              {activeStudent.enrollmentCode && (
                <>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-emerald-300">
                    Cód: {activeStudent.enrollmentCode}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action / Unlimited Upgrade */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {studentAuth?.isTrial ? (
            <div className="bg-white/10 border border-amber-400/40 rounded-xl p-2.5 px-3 flex items-center gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Acesso Experimental Ativo</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Insira o código fornecido pela secretaria da escola para desbloqueio ilimitado.
                </p>
              </div>

              <form onSubmit={handleActivateUnlimited} className="flex items-center gap-1.5">
                <input
                  type="password"
                  placeholder="Código de Acesso"
                  value={codeActivationInput}
                  onChange={(e) => setCodeActivationInput(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-black/30 border border-white/20 text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 w-28"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Ativar
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs text-right">
              <div className="hidden sm:block">
                <span className="text-emerald-300 text-[10px] uppercase font-bold block">
                  Acesso Ilimitado Garantido
                </span>
                <span className="text-white font-extrabold">
                  {studentAuth?.userName || activeStudent.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setFormData({
                    name: activeStudent.name,
                    level: activeStudent.level,
                    avatar: activeStudent.avatar,
                    enrollmentCode: activeStudent.enrollmentCode || '',
                  });
                  setIsEditModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Atualizar Foto & Ficha</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {activationMsg && (
        <div
          className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            activationMsg.success
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          {activationMsg.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{activationMsg.text}</span>
        </div>
      )}

      {/* EDIT STUDENT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-emerald-100 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Foto & Ficha do Formando
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Centro de Formação Profissional ASDE
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Camera Photo Capture for Student */}
              <CameraPhotoCapture
                currentPhoto={formData.avatar}
                onPhotoCaptured={(photo) => setFormData((p) => ({ ...p, avatar: photo }))}
                label="Foto Oficial do Formando para o Processo (Câmera)"
              />

              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nível de Inscrição no ASDE:
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, level: e.target.value as CEFRLevel }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl} - {CEFR_IELTS_MAP[lvl].name} ({CEFR_IELTS_MAP[lvl].ieltsBand})
                    </option>
                  ))}
                </select>
              </div>

              {/* Enrollment Code */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Código de Matrícula (ASDE):
                </label>
                <input
                  type="text"
                  placeholder="Ex: ASDE-2025-0142"
                  value={formData.enrollmentCode}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, enrollmentCode: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-md cursor-pointer"
                >
                  Confirmar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
