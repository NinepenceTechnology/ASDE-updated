import { CFPRole, CFPAuthSession, StudentAuthSession } from '../types';

/**
 * Códigos locais confidenciais do Centro de Formação Profissional ASDE.
 * Requisito: Esses códigos são estritamente locais e não são sincronizados na nuvem.
 */
export const LOCAL_AUTH_CODES = {
  CFP_GERAL: '2026AsdeCFP',
  SECRETARIA: '2026AsdeCFPS',
  DOCENTES: '2026AsdeCFPDC',
  ADMIN_TOTAL: '2026AsdeCFPCEO',
} as const;

export function validateCFPCode(enteredCode: string): CFPAuthSession | null {
  const cleanCode = enteredCode.trim();

  if (cleanCode === LOCAL_AUTH_CODES.ADMIN_TOTAL) {
    return {
      isAuthenticated: true,
      role: 'admin_ceo',
      label: 'Administrador Total (CEO / Direção Geral)',
    };
  }

  if (cleanCode === LOCAL_AUTH_CODES.CFP_GERAL) {
    return {
      isAuthenticated: true,
      role: 'cfp_geral',
      label: 'Direção Geral CFP - ASDE',
    };
  }

  if (cleanCode === LOCAL_AUTH_CODES.SECRETARIA) {
    return {
      isAuthenticated: true,
      role: 'secretaria',
      label: 'Secretaria Acadêmica & Matrículas',
    };
  }

  if (cleanCode === LOCAL_AUTH_CODES.DOCENTES) {
    return {
      isAuthenticated: true,
      role: 'docente',
      label: 'Corpo Docente & Lançamento de Notas',
    };
  }

  return null;
}

const TRIAL_STORAGE_KEY = 'asde_student_trial_start';
const TRIAL_DURATION_DAYS = 7;

/**
 * Obtém ou inicializa a sessão de degustação (trial de 7 dias) para quem não tem código de inscrição.
 */
export function getOrCreateStudentTrial(): {
  trialStartDate: string;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
} {
  let startDateStr = localStorage.getItem(TRIAL_STORAGE_KEY);
  if (!startDateStr) {
    startDateStr = new Date().toISOString();
    localStorage.setItem(TRIAL_STORAGE_KEY, startDateStr);
  }

  const startDate = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const remaining = Math.max(0, TRIAL_DURATION_DAYS - diffDays);
  const expired = diffDays >= TRIAL_DURATION_DAYS;

  return {
    trialStartDate: startDateStr,
    trialDaysRemaining: remaining,
    isTrialExpired: expired,
  };
}

export function resetStudentTrial(): void {
  localStorage.removeItem(TRIAL_STORAGE_KEY);
}
