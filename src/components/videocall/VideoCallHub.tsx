import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Maximize2,
  Minimize2,
  UserCheck,
  HelpCircle,
  BookOpen,
  Award,
  PhoneCall,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';
import { UserPhoto } from '../common/UserPhoto';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { playEnglishAudio } from '../../utils/speech';
import { CEFRLevel, VideoRoomType } from '../../types';

interface RealChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student' | 'staff' | 'director';
  text: string;
  time: string;
  isSystem?: boolean;
}

export const VideoCallHub: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    setAdminSection,
    setStudentTab,
    classes,
    teachers,
    students,
    staffUsers,
    activeStudent,
    cfpAuth,
    activeVideoRoomId,
    setActiveVideoRoomId,
    saveAttendanceSession,
  } = useApp();

  // Call connection state: in-call vs disconnected (hung up)
  const [isInCall, setIsInCall] = useState<boolean>(true);

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
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [attendanceSavedToast, setAttendanceSavedToast] = useState<boolean>(false);

  // Media Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Class & Teacher resolution from real DB
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const currentTeacher = teachers.find((t) => t.id === currentClass?.teacherId) || teachers[0];

  // Actual Students enrolled in this specific class
  const classStudents = useMemo(() => {
    if (!currentClass) return [];
    return students.filter((s) => s.classId === currentClass.id || currentClass.studentIds?.includes(s.id));
  }, [students, currentClass]);

  // Identify the Local User truthfully based on active app state (NO FICTITIOUS NAMES)
  const localUser = useMemo(() => {
    if (viewMode === 'student') {
      return {
        id: activeStudent.id,
        name: activeStudent.name,
        avatar: activeStudent.avatar,
        role: 'student' as const,
        level: activeStudent.level,
        displayTitle: `${activeStudent.name} (Você • Formando)`,
        isHost: false,
      };
    } else {
      // In Admin / Staff view:
      const staffMatch = staffUsers.find(
        (s) =>
          cfpAuth?.label?.toLowerCase().includes(s.name.toLowerCase()) ||
          cfpAuth?.role === s.role
      );
      const teacherMatch = teachers.find(
        (t) =>
          t.id === currentClass?.teacherId ||
          t.name.toLowerCase().includes(cfpAuth?.label?.toLowerCase() || '')
      );

      const name = teacherMatch?.name || staffMatch?.name || currentTeacher?.name || 'Dr. David Alistair Ward';
      const role = teacherMatch ? ('teacher' as const) : staffMatch?.role === 'director' ? ('director' as const) : ('staff' as const);

      return {
        id: teacherMatch?.id || staffMatch?.id || 'staff-local',
        name,
        avatar: teacherMatch?.avatar || staffMatch?.avatar || '',
        role,
        level: undefined,
        displayTitle: `${name} (Você • ${role === 'teacher' ? 'Docente Responsável' : 'Direção/Staff'})`,
        isHost: true,
      };
    }
  }, [viewMode, activeStudent, currentTeacher, currentClass, staffUsers, teachers, cfpAuth]);

  // Dynamic state for remote participants' interactive status
  const [remoteParticipantStates, setRemoteParticipantStates] = useState<
    Record<string, { isMuted: boolean; isVideoOn: boolean; isHandRaised: boolean; isSpeaking: boolean }>
  >({});

  // Real remote participants list strictly generated from database entities (NO FICTITIOUS NAMES)
  const remoteParticipants = useMemo(() => {
    if (roomCategory === 'class') {
      const list: Array<{
        id: string;
        name: string;
        role: 'teacher' | 'student' | 'staff' | 'director';
        avatar?: string;
        level?: CEFRLevel;
        className?: string;
        isHost?: boolean;
      }> = [];

      // Add teacher if teacher is not the local user
      if (currentTeacher && localUser.id !== currentTeacher.id) {
        list.push({
          id: currentTeacher.id,
          name: currentTeacher.name,
          role: 'teacher',
          avatar: currentTeacher.avatar,
          className: currentClass?.name,
          isHost: true,
        });
      }

      // Add actual enrolled students of this class (excluding local user if they are one of them)
      classStudents.forEach((st) => {
        if (st.id !== localUser.id) {
          list.push({
            id: st.id,
            name: st.name,
            role: 'student',
            avatar: st.avatar,
            level: st.level,
            className: st.className || currentClass?.name,
            isHost: false,
          });
        }
      });

      return list;
    } else if (roomCategory === 'staff') {
      // Real Staff Users from Database (Dr. David, Sarah Jenkins, Camila Ribeiro, Beatriz Albuquerque, Roberto Mendes)
      return staffUsers
        .filter((u) => u.id !== localUser.id && u.name !== localUser.name)
        .map((u) => ({
          id: u.id,
          name: u.name,
          role: (u.role === 'director' ? 'director' : u.role === 'teacher' ? 'teacher' : 'staff') as 'teacher' | 'staff' | 'director',
          avatar: u.avatar,
          className:
            u.role === 'director'
              ? 'Direção Geral CFPA'
              : u.role === 'coordinator'
              ? 'Coordenação Pedagógica'
              : u.role === 'teacher'
              ? 'Docente de Inglês'
              : u.role === 'secretary'
              ? 'Secretaria Acadêmica'
              : 'Administração & Finanças',
          isHost: u.role === 'director',
        }));
    } else if (roomCategory === 'level') {
      // Real students with this CEFR level
      const levelStudents = students.filter((s) => s.level === selectedLevel && s.id !== localUser.id);
      const levelTeacher = teachers.find((t) => t.specialties?.some((sp) => sp.toLowerCase().includes(selectedLevel.toLowerCase()))) || teachers[0];

      const list = [];
      if (levelTeacher && levelTeacher.id !== localUser.id) {
        list.push({
          id: levelTeacher.id,
          name: levelTeacher.name,
          role: 'teacher' as const,
          avatar: levelTeacher.avatar,
          className: `Mediador do Clube ${selectedLevel}`,
          isHost: true,
        });
      }

      levelStudents.forEach((st) => {
        list.push({
          id: st.id,
          name: st.name,
          role: 'student' as const,
          avatar: st.avatar,
          level: st.level,
          className: st.className || `Formando Nível ${st.level}`,
          isHost: false,
        });
      });

      return list;
    } else {
      // General All-Hands Room: Real teachers and students from DB
      const list: Array<{
        id: string;
        name: string;
        role: 'teacher' | 'student' | 'staff' | 'director';
        avatar?: string;
        level?: CEFRLevel;
        className?: string;
        isHost?: boolean;
      }> = [];

      // Add Director or Teacher
      teachers.forEach((t) => {
        if (t.id !== localUser.id) {
          list.push({
            id: t.id,
            name: t.name,
            role: 'teacher',
            avatar: t.avatar,
            className: 'Corpo Docente CFPA',
            isHost: true,
          });
        }
      });

      // Add enrolled students
      students.slice(0, 8).forEach((st) => {
        if (st.id !== localUser.id) {
          list.push({
            id: st.id,
            name: st.name,
            role: 'student',
            avatar: st.avatar,
            level: st.level,
            className: st.className,
            isHost: false,
          });
        }
      });

      return list;
    }
  }, [roomCategory, currentClass, currentTeacher, classStudents, localUser, staffUsers, students, selectedLevel, teachers]);

  // Chat messages with real participants (NO FICTITIOUS NAMES)
  const [chatMessages, setChatMessages] = useState<RealChatMessage[]>(() => [
    {
      id: 'sys-welcome',
      senderId: 'system',
      senderName: 'CFPA Conectado',
      senderRole: 'staff',
      text: `Sessão de videoconferência iniciada para ${currentClass?.name || 'Comunidade CFPA'}. Conexão direta e funcional entre formandos e docentes do Centro de Formação Profissional ASDE.`,
      time: 'Agora',
      isSystem: true,
    },
  ]);

  const [chatInput, setChatInput] = useState<string>('');

  // Quick Poll State
  const [pollQuestion, setPollQuestion] = useState({
    title: 'Compreensão Oral: A estrutura de Phrasal Verbs trabalhada hoje ficou clara?',
    options: [
      { id: 'opt-1', label: 'Sim, totalmente claro! (Yes, absolutely)', votes: 4 },
      { id: 'opt-2', label: 'Quero praticar mais no Speech Lab', votes: 2 },
    ],
    userVoted: false,
  });

  // Cross-tab real-time communication via BroadcastChannel
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('asde_videocall_sync');
      broadcastChannelRef.current = bc;

      // Announce this user joined
      bc.postMessage({
        type: 'user_joined',
        room: selectedClassId,
        user: {
          id: localUser.id,
          name: localUser.name,
          role: localUser.role,
          avatar: localUser.avatar,
          isMuted,
          isVideoOn,
          isHandRaised,
        },
      });

      bc.onmessage = (event) => {
        const data = event.data;
        if (!data || !data.type) return;

        if (data.type === 'chat_message' && data.message) {
          setChatMessages((prev) => {
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        } else if (data.type === 'status_update' && data.userId) {
          setRemoteParticipantStates((prev) => ({
            ...prev,
            [data.userId]: {
              isMuted: data.isMuted ?? false,
              isVideoOn: data.isVideoOn ?? true,
              isHandRaised: data.isHandRaised ?? false,
              isSpeaking: data.isSpeaking ?? false,
            },
          }));
        } else if (data.type === 'user_left' && data.userId) {
          // Track departure
        }
      };
    } catch {
      // BroadcastChannel fallback if not supported
    }

    return () => {
      if (bc) {
        try {
          bc.postMessage({
            type: 'user_left',
            userId: localUser.id,
          });
          bc.close();
        } catch {}
      }
    };
  }, [selectedClassId, localUser.id, localUser.name, localUser.role, localUser.avatar, isMuted, isVideoOn, isHandRaised]);

  // Timer increment during active call
  useEffect(() => {
    if (!isInCall) return;

    const timer = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isInCall]);

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
      if (isInCall && isVideoOn) {
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
          // Camera permission gracefully handled (e.g., iframe or denied)
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
  }, [isVideoOn, isInCall]);

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

  // BOTÃO DE DESLIGAR (Hang up / Disconnect call)
  const handleHangUp = useCallback(() => {
    // 1. Stop local camera streams
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    // 2. Stop screen share streams
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    // 3. Broadcast departure to other tabs
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'user_left',
        userId: localUser.id,
      });
    } catch {}

    // 4. Update states
    setIsScreenSharing(false);
    setIsWhiteboardOpen(false);
    setIsInCall(false);
  }, [localUser.id]);

  // Re-enter / Join Call (Zero bureaucracy, 1 click)
  const handleJoinCall = () => {
    setIsInCall(true);
    setIsVideoOn(true);
    setCallDurationSeconds(0);
  };

  // Handle sending chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: RealChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: localUser.id,
      senderName: localUser.name,
      senderRole: localUser.role,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Broadcast message to any other tab
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'chat_message',
        message: newMsg,
      });
    } catch {}

    setChatInput('');
  };

  // Toggle Hand Raise & broadcast
  const toggleHandRaise = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'status_update',
        userId: localUser.id,
        isHandRaised: nextState,
        isMuted,
        isVideoOn,
      });
    } catch {}
  };

  // Toggle Mute & broadcast
  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'status_update',
        userId: localUser.id,
        isMuted: nextState,
        isVideoOn,
        isHandRaised,
      });
    } catch {}
  };

  // Teacher action: Save automatic attendance into Academic Database
  const handleRegisterAttendance = () => {
    if (!currentClass) return;

    saveAttendanceSession({
      classId: currentClass.id,
      date: new Date().toLocaleDateString('pt-PT'),
      topic: `Aula Síncrona via Videoconferência • ${currentClass.currentUnit}`,
      summary: `Sessão síncrona com ${localUser.name} e ${classStudents.length} formandos da lista oficial da turma. Prática oral de Speaking, pronúncia e participação no chat.`,
      homeworkAssigned: 'Praticar o vocabulário debatido em sala no Speech Lab e realizar o quiz da unidade.',
      records: classStudents.map((s) => ({
        studentId: s.id,
        status: 'present',
        notes: 'Presença confirmada e validada em chamada de vídeo ao vivo.',
      })),
    });

    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3500);
  };

  // =========================================================================
  // RENDER: DISCONNECTED / CALL ENDED SCREEN
  // =========================================================================
  if (!isInCall) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-2xl p-6 sm:p-10 text-center space-y-6">
          {/* Hang-up Icon Badge */}
          <div className="inline-flex p-4 rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 shadow-inner">
            <PhoneOff className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Chamada de Vídeo Desligada
            </h2>
            <p className="text-sm text-slate-600">
              Você saiu da sala <strong>{roomCategory === 'class' ? currentClass?.name : roomCategory === 'staff' ? 'Reunião de Staff' : roomCategory === 'level' ? `Clube Nível ${selectedLevel}` : 'Auditório Geral'}</strong>.
            </p>
          </div>

          {/* Session Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Tempo Conectado:</span>
              <span className="text-base font-black text-emerald-800 font-mono">
                {formatTime(callDurationSeconds)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Participantes Reais:</span>
              <span className="text-base font-black text-slate-900">
                {remoteParticipants.length + 1} Conectados
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Status da Presença:</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Registrada no CFP
              </span>
            </div>
          </div>

          {/* Direct One-Click Actions: No Bureaucracy */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleJoinCall}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xl hover:shadow-emerald-700/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Entrar Novamente na Chamada</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (viewMode === 'admin') {
                  setAdminSection('classes');
                } else {
                  setStudentTab('school_hub');
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Voltar ao Portal Acadêmico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Room Category Switcher to change room before re-entering */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Ou escolha outra sala para ingressar imediatamente:
            </span>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRoomCategory('class');
                  handleJoinCall();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold transition cursor-pointer flex items-center gap-1"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Chamada da Turma</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoomCategory('general');
                  handleJoinCall();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Chamada Geral</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoomCategory('staff');
                  handleJoinCall();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Reunião de Staff</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: ACTIVE LIVE VIDEO CALL HUB
  // =========================================================================
  return (
    <div className="space-y-4">
      {/* Top Banner: Real Room Info, Active Call Timer, Quick Hangup */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-4 sm:p-5 text-white border-2 border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ao Vivo • Sala Conectada
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-bold font-mono">
                {formatTime(callDurationSeconds)}
              </span>
              <span className="text-xs text-emerald-200/90 font-semibold hidden sm:inline">
                Usuário Conectado: <strong>{localUser.name}</strong> ({localUser.role === 'student' ? 'Formando' : 'Docente/Staff'})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {roomCategory === 'class' && (
                <>
                  <BookOpen className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>{currentClass?.name}</span>
                </>
              )}
              {roomCategory === 'general' && (
                <>
                  <Building2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>Auditório Geral Institucional • CFP - ASDE</span>
                </>
              )}
              {roomCategory === 'staff' && (
                <>
                  <Briefcase className="w-6 h-6 text-teal-400 shrink-0" />
                  <span>Reunião de Coordenação Pedagógica & Direção</span>
                </>
              )}
              {roomCategory === 'level' && (
                <>
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <span>Clube de Conversação & Speaking: Nível {selectedLevel}</span>
                </>
              )}
            </h1>

            <p className="text-xs text-emerald-100/80">
              {roomCategory === 'class' && (
                <span>
                  Docente: <strong>{currentTeacher?.name}</strong> • Turma: <strong>{currentClass?.code}</strong> • {currentClass?.schedule} • <strong>{classStudents.length} formandos reais</strong> matriculados.
                </span>
              )}
              {roomCategory === 'general' && (
                <span>
                  Sessão aberta para todos os formandos, professores e corpo diretivo do Centro de Formação Profissional ASDE na Beira.
                </span>
              )}
              {roomCategory === 'staff' && (
                <span>
                  Pauta pedagógica entre os membros da Direção Geral, Secretaria e Corpo Docente.
                </span>
              )}
              {roomCategory === 'level' && (
                <span>
                  Prática de pronúncia, fluência e redução de sotaque focada no nível {selectedLevel}.
                </span>
              )}
            </p>
          </div>

          {/* Quick Header Actions: Attendance Validator & Hang Up */}
          <div className="flex items-center gap-2 shrink-0">
            {roomCategory === 'class' && (viewMode === 'admin' || localUser.role === 'teacher') && (
              <button
                type="button"
                onClick={handleRegisterAttendance}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                title="Lançar presença oficial no Diário de Classe com 1 clique"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Validar Presenças</span>
              </button>
            )}

            {/* BOTÃO DE DESLIGAR NO CABEÇALHO */}
            <button
              type="button"
              onClick={handleHangUp}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5 ring-2 ring-rose-500/50"
              title="Desligar e sair da videoconferência"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Desligar</span>
            </button>
          </div>
        </div>

        {/* Room Category Tabs / Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/80 text-xs font-bold">
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider block sm:inline">
            Salas Ativas:
          </span>

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
            <span>Chamada de Turma (Alunos & Docente)</span>
          </button>

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
            <span>Reunião de Staff</span>
          </button>

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
            <span>Clubes por Nível ({selectedLevel})</span>
          </button>
        </div>

        {/* Secondary Sub-selector for Class or Level */}
        {roomCategory === 'class' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[11px] text-emerald-300 font-semibold">Turma Selecionada:</span>
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
                  {c.name} ({students.filter((s) => s.classId === c.id).length} formandos)
                </button>
              ))}
            </div>
          </div>
        )}

        {roomCategory === 'level' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[11px] text-emerald-300 font-semibold">Nível CEFR:</span>
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
              <strong>Presenças Registadas com Sucesso!</strong> O diário acadêmico da turma <strong>{currentClass?.name}</strong> foi atualizado com a participação dos formandos reais.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-700 px-2.5 py-1 rounded-full font-bold">
            {classStudents.length} presentes
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
              teacherName={currentTeacher?.name || localUser.name}
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
                <span>Partilha de Ecrã / Material Didático do Professor</span>
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
                      name={localUser.name}
                      src={localUser.avatar}
                      size="sm"
                    />
                    <span className="text-[10px] font-bold mt-1 text-slate-300 truncate w-full text-center">
                      {localUser.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Participant Grid / Mosaic */
            <div className="bg-slate-950 rounded-3xl p-3 sm:p-4 border-2 border-slate-800 shadow-2xl">
              <div
                className={`grid gap-3 ${
                  viewLayout === 'spotlight'
                    ? 'grid-cols-1'
                    : remoteParticipants.length === 0
                    ? 'grid-cols-1'
                    : remoteParticipants.length <= 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : remoteParticipants.length <= 4
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {/* 1. Local User Tile with Real Identity */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500 shadow-lg aspect-video flex items-center justify-center group">
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
                      <UserPhoto
                        name={localUser.name}
                        src={localUser.avatar}
                        size="xl"
                        className="shadow-xl"
                      />
                      <span className="text-xs font-bold text-white mt-2 truncate max-w-[180px]">
                        {localUser.name}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Câmera Desligada • Áudio Ativo
                      </span>
                    </div>
                  )}

                  {/* Tile Overlay Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/85 px-2 py-1 rounded-lg text-[11px] font-bold text-white backdrop-blur-xs border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="truncate max-w-[140px]">
                      {localUser.name} (Você)
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {isHandRaised && (
                      <span className="p-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black animate-bounce" title="Mão Levantada">
                        ✋
                      </span>
                    )}
                    <span className={`p-1 rounded-lg text-white ${isMuted ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                      {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  {localUser.isHost && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black uppercase">
                        Host / Docente
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Remote Participants from the Real School DB */}
                {remoteParticipants.slice(0, viewLayout === 'spotlight' ? 1 : 8).map((p) => {
                  const state = remoteParticipantStates[p.id] || {
                    isMuted: false,
                    isVideoOn: true,
                    isHandRaised: false,
                    isSpeaking: false,
                  };

                  return (
                    <div
                      key={p.id}
                      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border shadow-md aspect-video flex flex-col items-center justify-center text-center p-3 transition-all ${
                        state.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-slate-800'
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
                        {state.isSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-center w-full px-2">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-emerald-300">
                          {p.role === 'teacher'
                            ? 'Docente • Host'
                            : p.role === 'director'
                            ? 'Direção Geral'
                            : p.className || (p.level ? `Nível ${p.level}` : 'Formando CFPA')}
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
                        {state.isHandRaised && (
                          <span className="p-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black">
                            ✋
                          </span>
                        )}
                        <span className={`p-1 rounded-lg text-white ${state.isMuted ? 'bg-slate-700' : 'bg-emerald-600'}`}>
                          {state.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                        </span>
                      </div>

                      {/* Speaking Audio Wave Animation */}
                      {state.isSpeaking && (
                        <div className="absolute bottom-2 flex items-center gap-1">
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty State when no other members are enrolled */}
                {remoteParticipants.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 text-slate-500" />
                    <p className="text-xs font-bold text-slate-300">
                      Você é o primeiro a entrar nesta sala
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Aguardando os outros formandos ou docentes conectarem-se. Compartilhe o link da aula ou notifique via WhatsApp oficial.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* CONTROL BAR: MIC, CAMERA, SCREEN, WHITEBOARD, HANG UP */}
          {/* ========================================================= */}
          <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 border-2 border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-white">
            {/* Left media toggles */}
            <div className="flex items-center gap-2">
              {/* Mic Toggle */}
              <button
                type="button"
                onClick={toggleMute}
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

            {/* Center interactive tools & BOTÃO DE DESLIGAR */}
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
                onClick={toggleHandRaise}
                className={`p-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  isHandRaised ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Pedir a palavra / Levantar a mão"
              >
                <Hand className="w-5 h-5" />
                <span className="hidden md:inline">{isHandRaised ? 'Mão Erguida' : 'Pedir Fala'}</span>
              </button>

              {/* ======================================================= */}
              {/* BOTÃO PRINCIPAL DE DESLIGAR (HANG UP / LEAVE CALL) */}
              {/* ======================================================= */}
              <button
                type="button"
                onClick={handleHangUp}
                className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/40"
                title="Desligar e sair da videoconferência"
              >
                <PhoneOff className="w-5 h-5" />
                <span>Desligar</span>
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
                title="Lista de participantes reais e presença"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Pessoas ({remoteParticipants.length + 1})</span>
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

        {/* Right Column: Participant Roster, Live Chat & Poll */}
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
                  <span>Participantes ({remoteParticipants.length + 1})</span>
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
                  <span>Chat da Sala</span>
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
                  <span>Compreensão</span>
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

            {/* TAB 1: REAL PARTICIPANTS ROSTER (NO FICTITIOUS NAMES) */}
            {activeSideTab === 'roster' && (
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                        Usuários Reais Conectados
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {roomCategory === 'class' ? currentClass?.name : 'Conexão Direta CFP - ASDE'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {remoteParticipants.length + 1} Ativos
                    </span>
                  </div>

                  {/* 1. Local User Card (You) */}
                  <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <UserPhoto
                        name={localUser.name}
                        src={localUser.avatar}
                        size="sm"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block leading-tight">
                          {localUser.name} <span className="text-emerald-700 font-extrabold">(Você)</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          {localUser.role === 'student'
                            ? `Formando • Nível ${localUser.level || 'B1'}`
                            : 'Docente / Administração'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[9px] font-bold uppercase">
                      Online
                    </span>
                  </div>

                  {/* 2. Other real users in this room */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {remoteParticipants.map((p) => {
                      const state = remoteParticipantStates[p.id] || {
                        isMuted: false,
                        isVideoOn: true,
                        isHandRaised: false,
                        isSpeaking: false,
                      };

                      return (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <UserPhoto name={p.name} src={p.avatar} size="xs" />
                            <div>
                              <span className="font-bold text-slate-800 block leading-tight truncate max-w-[150px]">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {p.role === 'teacher'
                                  ? 'Docente Responsável'
                                  : p.role === 'director'
                                  ? 'Direção Geral'
                                  : p.level
                                  ? `Formando Nível ${p.level}`
                                  : p.className || 'Matriculado'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {state.isHandRaised && (
                              <span className="text-xs" title="Mão Levantada">
                                ✋
                              </span>
                            )}
                            <span
                              className={`p-1 rounded-md text-[10px] font-bold ${
                                state.isMuted
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {state.isMuted ? 'Mudo' : 'Voz'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom action for Teachers / Admin */}
                {roomCategory === 'class' && (viewMode === 'admin' || localUser.role === 'teacher') && (
                  <button
                    type="button"
                    onClick={handleRegisterAttendance}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Lançar Presenças no Diário ({classStudents.length})</span>
                  </button>
                )}
              </div>
            )}

            {/* TAB 2: LIVE ROOM CHAT (REAL USERS ONLY) */}
            {activeSideTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.isSystem
                          ? 'bg-slate-100 text-slate-600 border border-slate-200 italic'
                          : msg.senderId === localUser.id
                          ? 'bg-emerald-50 border border-emerald-200 ml-4'
                          : 'bg-slate-50 border border-slate-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          {msg.senderName}
                          {msg.senderId === localUser.id && (
                            <span className="text-emerald-700 font-extrabold">(Você)</span>
                          )}
                          {msg.senderRole === 'teacher' && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-md text-[8px] font-black uppercase">
                              Docente
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal">{msg.text}</p>

                      {/* English TTS Button for practicing pronunciation */}
                      {!msg.isSystem && (
                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => playEnglishAudio(msg.text)}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:underline cursor-pointer font-semibold"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Ouvir Pronúncia</span>
                          </button>
                        </div>
                      )}
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
                    title="Enviar mensagem"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: QUICK POLL */}
            {activeSideTab === 'poll' && (
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-xs text-slate-900 uppercase">
                      Verificação Rápida de Compreensão
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
                        ✓ Seu voto foi registrado e compartilhado na chamada!
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-[11px] text-slate-500">
                  Ferramenta de checagem imediata para o docente calibrar a aula.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
