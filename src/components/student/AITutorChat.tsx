import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { playEnglishAudio } from '../../utils/speech';
import { AIChatMessage } from '../../types';
import confetti from 'canvas-confetti';
import {
  Bot,
  Send,
  Volume2,
  Sparkles,
  Award,
  RefreshCw,
  Lightbulb,
  MessageSquare,
  Briefcase,
  Plane,
  Coffee,
  CheckCircle2,
  Mic,
  MicOff,
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  role: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  initialAiMessage: string;
  quickReplies: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'job_interview',
    title: 'Job Interview (Entrevista)',
    role: 'Senior Tech Recruiter',
    description: 'Simule uma entrevista profissional em uma multinacional.',
    icon: Briefcase,
    initialAiMessage:
      "Hello! Welcome to our interview. It's a pleasure to meet you. To get started, could you please tell me a little bit about yourself and your professional background?",
    quickReplies: [
      'Sure! I have a background in software development and project management.',
      'Thank you for having me. I have worked in customer success for three years.',
      'Glad to meet you! I recently graduated with a degree in business administration.',
    ],
  },
  {
    id: 'airport',
    title: 'Airport & Customs (Aeroporto)',
    role: 'Immigration Border Officer',
    description: 'Pratique sua passagem pela imigração e alfândega em Londres ou Nova York.',
    icon: Plane,
    initialAiMessage:
      'Good afternoon. Passport and landing card, please. What is the main purpose of your visit to the country today?',
    quickReplies: [
      'Good afternoon officer. I am here on vacation for two weeks.',
      'Hello! I am attending an academic conference at the university.',
      'Hi! I am here on a business trip to visit our local office.',
    ],
  },
  {
    id: 'restaurant',
    title: 'Restaurant & Dining (Restaurante)',
    role: 'Friendly Bistro Waiter',
    description: 'Faça pedidos, tire dúvidas sobre o cardápio e peça a conta.',
    icon: Coffee,
    initialAiMessage:
      'Good evening! Table for one? Here is your menu. Would you like to start with something to drink while you decide on food?',
    quickReplies: [
      'Yes, please! Could I have a sparkling water with lemon?',
      'Thank you! What do you recommend as the house specialty today?',
      'Just a glass of red wine for now, please.',
    ],
  },
  {
    id: 'small_talk',
    title: 'Daily Small Talk (Conversa Casual)',
    role: 'Exchange Student Friend',
    description: 'Converse sobre fins de semana, clima, séries e hobbies cotidianos.',
    icon: MessageSquare,
    initialAiMessage:
      'Hey there! How has your week been going so far? Are you doing anything fun this upcoming weekend?',
    quickReplies: [
      'Hey! My week was pretty busy with classes at ASDE. This weekend I might watch a movie.',
      'Hello! It was great, thank you. I am planning to visit a park with some friends.',
      'Hi! Pretty relaxing week. I have just been practicing my English speaking.',
    ],
  },
];

export const AITutorChat: React.FC = () => {
  const { activeStudent, completeStudentLesson } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: SCENARIOS[0].initialAiMessage,
      timestamp: 'Agora',
      grammarTip: 'Dica: Responda em frases completas para demonstrar fluência e vocabulário.',
      vocabularyBoost: ['Background', 'Experience', 'Achieve', 'Expertise'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: scenario.initialAiMessage,
        timestamp: 'Agora',
        grammarTip: `Cenário ativo: ${scenario.title}. O tutor responderá no contexto de ${scenario.role}.`,
        vocabularyBoost: ['Certainly', 'Indeed', 'I would appreciate', 'Could you clarify'],
      },
    ]);
  };

  const generateAIResponse = (userText: string, scenarioId: string): { text: string; tip?: string; vocab?: string[] } => {
    const lower = userText.toLowerCase();

    if (scenarioId === 'job_interview') {
      if (lower.includes('background') || lower.includes('software') || lower.includes('experience')) {
        return {
          text: "That sounds very impressive! Could you describe a challenging project you handled and how you overcame the obstacles?",
          tip: "Excelente uso de vocabulário profissional! Ao responder, use o método STAR (Situation, Task, Action, Result).",
          vocab: ['Overcome', 'Obstacle', 'Milestone', 'Collaborate'],
        };
      }
      return {
        text: "Thank you for sharing that. Where do you see yourself professionally in the next three to five years?",
        tip: "Lembre-se de usar tempos futuros como 'I aim to...' ou 'I intend to expand my skillset'.",
        vocab: ['Long-term vision', 'Leadership role', 'Professional growth'],
      };
    }

    if (scenarioId === 'airport') {
      return {
        text: "Understood. Where will you be staying during your visit, and do you have a return ticket booked?",
        tip: "Para responder sobre estadia, diga: 'I am staying at [Hotel/Airbnb] in downtown...'",
        vocab: ['Accommodation', 'Itinerary', 'Boarding pass', 'Luggage'],
      };
    }

    if (scenarioId === 'restaurant') {
      return {
        text: "Right away! Tonight our chef recommends the grilled salmon with roasted vegetables. Would you like that, or do you have any allergies?",
        tip: "Para fazer o pedido de forma natural e polida, use 'Could I please have...' ou 'I will go with the...'",
        vocab: ['Appetizer', 'Side dish', 'Beverage', 'Medium rare'],
      };
    }

    // Default small talk
    return {
      text: "That sounds wonderful! I really enjoy that kind of activity too. What do you enjoy doing most in your free time?",
      tip: "Você pode responder usando 'I am really into...' ou 'In my spare time, I usually...'",
      vocab: ['Leisure time', 'Passionate about', 'Unwind', 'Recharge'],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const msgText = textToSend || inputText;
    if (!msgText.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msgText.trim(),
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI reflection & generation
    setTimeout(() => {
      const responseData = generateAIResponse(msgText, selectedScenario.id);
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        grammarTip: responseData.tip,
        vocabularyBoost: responseData.vocab,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      // Reward XP after every few exchanges
      const newCount = exchangeCount + 1;
      setExchangeCount(newCount);
      if (newCount % 2 === 0) {
        completeStudentLesson(activeStudent.id, `ai-tutor-${Date.now()}`, 30);
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" />
            ASDE AI English Conversation Tutor
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Chatbot de Conversação & Prática Oral
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Converse em inglês em cenários da vida real com inteligência artificial. Receba correções amigáveis, sugestões de vocabulário e ouça a pronúncia nativa.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <div className="text-xs">
            <span className="font-bold text-amber-950 block">Conversas Praticadas</span>
            <span className="text-amber-800 font-semibold">{exchangeCount} interações (+{Math.floor(exchangeCount / 2) * 30} XP)</span>
          </div>
        </div>
      </div>

      {/* Scenario Picker Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SCENARIOS.map((scen) => {
          const Icon = scen.icon;
          const isSelected = selectedScenario.id === scen.id;
          return (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{scen.title}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">ASDE AI Tutor: {selectedScenario.role}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">{selectedScenario.description}</p>
            </div>
          </div>

          <button
            onClick={() => handleSelectScenario(selectedScenario)}
            className="p-2 text-slate-400 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/10"
            title="Reiniciar diálogo"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1.5`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed shadow-xs ${
                    isAI
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs'
                  }`}
                >
                  <p className="text-xs sm:text-[13px]">{msg.text}</p>

                  <div className="flex items-center justify-between gap-3 mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => playEnglishAudio(msg.text)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                        title="Ouvir áudio nativo"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Pedagogical Feedback Box */}
                {isAI && (msg.grammarTip || msg.vocabularyBoost) && (
                  <div className="max-w-lg bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-[11px] space-y-1 text-slate-700">
                    {msg.grammarTip && (
                      <div className="flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <span>
                          <strong>Dica Gramatical:</strong> {msg.grammarTip}
                        </span>
                      </div>
                    )}
                    {msg.vocabularyBoost && msg.vocabularyBoost.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="font-bold text-indigo-900">Vocabulary Boost:</span>
                        {msg.vocabularyBoost.map((word, idx) => (
                          <span
                            key={idx}
                            onClick={() => playEnglishAudio(word)}
                            className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 cursor-pointer"
                            title="Clique para ouvir"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 animate-bounce text-indigo-600" />
              <span>O tutor de IA está formulando a resposta em inglês...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggested Replies */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 px-2">
            Sugestões:
          </span>
          {selectedScenario.quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-200"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type your answer in English..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
