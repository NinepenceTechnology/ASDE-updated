import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  ClassGroup,
  ClassSession,
  FinancialInvoice,
  AppUnit,
  SchoolNotice,
  AppLesson,
  StudentGradeRecord,
  AttendanceEntry,
  Course,
  StaffUser,
  StudentBadge,
  CommunicationLog,
  CEFRLevel,
  CFPAuthSession,
  StudentAuthSession,
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_APP_UNITS,
  INITIAL_INVOICES,
  INITIAL_SESSIONS,
  INITIAL_NOTICES,
  INITIAL_COURSES,
  INITIAL_STAFF_USERS,
  INITIAL_BADGES,
  INITIAL_COMMUNICATION_LOGS,
} from '../data/initialData';
import {
  validateCFPCode,
  getOrCreateStudentTrial,
} from '../utils/authCodes';

export type AdminSection =
  | 'dashboard'
  | 'students'
  | 'level_evaluator'
  | 'courses'
  | 'classes'
  | 'attendance'
  | 'grades'
  | 'finance'
  | 'administration'
  | 'communication'
  | 'app_manager'
  | 'video_call';

export type StudentTab =
  | 'learn'
  | 'exercises'
  | 'ai_tutor'
  | 'speech_lab'
  | 'roleplay'
  | 'flashcards'
  | 'gamification'
  | 'school_hub'
  | 'ranking'
  | 'video_call';

interface AppContextType {
  // Navigation & View Mode
  viewMode: 'admin' | 'student';
  setViewMode: (mode: 'admin' | 'student') => void;
  adminSection: AdminSection;
  setAdminSection: (section: AdminSection) => void;
  studentTab: StudentTab;
  setStudentTab: (tab: StudentTab) => void;

  // Active Student for App Experience
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeStudent: Student;

  // Core Data
  students: Student[];
  teachers: Teacher[];
  classes: ClassGroup[];
  courses: Course[];
  staffUsers: StaffUser[];
  communicationLogs: CommunicationLog[];
  badges: StudentBadge[];
  units: AppUnit[];
  invoices: FinancialInvoice[];
  sessions: ClassSession[];
  notices: SchoolNotice[];

  // Mutations
  addStudent: (studentData: Omit<Student, 'id' | 'enrollmentCode' | 'appProgress' | 'grades' | 'pendingHomeworkCount' | 'enrolledAt'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addClassGroup: (classData: Omit<ClassGroup, 'id' | 'currentEnrollments' | 'syllabusProgress' | 'studentIds'>) => void;
  updateClassGroup: (cls: ClassGroup) => void;
  deleteClassGroup: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'activeClassesCount' | 'rating'>) => void;

  // Courses & Disciplines
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;

  // Staff Administration
  updateStaffPermissions: (userId: string, permissions: StaffUser['permissions']) => void;
  updateStaffUser: (user: StaffUser) => void;

  // Communication
  sendCommunication: (log: Omit<CommunicationLog, 'id' | 'sentAt' | 'status'>) => void;
  addNotice: (notice: Omit<SchoolNotice, 'id' | 'date'>) => void;

  // Academic & Attendance
  saveAttendanceSession: (session: { classId: string; date: string; topic: string; summary: string; homeworkAssigned?: string; records: AttendanceEntry[] }) => void;
  addStudentGrade: (studentId: string, grade: Omit<StudentGradeRecord, 'id' | 'overall'>) => void;

  // Finance
  markInvoicePaid: (invoiceId: string, method?: string) => void;
  createInvoice: (invoice: Omit<FinancialInvoice, 'id'>) => void;

  // App Sync & Student Learning
  completeStudentLesson: (studentId: string, lessonId: string, xpEarned: number) => void;
  updateStudentSpeechScore: (studentId: string, accuracy: number) => void;
  addNewLessonToUnit: (unitId: string, lesson: Omit<AppLesson, 'id' | 'unitId'>) => void;

  // Utility
  resetAllData: () => void;
  mobilePreviewFrame: boolean;
  setMobilePreviewFrame: (val: boolean) => void;

  // Video Call & Virtual Rooms
  activeVideoRoomId: string;
  setActiveVideoRoomId: (roomId: string) => void;
  openVideoRoom: (roomId?: string, forceMode?: 'admin' | 'student') => void;

  // Portal Gate & Local Authentication
  portalGateOpen: boolean;
  setPortalGateOpen: (open: boolean) => void;
  cfpAuth: CFPAuthSession | null;
  studentAuth: StudentAuthSession;
  authenticateCFP: (code: string) => { success: boolean; message: string };
  authenticateStudentCode: (code: string) => { success: boolean; message: string };
  startStudentTrial: () => void;
  logoutPortal: () => void;
  registerStudentProfile: (profile: {
    name: string;
    avatar: string;
    level: CEFRLevel;
    enrollmentCode?: string;
  }) => void;
}

const STORAGE_KEY = 'linguabridge_academy_data_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'admin' | 'student'>('admin');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [studentTab, setStudentTab] = useState<StudentTab>('learn');
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-1');
  const [mobilePreviewFrame, setMobilePreviewFrame] = useState<boolean>(false);
  const [activeVideoRoomId, setActiveVideoRoomId] = useState<string>('cls-1');

  // Portal Gate & Local Auth States
  const [portalGateOpen, setPortalGateOpen] = useState<boolean>(() => {
    try {
      const savedCFP = sessionStorage.getItem('asde_cfp_auth');
      const savedStu = sessionStorage.getItem('asde_student_auth');
      if (savedCFP || savedStu) return false;
      return true; // Requisito: Iniciar com tela dos dois botões CFP - ASDE e FORMANDO
    } catch {
      return true;
    }
  });

  const [cfpAuth, setCfpAuth] = useState<CFPAuthSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('asde_cfp_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [studentAuth, setStudentAuth] = useState<StudentAuthSession>(() => {
    try {
      const saved = sessionStorage.getItem('asde_student_auth');
      if (saved) return JSON.parse(saved);
    } catch {}
    const trial = getOrCreateStudentTrial();
    return {
      isAuthenticated: false,
      isEnrolledCode: false,
      isTrial: true,
      trialDaysRemaining: trial.trialDaysRemaining,
      isTrialExpired: trial.isTrialExpired,
      trialStartDate: trial.trialStartDate,
    };
  });

  // Entities state
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teachers`);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
      return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
    } catch {
      return INITIAL_STAFF_USERS;
    }
  });

  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_comms`);
      return saved ? JSON.parse(saved) : INITIAL_COMMUNICATION_LOGS;
    } catch {
      return INITIAL_COMMUNICATION_LOGS;
    }
  });

  const [badges] = useState<StudentBadge[]>(INITIAL_BADGES);

  const [units, setUnits] = useState<AppUnit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_units`);
      return saved ? JSON.parse(saved) : INITIAL_APP_UNITS;
    } catch {
      return INITIAL_APP_UNITS;
    }
  });

  const [invoices, setInvoices] = useState<FinancialInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [sessions, setSessions] = useState<ClassSession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [notices, setNotices] = useState<SchoolNotice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
      localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staffUsers));
      localStorage.setItem(`${STORAGE_KEY}_comms`, JSON.stringify(communicationLogs));
      localStorage.setItem(`${STORAGE_KEY}_units`, JSON.stringify(units));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(sessions));
      localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [students, teachers, classes, courses, staffUsers, communicationLogs, units, invoices, sessions, notices]);

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0] || INITIAL_STUDENTS[0];

  // Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'enrollmentCode' | 'appProgress' | 'grades' | 'pendingHomeworkCount' | 'enrolledAt'>) => {
    const newId = `stu-${Date.now()}`;
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `LB-${year}-${randomNum}`;
    
    const newStudent: Student = {
      ...studentData,
      id: newId,
      enrollmentCode: code,
      enrolledAt: new Date().toLocaleDateString('pt-PT'),
      pendingHomeworkCount: 0,
      appProgress: {
        xp: 0,
        streakDays: 1,
        lastActiveDate: 'Hoje',
        completedLessonIds: [],
        vocabularyMastered: 0,
        speakingAccuracyAvg: 0,
        currentUnitId: units[0]?.id || 'u-1',
        hoursStudied: 0,
        exercisesAverageScore: 0,
        exercisesCompletedCount: 0,
      },
      grades: [],
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Add invoice for first tuition
    const newInvoice: FinancialInvoice = {
      id: `inv-${Date.now()}`,
      studentId: newId,
      studentName: newStudent.name,
      description: `Matrícula & Mensalidade Inicial - ${newStudent.level}`,
      amount: newStudent.tuitionValue,
      dueDate: new Date(Date.now() + 10 * 86400000).toLocaleDateString('pt-PT'),
      status: 'pending',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Update class enrollment count
    if (newStudent.classId) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === newStudent.classId
            ? {
                ...c,
                currentEnrollments: c.currentEnrollments + 1,
                studentIds: [...c.studentIds, newId],
              }
            : c
        )
      );
    }
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setInvoices((prev) => prev.filter((inv) => inv.studentId !== id));
    setClasses((prev) =>
      prev.map((c) => ({
        ...c,
        studentIds: c.studentIds.filter((sid) => sid !== id),
        currentEnrollments: Math.max(0, c.studentIds.filter((sid) => sid !== id).length),
      }))
    );
  };

  const addClassGroup = (classData: Omit<ClassGroup, 'id' | 'currentEnrollments' | 'syllabusProgress' | 'studentIds'>) => {
    const newClass: ClassGroup = {
      ...classData,
      id: `cls-${Date.now()}`,
      currentEnrollments: 0,
      syllabusProgress: 0,
      studentIds: [],
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClassGroup = (cls: ClassGroup) => {
    setClasses((prev) => prev.map((c) => (c.id === cls.id ? cls : c)));
  };

  const deleteClassGroup = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'activeClassesCount' | 'rating'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
      activeClassesCount: 0,
      rating: 5.0,
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const saveAttendanceSession = (sessionData: {
    classId: string;
    date: string;
    topic: string;
    summary: string;
    homeworkAssigned?: string;
    records: AttendanceEntry[];
  }) => {
    const newSession: ClassSession = {
      id: `ses-${Date.now()}`,
      classId: sessionData.classId,
      date: sessionData.date,
      topic: sessionData.topic,
      summary: sessionData.summary,
      homeworkAssigned: sessionData.homeworkAssigned,
      attendance: sessionData.records,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Recalculate student attendance percentages
    setStudents((prev) =>
      prev.map((student) => {
        const studentRecord = sessionData.records.find((r) => r.studentId === student.id);
        if (!studentRecord) return student;

        // Calculate based on all sessions for this student
        const studentPastSessions = [
          ...sessions.filter((s) => s.attendance.some((a) => a.studentId === student.id)),
          newSession,
        ];
        
        let total = 0;
        let presentCount = 0;

        studentPastSessions.forEach((sess) => {
          const rec = sess.attendance.find((a) => a.studentId === student.id);
          if (rec) {
            total++;
            if (rec.status === 'present' || rec.status === 'justified') {
              presentCount++;
            }
          }
        });

        const newAttendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;
        return {
          ...student,
          attendancePercent: newAttendanceRate,
          pendingHomeworkCount: sessionData.homeworkAssigned ? student.pendingHomeworkCount + 1 : student.pendingHomeworkCount,
        };
      })
    );
  };

  const addStudentGrade = (studentId: string, gradeData: Omit<StudentGradeRecord, 'id' | 'overall'>) => {
    const overall = Math.round(
      (gradeData.speaking * 0.3 +
        gradeData.listening * 0.2 +
        gradeData.reading * 0.2 +
        gradeData.writing * 0.15 +
        gradeData.grammar * 0.15)
    );

    const newRecord: StudentGradeRecord = {
      ...gradeData,
      id: `grd-${Date.now()}`,
      overall,
    };

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, grades: [newRecord, ...s.grades] } : s))
    );
  };

  const markInvoicePaid = (invoiceId: string, method: string = 'Transferência BIM') => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              paidDate: new Date().toLocaleDateString('pt-PT'),
              method: method as any,
            }
          : inv
      )
    );

    // Update student tuition status if all invoices are paid
    const targetInvoice = invoices.find((i) => i.id === invoiceId);
    if (targetInvoice) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === targetInvoice.studentId ? { ...s, tuitionStatus: 'paid' } : s
        )
      );
    }
  };

  const createInvoice = (invoiceData: Omit<FinancialInvoice, 'id'>) => {
    const newInv: FinancialInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
    };
    setInvoices((prev) => [newInv, ...prev]);
  };

  const completeStudentLesson = (studentId: string, lessonId: string, xpEarned: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const alreadyDone = s.appProgress.completedLessonIds.includes(lessonId);
        const newCompleted = alreadyDone
          ? s.appProgress.completedLessonIds
          : [...s.appProgress.completedLessonIds, lessonId];
        const newXp = s.appProgress.xp + (alreadyDone ? Math.round(xpEarned * 0.2) : xpEarned);

        return {
          ...s,
          appProgress: {
            ...s.appProgress,
            xp: newXp,
            completedLessonIds: newCompleted,
            vocabularyMastered: s.appProgress.vocabularyMastered + 4,
            lastActiveDate: 'Agora',
          },
        };
      })
    );
  };

  const updateStudentSpeechScore = (studentId: string, accuracy: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentAvg = s.appProgress.speakingAccuracyAvg || 80;
        const newAvg = Math.round((currentAvg * 0.7 + accuracy * 0.3));
        return {
          ...s,
          appProgress: {
            ...s.appProgress,
            speakingAccuracyAvg: newAvg,
            xp: s.appProgress.xp + 15,
          },
        };
      })
    );
  };

  const addNewLessonToUnit = (unitId: string, lessonData: Omit<AppLesson, 'id' | 'unitId'>) => {
    const newLesson: AppLesson = {
      ...lessonData,
      id: `les-${Date.now()}`,
      unitId,
    };

    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, lessons: [...u.lessons, newLesson] } : u))
    );
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = (course: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === course.id ? course : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateStaffPermissions = (userId: string, permissions: StaffUser['permissions']) => {
    setStaffUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions } : u))
    );
  };

  const updateStaffUser = (user: StaffUser) => {
    setStaffUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  };

  const sendCommunication = (logData: Omit<CommunicationLog, 'id' | 'sentAt' | 'status'>) => {
    const newLog: CommunicationLog = {
      ...logData,
      id: `com-${Date.now()}`,
      sentAt: `Hoje às ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'delivered',
    };
    setCommunicationLogs((prev) => [newLog, ...prev]);
  };

  const addNotice = (noticeData: Omit<SchoolNotice, 'id' | 'date'>) => {
    const newNotice: SchoolNotice = {
      ...noticeData,
      id: `not-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-PT'),
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const authenticateCFP = (code: string): { success: boolean; message: string } => {
    const session = validateCFPCode(code);
    if (!session) {
      return {
        success: false,
        message: 'Código de acesso CFP - ASDE incorreto. Verifique o código correspondente à sua função.',
      };
    }
    setCfpAuth(session);
    try {
      sessionStorage.setItem('asde_cfp_auth', JSON.stringify(session));
    } catch {}

    setViewMode('admin');
    if (session.role === 'secretaria') {
      setAdminSection('students');
    } else if (session.role === 'docente') {
      setAdminSection('level_evaluator');
    } else {
      setAdminSection('dashboard');
    }
    setPortalGateOpen(false);
    return {
      success: true,
      message: `Acesso liberado com sucesso: ${session.label}.`,
    };
  };

  const authenticateStudentCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return {
        success: false,
        message: 'Por favor, digite o seu código de inscrição do CFP ASDE.',
      };
    }

    const matched = students.find((s) => s.enrollmentCode.trim().toUpperCase() === clean);
    if (matched) {
      setActiveStudentId(matched.id);
    }

    const session: StudentAuthSession = {
      isAuthenticated: true,
      isEnrolledCode: true,
      enrollmentCode: clean,
      isTrial: false,
      trialDaysRemaining: 999,
      isTrialExpired: false,
    };
    setStudentAuth(session);
    try {
      sessionStorage.setItem('asde_student_auth', JSON.stringify(session));
    } catch {}
    setViewMode('student');
    setPortalGateOpen(false);
    return {
      success: true,
      message: 'Código de inscrição ASDE validado! Acesso ilimitado liberado.',
    };
  };

  const startStudentTrial = () => {
    const trial = getOrCreateStudentTrial();
    const session: StudentAuthSession = {
      isAuthenticated: true,
      isEnrolledCode: false,
      isTrial: true,
      trialDaysRemaining: trial.trialDaysRemaining,
      isTrialExpired: trial.isTrialExpired,
      trialStartDate: trial.trialStartDate,
    };
    setStudentAuth(session);
    try {
      sessionStorage.setItem('asde_student_auth', JSON.stringify(session));
    } catch {}
    setViewMode('student');
    setPortalGateOpen(false);
  };

  const logoutPortal = () => {
    try {
      sessionStorage.removeItem('asde_cfp_auth');
      sessionStorage.removeItem('asde_student_auth');
    } catch {}
    setCfpAuth(null);
    setPortalGateOpen(true);
  };

  const registerStudentProfile = (profile: {
    name: string;
    avatar: string;
    level: CEFRLevel;
    enrollmentCode?: string;
  }) => {
    const hasCode = !!(profile.enrollmentCode && profile.enrollmentCode.trim());
    const validCode = hasCode
      ? profile.enrollmentCode!.trim().toUpperCase()
      : `ASDE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const current = students.find((s) => s.id === activeStudentId);
    if (current) {
      const updated: Student = {
        ...current,
        name: profile.name,
        avatar: profile.avatar || current.avatar,
        level: profile.level,
        enrollmentCode: hasCode ? validCode : current.enrollmentCode,
      };
      updateStudent(updated);
    } else {
      addStudent({
        name: profile.name,
        email: `${profile.name.toLowerCase().replace(/\s+/g, '.')}@asde.edu`,
        phone: '+244 923 000 000',
        level: profile.level,
        targetGoal: `Formação em Inglês ASDE - Nível ${profile.level}`,
        classId: classes[0]?.id || 'cls-1',
        className: classes[0]?.name || 'Turma ASDE',
        status: hasCode ? 'active' : 'trial',
        tuitionStatus: 'paid',
        tuitionValue: 480,
        attendancePercent: 100,
        avatar: profile.avatar,
      });
    }

    if (hasCode) {
      setStudentAuth({
        isAuthenticated: true,
        isEnrolledCode: true,
        enrollmentCode: validCode,
        isTrial: false,
        trialDaysRemaining: 999,
        isTrialExpired: false,
      });
      try {
        sessionStorage.setItem(
          'asde_student_auth',
          JSON.stringify({
            isAuthenticated: true,
            isEnrolledCode: true,
            enrollmentCode: validCode,
            isTrial: false,
            trialDaysRemaining: 999,
            isTrialExpired: false,
          })
        );
      } catch {}
    } else {
      startStudentTrial();
    }
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_teachers`);
    localStorage.removeItem(`${STORAGE_KEY}_classes`);
    localStorage.removeItem(`${STORAGE_KEY}_courses`);
    localStorage.removeItem(`${STORAGE_KEY}_staff`);
    localStorage.removeItem(`${STORAGE_KEY}_comms`);
    localStorage.removeItem(`${STORAGE_KEY}_units`);
    localStorage.removeItem(`${STORAGE_KEY}_invoices`);
    localStorage.removeItem(`${STORAGE_KEY}_sessions`);
    localStorage.removeItem(`${STORAGE_KEY}_notices`);

    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setClasses(INITIAL_CLASSES);
    setCourses(INITIAL_COURSES);
    setStaffUsers(INITIAL_STAFF_USERS);
    setCommunicationLogs(INITIAL_COMMUNICATION_LOGS);
    setUnits(INITIAL_APP_UNITS);
    setInvoices(INITIAL_INVOICES);
    setSessions(INITIAL_SESSIONS);
    setNotices(INITIAL_NOTICES);
    setActiveStudentId('stu-1');
  };

  const openVideoRoom = (roomId?: string, forceMode?: 'admin' | 'student') => {
    if (roomId) {
      setActiveVideoRoomId(roomId);
    } else {
      if (viewMode === 'student' && activeStudent?.classId) {
        setActiveVideoRoomId(activeStudent.classId);
      } else {
        setActiveVideoRoomId(classes[0]?.id || 'general');
      }
    }

    if (forceMode === 'admin' || (!forceMode && viewMode === 'admin')) {
      setViewMode('admin');
      setAdminSection('video_call');
    } else {
      setViewMode('student');
      setStudentTab('video_call');
    }
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        adminSection,
        setAdminSection,
        studentTab,
        setStudentTab,
        activeStudentId,
        setActiveStudentId,
        activeStudent,
        students,
        teachers,
        classes,
        courses,
        staffUsers,
        communicationLogs,
        badges,
        units,
        invoices,
        sessions,
        notices,
        addStudent,
        updateStudent,
        deleteStudent,
        addClassGroup,
        updateClassGroup,
        deleteClassGroup,
        addTeacher,
        addCourse,
        updateCourse,
        deleteCourse,
        updateStaffPermissions,
        updateStaffUser,
        sendCommunication,
        addNotice,
        saveAttendanceSession,
        addStudentGrade,
        markInvoicePaid,
        createInvoice,
        completeStudentLesson,
        updateStudentSpeechScore,
        addNewLessonToUnit,
        resetAllData,
        mobilePreviewFrame,
        setMobilePreviewFrame,
        activeVideoRoomId,
        setActiveVideoRoomId,
        openVideoRoom,
        portalGateOpen,
        setPortalGateOpen,
        cfpAuth,
        studentAuth,
        authenticateCFP,
        authenticateStudentCode,
        startStudentTrial,
        logoutPortal,
        registerStudentProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
