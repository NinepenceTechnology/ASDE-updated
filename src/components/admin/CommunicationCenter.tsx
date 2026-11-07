import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunicationLog, SchoolNotice } from '../../types';
import {
  MessageSquare,
  Send,
  Mail,
  Bell,
  CheckCircle2,
  Copy,
  ExternalLink,
  Plus,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export const CommunicationCenter: React.FC = () => {
  const { students, notices, addNotice, communicationLogs, sendCommunication } = useApp();

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'notices' | 'logs'>('whatsapp');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // WhatsApp Form
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('tuition');
  const [customMessage, setCustomMessage] = useState<string>('');

  // Notice Form
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    target: 'all' as SchoolNotice['target'],
    priority: 'normal' as SchoolNotice['priority'],
  });

  // Email Form
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailStudentId, setEmailStudentId] = useState(students[0]?.id || '');
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Predefined templates for WhatsApp
  const templates: Record<string, { label: string; text: (name: string, group: string) => string }> = {
    tuition: {
      label: 'Lembrete de Mensalidade / Propina Pendente',
      text: (name) =>
        `Olá ${name}! Lembramos que a sua propina do Centro de Formação Profissional ASDE está próxima do vencimento ou pendente. Pode liquidar via Millennium BIM (Conta: 956365875 / NIB: 000100000095636587557) ou M-Pesa / WhatsApp pelo (+258) 87 541 1436 pelo portal do formando ou presencialmente na nossa secretaria na Beira. Qualquer dúvida, estamos à disposição! 🎓`,
    },
    grade: {
      label: 'Boletim de Avaliação CEFR Disponível',
      text: (name, group) =>
        `Olá ${name}! O seu boletim oficial de rendimento em língua inglesa da turma ${group} já está publicado no portal do Centro ASDE. Aceda para conferir as suas notas de Speaking, Listening e o parecer pedagógico do corpo docente. Parabéns pela dedicação! 🌟`,
    },
    attendance: {
      label: 'Alerta Preventivo de Assiduidade',
      text: (name, group) =>
        `Olá ${name}! Notamos que teve faltas recentes na turma ${group}. Lembramos que manter assiduidade acima de 75% é requisito para a certificação do Centro de Formação Profissional ASDE. Caso precise de reposição, contacte a nossa coordenação na Beira.`,
    },
    welcome: {
      label: 'Boas-Vindas & Acesso ao App',
      text: (name, group) =>
        `Welcome to Centro de Formação Profissional ASDE, ${name}! A sua inscrição na turma ${group} foi confirmada com sucesso. Instale o nosso aplicativo interativo de inglês para aceder a lições, Speech Lab de pronúncia e simuladores com IA. Good luck with your English journey! 🚀`,
    },
    event: {
      label: 'Convite para Conversation Club',
      text: (name) =>
        `Hey ${name}! Nesta sexta-feira teremos nosso clássico Conversation Club no lounge da ASDE com mediação de professores nativos. Venha praticar sua fala em um ambiente descontraído. Te esperamos! ☕🇬🇧🇺🇸`,
    },
  };

  // Generate WhatsApp text based on template
  const currentMessageText = customMessage || (
    activeStudent
      ? templates[selectedTemplate]?.text(activeStudent.name, activeStudent.className)
      : ''
  );

  const handleSendWhatsApp = () => {
    if (!activeStudent) return;

    // Clean phone number for wa.me link
    const cleanPhone = activeStudent.phone.replace(/\D/g, '');
    const encodedText = encodeURIComponent(currentMessageText);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    sendCommunication({
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      channel: 'whatsapp',
      type: selectedTemplate === 'tuition' ? 'tuition_reminder' : 'general_notice',
      subject: templates[selectedTemplate]?.label || 'Comunicação WhatsApp',
      message: currentMessageText,
    });

    window.open(waUrl, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessageText);
    setCopiedText('Copiado!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) return;

    addNotice({
      title: noticeForm.title,
      content: noticeForm.content,
      target: noticeForm.target,
      priority: noticeForm.priority,
    });

    setShowNoticeModal(false);
    setNoticeForm({
      title: '',
      content: '',
      target: 'all',
      priority: 'normal',
    });
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find((s) => s.id === emailStudentId) || students[0];
    if (!targetStudent || !emailSubject.trim() || !emailBody.trim()) return;

    sendCommunication({
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      channel: 'email',
      type: 'general_notice',
      subject: emailSubject,
      message: emailBody,
    });

    setEmailSentAlert(true);
    setEmailSubject('');
    setEmailBody('');
    setTimeout(() => setEmailSentAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            Central de Comunicação Escolar
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            WhatsApp, E-mail & Notificações Internas
          </h1>
          <p className="text-slate-500 text-xs mt-1 max-w-2xl">
            Comunicação ágil com os alunos e docentes do Centro de formação Professional ASDE. Envie cobranças, boletins e comunicados institucionais em poucos cliques.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNoticeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publicar Aviso no Mural
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          Disparo WhatsApp Oficial
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'email'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4 text-indigo-600" />
          Disparo de E-mail Institucional
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'notices'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" />
          Mural de Avisos Internos ({notices.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-500" />
          Histórico de Envios ({communicationLogs.length})
        </button>
      </div>

      {/* TAB 1: WHATSAPP INTEGRATION */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings / Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Configurar Destinatário & Template
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Selecione o Aluno *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setCustomMessage('');
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {students.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} ({stu.className} • {stu.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Modelo de Mensagem Pronta</label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCustomMessage('');
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {Object.entries(templates).map(([key, tpl]) => (
                  <option key={key} value={key}>
                    {tpl.label}
                  </option>
                ))}
              </select>
            </div>

            {activeStudent && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 block">Dados do Contato:</span>
                <p className="text-slate-600"><strong>Telefone:</strong> {activeStudent.phone}</p>
                <p className="text-slate-600"><strong>Turma:</strong> {activeStudent.className}</p>
                <p className="text-slate-600">
                  <strong>Situação Financeira:</strong>{' '}
                  <span className={activeStudent.tuitionStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                    {activeStudent.tuitionStatus === 'paid' ? 'Em dia' : 'Pendente'}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp Preview Screen */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Pré-visualização da Mensagem no WhatsApp
              </h3>
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedText || 'Copiar Texto'}
              </button>
            </div>

            <div className="bg-[#E5DDD5] p-5 rounded-2xl border border-slate-300 relative min-h-[220px] flex flex-col justify-between">
              <div className="bg-white p-4 rounded-2xl rounded-tl-xs shadow-xs max-w-lg space-y-2 text-xs text-slate-800 border border-slate-200/60">
                <textarea
                  value={currentMessageText}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent resize-none focus:outline-none text-xs leading-relaxed"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Centro de Formação Profissional ASDE • Beira</span>
                  <span>{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} ✓✓</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-600">
                  Envia diretamente para <strong>{activeStudent?.name}</strong> via API do WhatsApp.
                </span>
                <button
                  onClick={handleSendWhatsApp}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Disparar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMAIL INTEGRATION */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">Disparo de E-mail Institucional</h3>
            <p className="text-xs text-slate-500">
              Envio formal com timbre do Centro de formação Professional ASDE diretamente para a caixa postal do aluno.
            </p>
          </div>

          {emailSentAlert && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              E-mail enviado com sucesso e registrado no histórico acadêmico!
            </div>
          )}

          <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destinatário (Aluno) *</label>
              <select
                value={emailStudentId}
                onChange={(e) => setEmailStudentId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {students.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} &lt;{stu.email}&gt;
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assunto do E-mail *</label>
              <input
                type="text"
                required
                placeholder="Ex: Boletim Oficial CEFR & Avaliação de Língua Inglesa"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corpo da Mensagem *</label>
              <textarea
                required
                rows={6}
                placeholder="Prezado(a) aluno(a), informamos que..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">Remetente: comunicacao@asde.edu.br</span>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Enviar E-mail Oficial
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: INTERNAL NOTICES BOARD */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      notice.priority === 'important'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {notice.priority === 'important' ? 'Importante' : 'Geral'}
                  </span>
                  <span className="text-xs text-slate-400">{notice.date}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notice.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Público: <strong>{notice.target === 'all' ? 'Todos' : notice.target === 'students' ? 'Alunos' : 'Docentes'}</strong></span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Visível no App do Aluno
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNICATION LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Histórico de Comunicações Enviadas</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Destinatário</th>
                  <th className="p-3">Canal</th>
                  <th className="p-3">Assunto</th>
                  <th className="p-3">Mensagem</th>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {communicationLogs.map((log) => (
                  <tr key={log.id} className="bg-white">
                    <td className="p-3 font-semibold text-slate-900">{log.studentName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.channel === 'whatsapp'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {log.channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{log.subject}</td>
                    <td className="p-3 text-slate-500 max-w-sm truncate">{log.message}</td>
                    <td className="p-3 text-slate-400 whitespace-nowrap">{log.sentAt}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Entregue
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW NOTICE */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Publicar Aviso no Mural Escolar</h3>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título do Aviso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Workshop de Preparação IELTS nesta Quinta"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conteúdo do Aviso *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detalhes, horários, sala e instruções para os participantes..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Público-Alvo</label>
                  <select
                    value={noticeForm.target}
                    onChange={(e) => setNoticeForm({ ...noticeForm, target: e.target.value as SchoolNotice['target'] })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="all">Todos (Alunos e Professores)</option>
                    <option value="students">Apenas Alunos</option>
                    <option value="teachers">Apenas Professores</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as SchoolNotice['priority'] })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Importante / Destaque</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
                >
                  Publicar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
