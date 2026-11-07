import React, { useState } from 'react';
import { INSTITUTIONAL_PROFILE } from '../../data/institutionalData';
import {
  CreditCard,
  Copy,
  Check,
  Building,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Info,
} from 'lucide-react';

interface BankingDetailsCardProps {
  compact?: boolean;
  className?: string;
  title?: string;
  showSupportContacts?: boolean;
}

export const BankingDetailsCard: React.FC<BankingDetailsCardProps> = ({
  compact = false,
  className = '',
  title = 'Dados Bancários Oficiais para Pagamento de Propinas & Matrículas',
  showSupportContacts = true,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bank = INSTITUTIONAL_PROFILE.bankDetails;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  if (compact) {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white border border-emerald-500/40 shadow-lg ${className}`}>
        <div className="flex items-center justify-between pb-2.5 border-b border-emerald-800/80">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-xs tracking-wider uppercase text-emerald-200">
              {bank.bankName}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
            Moeda: {bank.currency}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-black/25 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-300 block uppercase font-medium">Conta BIM</span>
              <span className="font-mono font-bold text-sm text-white tracking-wider">{bank.accountNumber}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bank.accountNumber, 'conta')}
              className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer"
              title="Copiar Conta"
            >
              {copiedField === 'conta' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-2.5 bg-black/25 rounded-xl flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-[10px] text-emerald-300 block uppercase font-medium">NIB</span>
              <span className="font-mono font-bold text-xs text-white tracking-wider truncate block">{bank.nib}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bank.nib, 'nib')}
              className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer shrink-0"
              title="Copiar NIB"
            >
              {copiedField === 'nib' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-emerald-300/80">
          <span>Titular: <strong>{bank.holderName}</strong></span>
          <span>NUIT: <strong>{INSTITUTIONAL_PROFILE.nuit}</strong></span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white border-2 border-emerald-500/40 shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-800/80 text-[10px] font-bold text-emerald-200 uppercase">
                {bank.bankName}
              </span>
            </h3>
            <p className="text-xs text-emerald-200/80">
              {INSTITUTIONAL_PROFILE.name} ({INSTITUTIONAL_PROFILE.acronym}) • Beira, Moçambique
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-600/40 font-mono font-bold text-emerald-300 text-[11px]">
            NUIT: {INSTITUTIONAL_PROFILE.nuit}
          </span>
        </div>
      </div>

      {/* Account and NIB Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Conta Millennium BIM */}
        <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 backdrop-blur-xs flex items-center justify-between hover:border-emerald-400/60 transition group">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>Número de Conta (Millennium BIM)</span>
            </span>
            <p className="font-mono text-lg font-black text-white tracking-widest">
              {bank.accountNumber}
            </p>
            <span className="text-[10px] text-slate-300 block">
              Moeda de Liquidação: <strong>{bank.currency}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(bank.accountNumber, 'conta_full')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
              copiedField === 'conta_full'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-white group-hover:scale-105'
            }`}
          >
            {copiedField === 'conta_full' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Conta</span>
              </>
            )}
          </button>
        </div>

        {/* NIB Interbancário */}
        <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 backdrop-blur-xs flex items-center justify-between hover:border-emerald-400/60 transition group">
          <div className="space-y-1 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NIB (Transferências Interbancárias / SIMO)</span>
            </span>
            <p className="font-mono text-sm sm:text-base font-black text-emerald-100 tracking-wider truncate">
              {bank.nib}
            </p>
            <span className="text-[10px] text-slate-300 block truncate">
              Beneficiário: <strong>{bank.holderName}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(bank.nib, 'nib_full')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 ${
              copiedField === 'nib_full'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-white group-hover:scale-105'
            }`}
          >
            {copiedField === 'nib_full' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar NIB</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions & Receipt validation */}
      {showSupportContacts && (
        <div className="pt-2 border-t border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-start sm:items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] text-emerald-100/90 leading-tight">
              Após efectuar a transferência ou depósito, envie o comprovativo com o seu <strong>Código de Matrícula</strong> para a validação do recibo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/258${INSTITUTIONAL_PROFILE.whatsappContact}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold transition"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>WhatsApp: (+258) 87 541 1436</span>
            </a>

            <a
              href={`mailto:${INSTITUTIONAL_PROFILE.email}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] transition"
            >
              <Mail className="w-3 h-3 text-slate-300" />
              <span>{INSTITUTIONAL_PROFILE.email}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
