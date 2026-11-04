export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CFPRole = 'admin_ceo' | 'secretaria' | 'docente' | 'cfp_geral';

export interface CFPAuthSession {
  isAuthenticated: boolean;
  role: CFPRole;
  label: string;
}

export interface StudentAuthSession {
  isAuthenticated: boolean;
  isEnrolledCode: boolean;
  enrollmentCode?: string;
  isTrial: boolean;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  trialStartDate?: string;
}

export interface CEFRLevelDetails {
  level: CEFRLevel;
  category: 'Principiante' | 'Básico' | 'Intermediário' | 'Independente' | 'Avançado' | 'Proficiência';
  name: string;
  englishName: string;
  ieltsBand: string;
  ieltsBandRange: [number, number];
  description: string;
  badgeColor: string;
}

export const CEFR_IELTS_MAP: Record<CEFRLevel, CEFRLevelDetails> = {
  A1: {
    level: 'A1',
    category: 'Principiante',
    name: 'Principiante',
    englishName: 'Beginner / Breakthrough',
    ieltsBand: 'IELTS 2.0 - 3.0',
    ieltsBandRange: [2.0, 3.0],
    description: 'Compreensão de vocabulário familiar, apresentações e frases cotidianas básicas.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  A2: {
    level: 'A2',
    category: 'Básico',
    name: 'Básico',
    englishName: 'Elementary / Waystage',
    ieltsBand: 'IELTS 3.5 - 4.0',
    ieltsBandRange: [3.5, 4.0],
    description: 'Comunicação em tarefas rotineiras, trocas diretas de informações sobre temas imediatos.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  B1: {
    level: 'B1',
    category: 'Intermediário',
    name: 'Intermediário',
    englishName: 'Intermediate / Threshold',
    ieltsBand: 'IELTS 4.5 - 5.0',
    ieltsBandRange: [4.5, 5.0],
    description: 'Compreensão dos pontos principais sobre assuntos conhecidos (trabalho, viagens, estudos).',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
  },
  B2: {
    level: 'B2',
    category: 'Independente',
    name: 'Independente',
    englishName: 'Upper-Intermediate / Vantage',
    ieltsBand: 'IELTS 5.5 - 6.5',
    ieltsBandRange: [5.5, 6.5],
    description: 'Fluência e espontaneidade com falantes nativos sem grande tensão mútua.',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
  },
  C1: {
    level: 'C1',
    category: 'Avançado',
    name: 'Avançado',
    englishName: 'Advanced / Effective Proficiency',
    ieltsBand: 'IELTS 7.0 - 8.0',
    ieltsBandRange: [7.0, 8.0],
    description: 'Expressão fluente e flexível para fins sociais, acadêmicos e profissionais sofisticados.',
    badgeColor: 'bg-emerald-200 text-emerald-900 border-emerald-400',
  },
  C2: {
    level: 'C2',
    category: 'Proficiência',
    name: 'Proficiência',
    englishName: 'Mastery / Near-Native',
    ieltsBand: 'IELTS 8.5 - 9.0',
    ieltsBandRange: [8.5, 9.0],
    description: 'Compreensão com extrema facilidade de praticamente tudo o que ouve ou lê.',
    badgeColor: 'bg-emerald-900 text-emerald-100 border-emerald-700',
  },
};

export interface StudentGradeRecord {
  id: string;
  term: string; // e.g. "Bimestre 1 - 2025"
  date: string;
  speaking: number; // 0 - 100
  listening: number;
  reading: number;
  writing: number;
  grammar: number;
  overall: number;
  teacherFeedback: string;
  evaluatorTeacherId: string;

  // App Exposure & Exercise Performance (Requisito Especial ASDE)
  appExposureHours: number; // Horas de exposição e atividade no aplicativo
  appExercisesScore: number; // Nota de avaliação dos exercícios no app (0 - 100)
  appCompletedExercisesCount?: number;
  ieltsEquivalentBand?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentCode: string;
  avatar: string;
  level: CEFRLevel;
  targetGoal: string; // e.g., "Fluência Profissional", "Viagens", "Certificação IELTS"
  classId: string;
  className: string;
  status: 'active' | 'inactive' | 'graduated' | 'trial';
  tuitionStatus: 'paid' | 'pending' | 'overdue';
  tuitionValue: number; // Meticais (MT / MZN)
  attendancePercent: number;
  biNumber?: string; // B.I. Moçambicano (ex: 070100345678B)
  nuit?: string; // NUIT Fiscal de Moçambique (9 dígitos)
  province?: string; // Província (Sofala, Maputo, etc.)
  
  // App Progress Sync & Competition Metrics
  appProgress: {
    xp: number;
    streakDays: number;
    lastActiveDate: string;
    completedLessonIds: string[];
    vocabularyMastered: number;
    speakingAccuracyAvg: number;
    currentUnitId: string;
    badges?: string[];
    hoursStudied: number; // Horas de exposição no aplicativo
    exercisesAverageScore: number; // Nota média nos exercícios do app (0-100)
    exercisesCompletedCount: number; // Quantidade de exercícios finalizados
  };

  // Academic Records
  grades: StudentGradeRecord[];
  pendingHomeworkCount: number;
  notes?: string;
  enrolledAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  accent: 'American' | 'British' | 'Canadian' | 'Australian';
  certifications: string[]; // e.g. ["CELTA Cambridge", "TOEFL Trainer"]
  specialties: string[];
  activeClassesCount: number;
  rating: number;
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  level: CEFRLevel;
  teacherId: string;
  teacherName: string;
  schedule: string; // "Segunda e Quarta • 19:00 - 20:30"
  room: string;
  modality: 'Presencial' | 'Online Ao Vivo' | 'Híbrido';
  capacity: number;
  currentEnrollments: number;
  syllabusProgress: number; // 0 - 100
  currentUnit: string;
  status: 'active' | 'upcoming' | 'finished';
  studentIds: string[];
}

export interface AttendanceEntry {
  studentId: string;
  status: 'present' | 'absent' | 'justified';
  notes?: string;
}

export interface ClassSession {
  id: string;
  classId: string;
  date: string;
  topic: string;
  summary: string;
  homeworkAssigned?: string;
  attendance: AttendanceEntry[];
}

export interface FinancialInvoice {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  method?: 'Transferência BIM' | 'Depósito Bancário' | 'M-Pesa' | 'E-Mola' | 'Espécie' | 'POS';
  bankReference?: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  nib: string;
  holderName: string;
  currency: string;
}

export interface InstitutionalProfileData {
  name: string;
  acronym: string;
  slogan: string;
  nuit: string;
  city: string;
  address: string;
  contacts: string[];
  whatsappContact: string;
  email: string;
  bankDetails: BankAccountDetails;
  foundedYear: number;
  history: string;
  mission: string;
  vision: string;
  values: Array<{ title: string; description: string }>;
  areas: Array<{ title: string; description: string; tag: string }>;
  successCases: Array<{ partner: string; course: string; description: string }>;
}

// App Curriculum Types
export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'pronunciation' | 'listening';
  prompt: string;
  explanation: string;
  options?: string[];
  correctAnswer: string;
  audioVoiceText?: string;
  hint?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface DialogueExchange {
  id: string;
  speaker: string;
  speakerRole: 'partner' | 'user';
  text: string;
  translation: string;
  suggestedReplyTips?: string[];
}

export interface AppLesson {
  id: string;
  unitId: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  level: CEFRLevel;
  estimatedMinutes: number;
  xpValue: number;
  grammarFocus: string;
  videoData?: {
    title: string;
    duration: string;
    youtubeId?: string;
    keyTakeaways: string[];
    transcript: string;
  };
  vocabulary: VocabularyWord[];
  dialogue?: DialogueExchange[];
  pronunciationPrompts: {
    phrase: string;
    phoneticTips: string;
    translation: string;
    context: string;
  }[];
  questions: QuizQuestion[];
}

export interface AppUnit {
  id: string;
  number: number;
  title: string;
  description: string;
  level: CEFRLevel;
  icon: string;
  lessons: AppLesson[];
}

export interface Discipline {
  id: string;
  name: string;
  code: string;
  workloadHours: number;
  teacherName: string;
  description: string;
}

export type CourseCategory = 
  | 'languages' 
  | 'tech' 
  | 'management' 
  | 'industry' 
  | 'tutoring' 
  | 'translation' 
  | 'corporate';

export interface Course {
  id: string;
  name: string;
  code: string;
  category?: CourseCategory;
  level: CEFRLevel | string;
  totalWorkloadHours: number;
  durationMonths: number;
  description: string;
  disciplines: Discipline[];
  objectives: string[];
  certificationBadge?: string;
  tuitionMonthlyMT?: number;
}

export type StaffRole = 'director' | 'coordinator' | 'teacher' | 'secretary' | 'finance';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  avatar: string;
  status: 'active' | 'inactive';
  permissions: {
    canManageStudents: boolean;
    canManageCourses: boolean;
    canManageGrades: boolean;
    canManageFinance: boolean;
    canManageTeam: boolean;
    canExportReports: boolean;
    canBroadcastNotices: boolean;
  };
  lastLogin: string;
}

export interface CommunicationLog {
  id: string;
  studentId?: string;
  studentName: string;
  channel: 'whatsapp' | 'email' | 'internal';
  type: 'tuition_reminder' | 'grade_report' | 'absence_alert' | 'general_notice' | 'welcome';
  subject: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered';
}

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'speaking' | 'streak' | 'xp' | 'quizzes' | 'special';
  requiredCount: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  audioVoiceText?: string;
  grammarTip?: string;
  vocabularyBoost?: string[];
}

export interface SchoolNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  target: 'all' | 'students' | 'teachers';
  priority: 'normal' | 'important';
}

