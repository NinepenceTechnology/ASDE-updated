import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MessageSquare,
  X,
  Send,
  Sparkles,
  Megaphone,
  Pin,
  Calendar,
  User,
  ShieldCheck,
  Building2,
  Filter,
  PlusCircle,
  Clock,
} from 'lucide-react';

interface UniversalChatMessage {
  id: string;
  authorName: string;
  authorRole: string;
  authorLevel?: string;
  text: string;
  timestamp: string;
  isAnnouncement?: boolean;
}

export const GeneralAnnouncementsChatModal: React.FC = () => {
  const { schoolNotices, setSchoolNotices, cfpAuth, activeStudent, viewMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'announcements' | 'chat'>('announcements');

  // Community Chat State with rich initial messages
  const [messages, setMessages] = useState<UniversalChatMessage[]>([
    {
      id: 'm-1',
      authorName: 'Secretaria Acadêmica ASDE',
      authorRole: 'Secretaria',
      text: 'Sejam bem-vindos ao ano letivo no CFP - ASDE! As pautas por nível dos 5 estilos de avaliação (Fala, Escuta, Escrita, Gramática e Leitura) já estão disponíveis para consulta.',
      timestamp: 'Hoje às 08:30',
      isAnnouncement: true,
    },
    {
      id: 'm-2',
      authorName: 'Prof. David Ward',
      authorRole: 'Docente (C1/C2)',
      text: 'Good morning everyone! Lembrem-se de praticar 15 minutos diários no Speech Lab e nos Exercícios Práticos para pontuar na competição semanal de horas do app.',
      timestamp: 'Hoje às 09:15',
    },
    {
      id: 'm-3',
      authorName: 'Lucas Gabriel',
      authorRole: 'Formando',
      authorLevel: 'B1',
      text: 'Alguém para praticar o diálogo da Unit 2 de conversação hoje às 17h no Roleplay Simulator?',
      timestamp: 'Hoje às 10:45',
    },
  ]);

  const [chatInput, setChatInput] = useState('');

  // New Announcement Form State (for Staff)
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    message: '',
    priority: 'normal' as 'normal' | 'urgent',
    target: 'all' as 'all' | 'students' | 'teachers',
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const isStaff = viewMode === 'admin';
    const author = isStaff
      ? cfpAuth?.label || 'Coordenação CFP - ASDE'
      : activeStudent.name;
    const role = isStaff ? (cfpAuth?.role ? 'Equipe CFP' : 'Administração') : 'Formando';

    const newMsg: UniversalChatMessage = {
      id: `msg-${Date.now()}`,
      authorName: author,
      authorRole: role,
      authorLevel: !isStaff ? activeStudent.level : undefined,
      text: chatInput.trim(),
      timestamp: 'Agora mesmo',
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.message.trim()) return;

    const createdNotice = {
      id: `not-${Date.now()}`,
      title: newNotice.title.trim(),
      message: newNotice.message.trim(),
      date: new Date().toLocaleDateString('pt-PT'),
      target: newNotice.target,
      priority: newNotice.priority,
    };

    setSchoolNotices([createdNotice, ...schoolNotices]);
    setNewNotice({ title: '', message: '', priority: 'normal', target: 'all' });
    setIsPostingAnnouncement(false);
  };

  const isStaff = viewMode === 'admin' || !!cfpAuth;

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="btn-open-universal-chat"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-emerald-400/40"
          title="Mural de Anúncios Gerais & Chat Universal"
        >
          {/* Notification Pulse dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>

          <Megaphone className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-xs tracking-wide hidden sm:inline">
            Anúncios Gerais & Chat
          </span>

          {schoolNotices.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
              {schoolNotices.length}
            </span>
          )}
        </button>
      </div>

      {/* Floating Universal Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-5 z-50 w-full sm:w-96 md:w-[420px] h-full sm:h-[580px] max-h-screen sm:max-h-[90vh] bg-white sm:rounded-3xl shadow-2xl border border-emerald-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-4 text-white shrink-0 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white">
                  Mural Geral & Chat
                </h3>
                <p className="text-[11px] text-emerald-200/80">
                  Centro de Formação Profissional ASDE
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subnav Tabs */}
          <div className="bg-emerald-50/70 p-2 border-b border-emerald-100 flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setActiveTab('announcements');
                setIsPostingAnnouncement(false);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-100/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Anúncios Gerais ({schoolNotices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-100/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Universal</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {activeTab === 'announcements' && (
              <>
                {/* Staff Post Button */}
                {isStaff && !isPostingAnnouncement && (
                  <button
                    onClick={() => setIsPostingAnnouncement(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-100/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-700" />
                    <span>Publicar Novo Comunicado Oficial</span>
                  </button>
                )}

                {/* Form to Post Announcement */}
                {isPostingAnnouncement && (
                  <form
                    onSubmit={handlePostAnnouncement}
                    className="p-3.5 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                      <span className="text-xs font-black text-emerald-900">Novo Comunicado</span>
                      <button
                        type="button"
                        onClick={() => setIsPostingAnnouncement(false)}
                        className="text-xs text-slate-400 hover:text-slate-700"
                      >
                        Cancelar
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Título do Anúncio (ex: Calendário de Avaliações)"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />

                    <textarea
                      required
                      rows={3}
                      placeholder="Mensagem aos formandos e docentes..."
                      value={newNotice.message}
                      onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={newNotice.priority}
                        onChange={(e) =>
                          setNewNotice({
                            ...newNotice,
                            priority: e.target.value as 'normal' | 'urgent',
                          })
                        }
                        className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="normal">Prioridade Normal</option>
                        <option value="urgent">Prioridade Urgente</option>
                      </select>

                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Publicar
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Announcements */}
                {schoolNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-emerald-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Pin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {notice.title}
                        </h4>
                      </div>

                      {notice.priority === 'urgent' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-800 shrink-0">
                          URGENTE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {notice.message}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{notice.date}</span>
                      </span>
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {notice.target === 'all'
                          ? 'Geral para Todos'
                          : notice.target === 'students'
                          ? 'Apenas Formandos'
                          : 'Corpo Docente'}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-2.5">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      m.isAnnouncement
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold flex items-center gap-1 text-slate-900">
                        {m.authorName}
                        <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[9px]">
                          {m.authorRole} {m.authorLevel ? `• ${m.authorLevel}` : ''}
                        </span>
                      </span>
                      <span className="text-slate-400">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Input (when in Chat tab) */}
          {activeTab === 'chat' && (
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escreva uma mensagem ou dúvida..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white cursor-pointer transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};
