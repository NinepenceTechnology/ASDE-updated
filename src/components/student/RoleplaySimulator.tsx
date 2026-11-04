import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { playEnglishAudio } from '../../utils/speech';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Volume2,
  Send,
  Sparkles,
  Plane,
  Briefcase,
  Coffee,
  Building,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface RoleplayScenario {
  id: string;
  title: string;
  category: string;
  icon: any;
  level: string;
  description: string;
  dialogue: {
    id: number;
    partnerName: string;
    partnerSpeech: string;
    partnerAudioLang: 'en-US' | 'en-GB';
    userPrompt: string;
    userOptions: {
      text: string;
      isRecommended: boolean;
      feedback: string;
    }[];
  }[];
}

const SCENARIOS: RoleplayScenario[] = [
  {
    id: 'sc-1',
    title: 'London Heathrow Airport Immigration',
    category: 'Travel & Border Control',
    icon: Plane,
    level: 'A2-B1',
    description: 'Responda com autoridade e naturalidade às perguntas do oficial de fronteira ao desembarcar em Londres.',
    dialogue: [
      {
        id: 1,
        partnerName: 'Officer Miller (UK Border Force)',
        partnerSpeech: 'Good afternoon. Passports and landing cards, please. What is the primary purpose of your stay in the UK?',
        partnerAudioLang: 'en-GB',
        userPrompt: 'Como você responde de forma clara e formal?',
        userOptions: [
          {
            text: "Good afternoon, officer. I'm here for tourism and to visit historical museums in London.",
            isRecommended: true,
            feedback: 'Excelente resposta! Formal, direta e clara.',
          },
          {
            text: 'I want to travel and walk in the street.',
            isRecommended: false,
            feedback: 'Compreensível, porém muito informal para um posto de fronteira.',
          },
        ],
      },
      {
        id: 2,
        partnerName: 'Officer Miller (UK Border Force)',
        partnerSpeech: 'Splendid. Where will you be residing during your ten days here, and do you possess a return ticket?',
        partnerAudioLang: 'en-GB',
        userPrompt: 'Informe sua acomodação e voo de retorno:',
        userOptions: [
          {
            text: 'Yes, I am booked at the Bloomsbury Hotel and my return flight is scheduled for the 24th.',
            isRecommended: true,
            feedback: 'Perfeito! Apresenta detalhes concretos com vocabulário preciso.',
          },
          {
            text: 'I have return flight ticket on my phone.',
            isRecommended: false,
            feedback: 'Gramaticalmente incompleto. Tente usar "I have my return booking confirmation".',
          },
        ],
      },
      {
        id: 3,
        partnerName: 'Officer Miller (UK Border Force)',
        partnerSpeech: 'Everything is in order. Enjoy your holiday in the United Kingdom!',
        partnerAudioLang: 'en-GB',
        userPrompt: 'Agradeça educadamente:',
        userOptions: [
          {
            text: 'Thank you very much, officer. Have a wonderful day!',
            isRecommended: true,
            feedback: 'Polite e cordial. Imigração concluída com sucesso!',
          },
        ],
      },
    ],
  },
  {
    id: 'sc-2',
    title: 'Global Tech Job Interview (STAR Method)',
    category: 'Corporate & Career',
    icon: Briefcase,
    level: 'B2-C1',
    description: 'Conduza uma entrevista executiva com uma recrutadora internacional demonstrando liderança e proatividade.',
    dialogue: [
      {
        id: 1,
        partnerName: 'Sarah Vance (Global Talent Lead)',
        partnerSpeech: 'Hello! Thank you for taking the time today. Could you walk me through a challenging project you recently delivered?',
        partnerAudioLang: 'en-US',
        userPrompt: 'Inicie sua resposta usando conectivos executivos:',
        userOptions: [
          {
            text: 'Certainly, Sarah. Recently, I led a cross-functional squad that streamlined our core API latency by thirty-five percent under tight deadlines.',
            isRecommended: true,
            feedback: 'Excelente uso de quantificadores e métricas de impacto executivo!',
          },
          {
            text: 'I worked a lot on computer programs and finished on time.',
            isRecommended: false,
            feedback: 'Muito vago. Use termos como "delivered", "streamlined", e cite números de impacto.',
          },
        ],
      },
      {
        id: 2,
        partnerName: 'Sarah Vance (Global Talent Lead)',
        partnerSpeech: 'Impressive metrics. How did you resolve communication roadblocks with difficult stakeholders during that rollout?',
        partnerAudioLang: 'en-US',
        userPrompt: 'Demonstre diplomacia e inteligência emocional:',
        userOptions: [
          {
            text: 'I prioritized weekly alignment syncs and proactively addressed concerns with transparent data dashboards.',
            isRecommended: true,
            feedback: 'Resposta de alto impacto executivo.',
          },
          {
            text: 'I told them they had to agree with my plan.',
            isRecommended: false,
            feedback: 'Muito agressivo para uma cultura corporativa global colaborativa.',
          },
        ],
      },
    ],
  },
  {
    id: 'sc-3',
    title: 'Ordering Specialty Coffee in Manhattan',
    category: 'Daily Living',
    icon: Coffee,
    level: 'A1-A2',
    description: 'Faça um pedido personalizado com leite vegetal e temperatura desejada como um nova-iorquino.',
    dialogue: [
      {
        id: 1,
        partnerName: 'Alex (Barista)',
        partnerSpeech: 'Hey there! What can I get started for you today?',
        partnerAudioLang: 'en-US',
        userPrompt: 'Peça seu café com personalização:',
        userOptions: [
          {
            text: 'Hi! Could I get an iced oat milk latte with an extra espresso shot, please?',
            isRecommended: true,
            feedback: 'Formulação nativa impecável!',
          },
          {
            text: 'I want coffee milk and ice.',
            isRecommended: false,
            feedback: 'Tente usar a estrutura educada "Could I get a... please?".',
          },
        ],
      },
      {
        id: 2,
        partnerName: 'Alex (Barista)',
        partnerSpeech: 'You got it. That will be six dollars and fifty cents. Paying with card or Apple Pay?',
        partnerAudioLang: 'en-US',
        userPrompt: 'Informe a forma de pagamento:',
        userOptions: [
          {
            text: "I'll tap with Apple Pay, thanks!",
            isRecommended: true,
            feedback: 'Muito natural e fluido!',
          },
        ],
      },
    ],
  },
];

export const RoleplaySimulator: React.FC = () => {
  const { activeStudent, completeStudentLesson } = useApp();

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [currentDialogueStep, setCurrentDialogueStep] = useState<number>(0);
  const [history, setHistory] = useState<
    { speaker: string; text: string; role: 'partner' | 'user'; feedback?: string }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const scenario = SCENARIOS[selectedScenarioIndex];
  const step = scenario.dialogue[currentDialogueStep];

  // Initialize or reset scenario
  const startScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    setCurrentDialogueStep(0);
    setIsCompleted(false);

    const firstStep = SCENARIOS[index].dialogue[0];
    setHistory([
      {
        speaker: firstStep.partnerName,
        text: firstStep.partnerSpeech,
        role: 'partner',
      },
    ]);
    // Play initial audio
    playEnglishAudio(firstStep.partnerSpeech, { lang: firstStep.partnerAudioLang });
  };

  const handleChooseOption = (option: { text: string; isRecommended: boolean; feedback: string }) => {
    // Add user response to history
    const updatedHistory = [
      ...history,
      {
        speaker: 'You (Student)',
        text: option.text,
        role: 'user' as const,
        feedback: option.feedback,
      },
    ];

    if (currentDialogueStep + 1 < scenario.dialogue.length) {
      const nextStep = scenario.dialogue[currentDialogueStep + 1];
      updatedHistory.push({
        speaker: nextStep.partnerName,
        text: nextStep.partnerSpeech,
        role: 'partner' as const,
      });
      setHistory(updatedHistory);
      setCurrentDialogueStep((prev) => prev + 1);

      // Play audio for partner response
      setTimeout(() => {
        playEnglishAudio(nextStep.partnerSpeech, { lang: nextStep.partnerAudioLang });
      }, 500);
    } else {
      // Completed!
      setHistory(updatedHistory);
      setIsCompleted(true);
      completeStudentLesson(activeStudent.id, `roleplay-${scenario.id}`, 80);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/20">
              Simulador de Conversação Imersiva
            </span>
            <span className="text-xs text-emerald-200">
              Cenários Autênticos do Cotidiano
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Conversational Roleplay</h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            Pratique situações da vida real com áudio nativo e feedback instantâneo de adequação linguística.
          </p>
        </div>

        <button
          onClick={() => startScenario(selectedScenarioIndex)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Diálogo
        </button>
      </div>

      {/* Scenarios Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SCENARIOS.map((sc, idx) => {
          const Icon = sc.icon;
          const isSelected = selectedScenarioIndex === idx;
          return (
            <div
              key={sc.id}
              onClick={() => startScenario(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">
                  {sc.level}
                </span>
                <h3 className="font-bold text-xs text-slate-900 truncate">{sc.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chat Dialogue Screen */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[480px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              AI
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">{scenario.title}</span>
              <span className="text-[10px] text-slate-500">
                {history.length} falas trocadas • Modo Fluência Ativa
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
            Nível {scenario.level}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-slate-50/30">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Clique em "Iniciar Diálogo" ou escolha uma opção abaixo para começar.
            </div>
          ) : (
            history.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                } space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-bold">{msg.speaker}</span>
                  {msg.role === 'partner' && (
                    <button
                      onClick={() => playEnglishAudio(msg.text)}
                      title="Ouvir novamente"
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.feedback && (
                  <span className="text-[11px] text-emerald-600 font-semibold px-1">
                    {msg.feedback}
                  </span>
                )}
              </div>
            ))
          )}

          {isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-black text-sm text-emerald-950">
                Cenário de Conversação Concluído com Sucesso!
              </h4>
              <p className="text-xs text-emerald-800">
                Você demonstrou naturalidade e repertório linguístico no diálogo. +80 XP concedidos!
              </p>
            </div>
          )}
        </div>

        {/* Input / Response Options Area */}
        {!isCompleted && step && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Sua vez de responder: {step.userPrompt}
            </span>

            <div className="space-y-2">
              {step.userOptions.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleChooseOption(opt)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between group"
                >
                  <span>"{opt.text}"</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
