import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  Hand,
  Users,
  MessageSquare,
  PhoneOff,
  PenTool,
  Volume2,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronDown,
  Maximize2,
  Minimize2,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  Award,
} from 'lucide-react';
import { UserPhoto } from '../common/UserPhoto';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { playEnglishAudio } from '../../utils/speech';
import { CEFRLevel, VideoRoomType } from '../../types';

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'teacher' | 'student' | 'staff';
  text: string;
  time: string;
  isVocabulary?: boolean;
}

export const VideoCallHub: React.FC = () => {
  const {
    viewMode,
    classes,
    teachers,
    students,
    activeStudent,
    cfpAuth,
    activeVideoRoomId,
    setActiveVideoRoomId,
    saveAttendanceSession,
  } = useApp();

  // Active room category: 'class' | 'general' | 'staff' | 'level'
  const [roomCategory, setRoomCategory] = useState<VideoRoomType>(() => {
    if (activeVideoRoomId === 'general') return 'general';
    if (activeVideoRoomId === 'staff') return 'staff';
    if (activeVideoRoomId.startsWith('level-')) return 'level';
    return 'class';
  });

  // Selected Class ID for class-specific room
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    if (activeVideoRoomId && !['general', 'staff'].includes(activeVideoRoomId) && !activeVideoRoomId.startsWith('level-')) {
      return activeVideoRoomId;
    }
    // If student has a class, default to their class
    if (viewMode === 'student' && activeStudent?.classId) {
      return activeStudent.classId;
    }
    return classes[0]?.id || 'cls-1';
  });

  // Selected Level for Level-based Conversation Club
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(() => {
    if (activeVideoRoomId.startsWith('level-')) {
      return (activeVideoRoomId.replace('level-', '') as CEFRLevel) || 'B1';
    }
    return activeStudent?.level || 'B1';
  });

  // Media States
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'grid' | 'spotlight'>('grid');
  const [activeSideTab, setActiveSideTab] = useState<'roster' | 'chat' | 'poll' | null>('roster');
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(315); // e.g. 5m 15s in session
  const [attendanceSavedToast, setAttendanceSavedToast] = useState<boolean>(false);

  // Video Streams
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Chat input
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      senderName: 'Prof. Sarah Jenkins',
      senderRole: 'teacher',
      text: 'Good morning everyone! Welcome to today\'s live oral interactive session. Please prepare your questions regarding Phrasal Verbs.',
      time: '09:02',
    },
    {
      id: 'm-2',
      senderName: 'Armando Manuel Sitoe',
      senderRole: 'student',
      text: 'Good morning Teacher Sarah! Could you explain the difference between "bring up" and "bring about"?',
      time: '09:04',
      isVocabulary: true,
    },
  ]);

  // Quick Poll State
  const [pollQuestion, setPollQuestion] = useState({
    title: 'Compreensão de Gramática: Usamos "Used to" para hábitos no passado?',
    options: [
      { id: 'opt-1', label: 'Sim, totalmente claro! (Yes, clear)', votes: 6 },
      { id: 'opt-2', label: 'Tenho algumas dúvidas na pronúncia', votes: 2 },
    ],
    userVoted: false,
  });

  // Selected Class details
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const currentTeacher = teachers.find((t) => t.id === currentClass?.teacherId) || teachers[0];

  // Actual Students roster belonging to this specific class
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  // Simulated connected participants based on room type
  const participantsList = React.useMemo(() => {
    if (roomCategory === 'class') {
      return [
        {
          id: currentTeacher?.id || 't-host',
          name: currentTeacher ? `${currentTeacher.name} (Professor Responsável)` : 'Corpo Docente CFPA',
          role: 'teacher' as const,
          avatar: currentTeacher?.avatar || '',
          className: currentClass?.name,
          isMuted: false,
          isVideoOn: true,
          isHandRaised: false,
          isSpeaking: true,
          isHost: true,
        },
        ...classStudents.map((st, idx) => ({
          id: st.id,
          name: st.name,
          role: 'student' as const,
          avatar: st.avatar,
          level: st.level,
          className: st.className,
          isMuted: idx % 3 === 0,
          isVideoOn: idx % 4 !== 0,
          isHandRaised: idx === 1,
          isSpeaking: idx === 2,
          isHost: false,
        })),
      ];
    } else if (roomCategory === 'staff') {
      return [
        {
          id: 'staff-dir',
          name: 'Dr. David Alistair Ward (Direção Geral CFPA)',
          role: 'teacher' as const,
          avatar: '',
          isMuted: false,
          isVideoOn: true,
          isHandRaised: false,
          isSpeaking: true,
          isHost: true,
        },
        {
          id: 'staff-coord',
          name: 'Sarah Jenkins, M.Ed. (Coordenação Pedagógica)',
          role: 'teacher' as const,
          avatar: '',
          isMuted: false,
          isVideoOn: true,
          isHandRaised: false,
          isSpeaking: false,
          isHost: false,
        },
        {
          id: 'staff-sec',
          name: 'Secretaria Acadêmica & Registros Beira',
          role: 'staff' as const,
          avatar: '',
          isMuted: true,
          isVideoOn: true,
          isHandRaised: false,
          isSpeaking: false,
          isHost: false,
        },
      ];
    } else if (roomCategory === 'level') {
      // Students with this CEFR level
      const levelStudents = students.filter((s) => s.level === selectedLevel);
      return [
        {
          id: 't-club-lead',
          name: 'Prof. Mediador de Conversação (' + selectedLevel + ')',
          role: 'teacher' as const,
          avatar: '',
          isMuted: false,
          isVideoOn: true,
          isHandRaised: false,
          isSpeaking: true,
          isHost: true,
        },
        ...levelStudents.map((st, idx) => ({
          id: st.id,
          name: st.name,
          role: 'student' as const,
          avatar: st.avatar,
          level: st.level,
          className: st.className,
          isMuted: idx % 2 === 0,
          isVideoOn: true,
          isHandRaised: idx === 0,
          isSpeaking: false,
          isHost: false,
        })),
      ];
    } else {
      // General All-Hands room
      return [
        {
          id: 'gen-host',
          name: 'Diretoria & Coordenação Geral CFPA',
          role: 'teacher' as const,
          avatar: '',
          isMuted: false,
          isVideoOn: true,
          isHandRaised: false,
          isSpeaking: true,
          isHost: true,
        },
        ...students.slice(0, 10).map((st, idx) => ({
          id: st.id,
          name: st.name,
          role: 'student' as const,
          avatar: st.avatar,
          level: st.level,
          className: st.className,
          isMuted: true,
          isVideoOn: idx % 2 === 0,
          isHandRaised: idx === 2,
          isSpeaking: false,
          isHost: false,
        })),
      ];
    }
  }, [roomCategory, currentClass, currentTeacher, classStudents, selectedLevel, students]);

  // Timer increment
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format call duration MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start / Stop camera stream
  useEffect(() => {
    let active = true;

    const initCamera = async () => {
      if (isVideoOn) {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
              audio: false,
            });
            if (active) {
              mediaStreamRef.current = stream;
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(() => {});
              }
            }
          }
        } catch {
          // Camera permission fallback gracefully handled
        }
      } else {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      }
    };

    initCamera();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideoOn]);

  // Handle Screen Share Toggle
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;
          if (screenShareVideoRef.current) {
            screenShareVideoRef.current.srcObject = stream;
            screenShareVideoRef.current.play().catch(() => {});
          }
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
          setIsScreenSharing(true);
        } else {
          setIsScreenSharing(true);
        }
      } catch {
        setIsScreenSharing(false);
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    }
  };

  // Handle sending chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userDisplayName =
      viewMode === 'admin'
        ? cfpAuth?.label || 'Direção / Docente CFPA'
        : activeStudent?.name || 'Formando ASDE';

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: userDisplayName,
      senderRole: viewMode === 'admin' ? 'teacher' : 'student',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Teacher action: Save automatic attendance from video call into Academic Database
  const handleRegisterAttendance = () => {
    if (!currentClass) return;

    saveAttendanceSession({
      classId: currentClass.id,
      date: new Date().toLocaleDateString('pt-PT'),
      topic: `Aula Online Síncrona via Videochamada • ${currentClass.currentUnit}`,
      summary: `Sessão síncrona de speaking, prática fonética e exercícios orais. Participação ativa de ${classStudents.length} formandos da lista oficial.`,
      homeworkAssigned: 'Revisar vocabulário anotado no Quadro Virtual e praticar no Speech Lab.',
      records: classStudents.map((s) => ({
        studentId: s.id,
        status: 'present',
        notes: 'Presença confirmada e validada em chamada de vídeo ao vivo.',
      })),
    });

    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Video Room Type Switcher & Room Info */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-4 sm:p-6 text-white border-2 border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Videoconferência & Aulas ao Vivo
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-bold font-mono">
                {isRecording ? '● REC ' : ''}{formatTime(callDurationSeconds)}
              </span>
              <span className="text-xs text-emerald-300/80 hidden sm:inline">
                CFPA • Sistema Síncrono de Ensino da Língua Inglesa
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {roomCategory === 'class' && (
                <>
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <span>Aula de Turma: {currentClass?.name}</span>
                </>
              )}
              {roomCategory === 'general' && (
                <>
                  <Building2 className="w-6 h-6 text-emerald-400" />
                  <span>Auditório Geral Institucional • Comunidade CFPA</span>
                </>
              )}
              {roomCategory === 'staff' && (
                <>
                  <Briefcase className="w-6 h-6 text-teal-400" />
                  <span>Reunião de Coordenação Pedagógica & Staff</span>
                </>
              )}
              {roomCategory === 'level' && (
                <>
                  <Award className="w-6 h-6 text-amber-400" />
                  <span>Clube de Conversação & Desinibição: Nível {selectedLevel}</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80">
              {roomCategory === 'class' && (
                <span>
                  Professor(a): <strong>{currentTeacher?.name}</strong> • Turma: <strong>{currentClass?.code}</strong> • {currentClass?.schedule} • {classStudents.length} Alunos Matriculados.
                </span>
              )}
              {roomCategory === 'general' && (
                <span>
                  Espaço síncrono aberto para masterclasses, pronunciamentos da Direção e eventos com toda a comunidade escolar.
                </span>
              )}
              {roomCategory === 'staff' && (
                <span>
                  Ambiente restrito de alinhamento entre Direção, Secretaria e Docentes para pautas pedagógicas e avaliação.
                </span>
              )}
              {roomCategory === 'level' && (
                <span>
                  Grupo de prática de conversação em inglês focado em Speaking & Listening para o nível {selectedLevel}.
                </span>
              )}
            </p>
          </div>

          {/* Quick Attendance / Teacher Host Action */}
          {roomCategory === 'class' && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRegisterAttendance}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                title="Lançar automaticamente a presença dos formandos conectados no Diário de Classe"
              >
                <UserCheck className="w-4 h-4" />
                <span>Validar Presença da Turma</span>
              </button>
            </div>
          )}
        </div>

        {/* Room Category Tabs / Pills (4 Requested Levels) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/80 text-xs font-bold">
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider block sm:inline">
            Salas Disponíveis:
          </span>

          {/* 1. Class Room */}
          <button
            type="button"
            onClick={() => {
              setRoomCategory('class');
              setActiveVideoRoomId(selectedClassId);
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              roomCategory === 'class'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Chamada de Turma (Alunos & Professor)</span>
          </button>

          {/* 2. General Call */}
          <button
            type="button"
            onClick={() => {
              setRoomCategory('general');
              setActiveVideoRoomId('general');
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              roomCategory === 'general'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Chamada Geral (Institucional)</span>
          </button>

          {/* 3. Staff & Teacher Meeting */}
          <button
            type="button"
            onClick={() => {
              setRoomCategory('staff');
              setActiveVideoRoomId('staff');
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              roomCategory === 'staff'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Reunião de Staff & Docentes</span>
          </button>

          {/* 4. Level Conversation Clubs */}
          <button
            type="button"
            onClick={() => {
              setRoomCategory('level');
              setActiveVideoRoomId(`level-${selectedLevel}`);
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              roomCategory === 'level'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Grupos de Conversação por Nível (A1 a C2)</span>
          </button>
        </div>

        {/* Secondary Sub-selector for Class or Level */}
        {roomCategory === 'class' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[11px] text-emerald-300 font-semibold">Seleccionar Turma:</span>
            <div className="flex flex-wrap gap-1.5">
              {classes.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedClassId(c.id);
                    setActiveVideoRoomId(c.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedClassId === c.id
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  {c.name} ({students.filter((s) => s.classId === c.id).length} alunos)
                </button>
              ))}
            </div>
          </div>
        )}

        {roomCategory === 'level' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[11px] text-emerald-300 font-semibold">Nível de Conversação CEFR:</span>
            <div className="flex flex-wrap gap-1.5">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setActiveVideoRoomId(`level-${lvl}`);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  Nível {lvl} ({students.filter((s) => s.level === lvl).length} formandos)
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attendance Saved Toast Alert */}
      {attendanceSavedToast && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>
              <strong>Presença Registada!</strong> O diário de presença da turma <strong>{currentClass?.name}</strong> foi atualizado com sucesso no sistema.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full">
            {classStudents.length} alunos presentes
          </span>
        </div>
      )}

      {/* Main Video Call Area: Video Grid + Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left/Center Column: Video Stage & Controls */}
        <div className={activeSideTab ? 'lg:col-span-8 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Interactive Whiteboard (if toggled) */}
          {isWhiteboardOpen ? (
            <WhiteboardCanvas
              onClose={() => setIsWhiteboardOpen(false)}
              classNameTitle={
                roomCategory === 'class'
                  ? currentClass?.name
                  : roomCategory === 'level'
                  ? `Nível ${selectedLevel} Fluency Lounge`
                  : 'Sessão Plenária CFPA'
              }
              teacherName={currentTeacher?.name}
            />
          ) : isScreenSharing ? (
            /* Screen Sharing Active View */
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-500/50 shadow-2xl h-[420px] sm:h-[480px] flex items-center justify-center">
              <video
                ref={screenShareVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold">
                <MonitorUp className="w-4 h-4 text-emerald-400" />
                <span>Apresentação de Ecrã / Slides do Professor</span>
              </div>

              {/* Floating Camera in Picture-in-Picture */}
              <div className="absolute bottom-4 right-4 w-44 h-32 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 shadow-2xl">
                {isVideoOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2">
                    <UserPhoto
                      name={viewMode === 'admin' ? currentTeacher.name : activeStudent.name}
                      src={viewMode === 'student' ? activeStudent.avatar : ''}
                      size="sm"
                    />
                    <span className="text-[10px] font-bold mt-1 text-slate-300 truncate w-full text-center">
                      Você (Câmera Oculta)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Standard Participant Grid / Mosaic */
            <div className="bg-slate-950 rounded-3xl p-3 sm:p-4 border-2 border-slate-800 shadow-2xl">
              <div
                className={`grid gap-3 ${
                  viewLayout === 'spotlight'
                    ? 'grid-cols-1'
                    : participantsList.length <= 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : participantsList.length <= 4
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {/* 1. Local User Tile */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/80 shadow-md aspect-video flex items-center justify-center group">
                  {isVideoOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-700/80 text-white flex items-center justify-center text-xl font-black shadow-lg">
                        {viewMode === 'admin'
                          ? currentTeacher.name.charAt(0)
                          : activeStudent.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-white mt-2">Câmera Desligada</span>
                      <span className="text-[10px] text-emerald-300">Áudio Ativo</span>
                    </div>
                  )}

                  {/* Tile Overlay Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg text-[11px] font-bold text-white backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="truncate max-w-[120px]">
                      Você ({viewMode === 'admin' ? 'Docente' : 'Formando'})
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {isHandRaised && (
                      <span className="p-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black" title="Mão Levantada">
                        ✋
                      </span>
                    )}
                    <span className={`p-1 rounded-lg text-white ${isMuted ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                      {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

                {/* 2. Remote Participants from the Class List / Room */}
                {participantsList.slice(0, viewLayout === 'spotlight' ? 1 : 8).map((p) => {
                  return (
                    <div
                      key={p.id}
                      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border shadow-md aspect-video flex flex-col items-center justify-center text-center p-3 transition-all ${
                        p.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-slate-800'
                      }`}
                    >
                      {/* Avatar / Photo */}
                      <div className="relative">
                        <UserPhoto
                          name={p.name}
                          src={p.avatar}
                          size="lg"
                          className="shadow-md"
                        />
                        {p.isSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-center w-full px-2">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-emerald-300">
                          {p.role === 'teacher' ? 'Professor(a) • Host' : p.className || `Formando Nível ${p.level || 'B1'}`}
                        </p>
                      </div>

                      {/* Header Overlays on Tile */}
                      <div className="absolute top-2 left-2">
                        {p.isHost && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black uppercase">
                            Host
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {p.isHandRaised && (
                          <span className="p-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black">
                            ✋
                          </span>
                        )}
                        <span className={`p-1 rounded-lg text-white ${p.isMuted ? 'bg-slate-700' : 'bg-emerald-600'}`}>
                          {p.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                        </span>
                      </div>

                      {/* Speaking Audio Wave Animation */}
                      {p.isSpeaking && (
                        <div className="absolute bottom-2 flex items-center gap-1">
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive In-Call Control Bar */}
          <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 border-2 border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-white">
            {/* Left media toggles */}
            <div className="flex items-center gap-2">
              {/* Mic Toggle */}
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-md ${
                  isMuted ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                }`}
                title={isMuted ? 'Ligar Microfone' : 'Silenciar Microfone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="hidden sm:inline">{isMuted ? 'Mutado' : 'Microfone'}</span>
              </button>

              {/* Camera Toggle */}
              <button
                type="button"
                onClick={() => setIsVideoOn((prev) => !prev)}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-md ${
                  !isVideoOn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                }`}
                title={isVideoOn ? 'Desligar Câmera' : 'Ligar Câmera'}
              >
                {!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                <span className="hidden sm:inline">{!isVideoOn ? 'Câmera Off' : 'Câmera'}</span>
              </button>
            </div>

            {/* Center interactive tools */}
            <div className="flex items-center gap-2">
              {/* Screen Share */}
              <button
                type="button"
                onClick={toggleScreenShare}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  isScreenSharing ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Partilhar ecrã ou slides da aula"
              >
                <MonitorUp className="w-5 h-5" />
                <span className="hidden md:inline">Ecrã</span>
              </button>

              {/* Whiteboard */}
              <button
                type="button"
                onClick={() => setIsWhiteboardOpen((prev) => !prev)}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  isWhiteboardOpen ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Abrir quadro virtual para anotações do professor"
              >
                <PenTool className="w-5 h-5" />
                <span className="hidden md:inline">Quadro</span>
              </button>

              {/* Hand Raise */}
              <button
                type="button"
                onClick={() => setIsHandRaised((prev) => !prev)}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  isHandRaised ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Pedir a palavra / Levantar a mão"
              >
                <Hand className="w-5 h-5" />
                <span className="hidden md:inline">{isHandRaised ? 'Mão Erguida' : 'Pedir Fala'}</span>
              </button>
            </div>

            {/* Right Side Drawer Toggles */}
            <div className="flex items-center gap-2">
              {/* Roster Button */}
              <button
                type="button"
                onClick={() => setActiveSideTab(activeSideTab === 'roster' ? null : 'roster')}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  activeSideTab === 'roster' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Lista de participantes e presença da turma"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Alunos ({participantsList.length})</span>
              </button>

              {/* Chat Button */}
              <button
                type="button"
                onClick={() => setActiveSideTab(activeSideTab === 'chat' ? null : 'chat')}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  activeSideTab === 'chat' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Chat da chamada ao vivo"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden sm:inline">Chat</span>
              </button>

              {/* Layout Switcher */}
              <button
                type="button"
                onClick={() => setViewLayout((prev) => (prev === 'grid' ? 'spotlight' : 'grid'))}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                title={viewLayout === 'grid' ? 'Mudar para Modo Orador' : 'Mudar para Mosaico'}
              >
                {viewLayout === 'grid' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Participant Roster & Live Chat Drawers */}
        {activeSideTab && (
          <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-emerald-100 shadow-xl overflow-hidden flex flex-col h-[560px] animate-in fade-in duration-200">
            {/* Drawer Header with Tabs */}
            <div className="bg-slate-50 p-2 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveSideTab('roster')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                    activeSideTab === 'roster'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Lista de Turma</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSideTab('chat')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                    activeSideTab === 'chat'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat da Aula</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSideTab('poll')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                    activeSideTab === 'poll'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Dúvidas</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveSideTab(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* TAB 1: CLASS ROSTER & ATTENDANCE */}
            {activeSideTab === 'roster' && (
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                        Lista Oficial da Turma ({participantsList.length})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {roomCategory === 'class' ? currentClass?.name : 'Sala Aberta'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {participantsList.length} Online
                    </span>
                  </div>

                  {/* Teacher Host Badge */}
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <UserPhoto
                        name={currentTeacher.name}
                        src={currentTeacher.avatar}
                        size="sm"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block leading-tight">
                          {currentTeacher.name}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          Professor Responsável • {currentTeacher.accent}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[9px] font-bold uppercase">
                      Host
                    </span>
                  </div>

                  {/* Students list belonging to this class */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {participantsList
                      .filter((p) => p.role === 'student' || p.role === 'staff')
                      .map((st) => (
                        <div
                          key={st.id}
                          className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 bg-white flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <UserPhoto name={st.name} src={st.avatar} size="xs" />
                            <div>
                              <span className="font-bold text-slate-800 block leading-tight truncate max-w-[150px]">
                                {st.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {st.level ? `Nível ${st.level}` : 'Matriculado'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {st.isHandRaised && (
                              <span className="text-xs" title="Mão levantada">✋</span>
                            )}
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Presente na aula síncrona" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Direct Sync Button */}
                {roomCategory === 'class' && (
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleRegisterAttendance}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Salvar Chamada no Diário Acadêmico</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: LIVE CHAT & PRONUNCIATION */}
            {activeSideTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.senderRole === 'teacher'
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          {msg.senderName}
                          {msg.senderRole === 'teacher' && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-md text-[8px] font-black uppercase">
                              Docente
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{msg.text}</p>

                      {/* Play speech button if message contains English terms */}
                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => playEnglishAudio(msg.text)}
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:underline cursor-pointer font-semibold"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Ouvir Pronúncia Nativa</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Send Chat input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Escreva uma mensagem ou dúvida em inglês..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shrink-0"
                    title="Enviar"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: QUICK POLL / COMPREHENSION DRILL */}
            {activeSideTab === 'poll' && (
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-xs text-slate-900 uppercase">
                      Enquete Rápida de Compreensão Oral
                    </h4>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <p className="font-bold text-xs text-slate-900 leading-relaxed">
                      "{pollQuestion.title}"
                    </p>

                    <div className="space-y-2">
                      {pollQuestion.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPollQuestion((prev) => ({ ...prev, userVoted: true }))}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100/60 text-left text-xs font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
                        >
                          <span>{opt.label}</span>
                          <span className="font-bold text-emerald-700 font-mono text-[11px]">
                            {opt.votes + (pollQuestion.userVoted ? 1 : 0)} votos
                          </span>
                        </button>
                      ))}
                    </div>

                    {pollQuestion.userVoted && (
                      <p className="text-[11px] text-emerald-800 font-bold text-center">
                        ✓ Seu voto foi registrado e compartilhado com o professor!
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-[11px] text-slate-500">
                  Os resultados auxiliam o professor a calibrar o ritmo da aula síncrona.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
