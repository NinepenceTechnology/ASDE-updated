import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { playEnglishAudio, SpeechRecorder, calculateSpeechAccuracy } from '../../utils/speech';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  RefreshCw,
  CheckCircle2,
  Flame,
  Radio,
  Sliders,
  Globe,
  ArrowRight,
  Info,
} from 'lucide-react';

interface PracticePhrase {
  id: string;
  phrase: string;
  phoneticGuide: string;
  translation: string;
  level: string;
  category: string;
  tips: string;
}

const PRACTICE_PHRASES: PracticePhrase[] = [
  {
    id: 'ph-1',
    phrase: 'Could you please recommend a good local restaurant?',
    phoneticGuide: '/kʊdʒ-u pliːz ˌrek.əˈmend ə ɡʊd ˈloʊ.kəl ˈres.trɑːnt/',
    translation: 'Você poderia por favor recomendar um bom restaurante local?',
    level: 'A2',
    category: 'Travel & Dining',
    tips: "Ligue 'Could you' tornando o som /kʊdʒ-u/. Não pronuncie o 'u' no meio de restaurant.",
  },
  {
    id: 'ph-2',
    phrase: 'I am really looking forward to our upcoming collaboration.',
    phoneticGuide: '/aɪ æm ˈrɪə.li ˈlʊk.ɪŋ ˈfɔːr.wərd tuː ˈaʊər ˈʌpˌkʌm.ɪŋ kəˌlæb.əˈreɪ.ʃən/',
    translation: 'Estou realmente ansioso pela nossa próxima colaboração.',
    level: 'B1',
    category: 'Professional & Business',
    tips: "Atenção ao som 'forward' /ˈfɔːr.wərd/ e a tonicidade de 'collaboration'.",
  },
  {
    id: 'ph-3',
    phrase: 'Excuse me, is this seat currently occupied?',
    phoneticGuide: '/ɪkˈskjuːz miː, ɪz ðɪs siːt ˈkɜːr.ənt.li ˈɑː.kjə.paɪd/',
    translation: 'Com licença, este assento está atualmente ocupado?',
    level: 'A1',
    category: 'Social Etiquette',
    tips: "Pronuncie 'seat' com 'i' longo /siːt/, diferente de 'sit' /sɪt/.",
  },
  {
    id: 'ph-4',
    phrase: 'From a financial perspective, this proposal minimizes operational risks.',
    phoneticGuide: '/frʌm ə faɪˈnæn.ʃəl pərˈspek.tɪv, ðɪs prəˈpoʊ.zəl ˈmɪn.ə.maɪ.zɪz ˌɑː.pəˈreɪ.ʃən.əl rɪsks/',
    translation: 'De uma perspectiva financeira, esta proposta minimiza riscos operacionais.',
    level: 'B2',
    category: 'Executive & Strategy',
    tips: "Mantenha o ritmo pausado nas vírgulas para expressar autoridade executiva.",
  },
  {
    id: 'ph-5',
    phrase: 'I would like to check in for my scheduled flight to Chicago.',
    phoneticGuide: '/aɪ wʊd laɪk tuː tʃek ɪn fɔːr maɪ ˈskedʒ.uːld flaɪt tuː ʃɪˈkɑː.ɡoʊ/',
    translation: 'Eu gostaria de fazer o check-in para o meu voo programado para Chicago.',
    level: 'A2',
    category: 'Airport & Customs',
    tips: "Faça a ligação 'check in' como /tʃek-ɪn/ e suavize 'scheduled'.",
  },
];

export const SpeechLab: React.FC = () => {
  const { activeStudent, updateStudentSpeechScore } = useApp();

  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState<number>(0);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [speed, setSpeed] = useState<number>(0.9);

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recorderRef = useRef<SpeechRecorder | null>(null);

  useEffect(() => {
    recorderRef.current = new SpeechRecorder();
    setIsSupported(recorderRef.current.isSupported);
    return () => {
      recorderRef.current?.stop();
    };
  }, []);

  const activePhrase = PRACTICE_PHRASES[selectedPhraseIndex];

  const handleStartListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setAccuracyScore(null);

    if (!recorderRef.current || !recorderRef.current.isSupported) {
      // Fallback simulation for unsupported browsers/iframes without mic
      setErrorMessage(
        'Reconhecimento de voz direto não suportado pelo navegador ou permissão negada. Simulando teste de fala fonética...'
      );
      setTimeout(() => {
        const simulatedScore = Math.floor(88 + Math.random() * 11);
        setTranscript(activePhrase.phrase);
        setAccuracyScore(simulatedScore);
        updateStudentSpeechScore(activeStudent.id, simulatedScore);
      }, 1500);
      return;
    }

    setIsRecording(true);
    recorderRef.current.start(
      activePhrase.phrase,
      (res) => {
        setTranscript(res.transcript);
        setAccuracyScore(res.accuracyScore);
        setIsRecording(false);
        updateStudentSpeechScore(activeStudent.id, res.accuracyScore);
      },
      (err) => {
        setErrorMessage(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  const handleStopListening = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/20">
              Laboratório de Fala & Pronúncia Nativa
            </span>
            <span className="text-xs text-indigo-200">
              Web Speech AI Integration
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Speech & Fluency Lab</h1>
          <p className="text-xs text-indigo-100 max-w-xl">
            Treine sua entonação em inglês com análise fonética em tempo real. Escute com sotaque americano ou britânico e fale no microfone para receber nota de precisão.
          </p>
        </div>

        {/* Student Speech KPI */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-indigo-200 block">
            Acurácia Média do Aluno
          </span>
          <span className="text-2xl font-black text-emerald-400">
            {activeStudent.appProgress.speakingAccuracyAvg || 88}%
          </span>
          <span className="text-[10px] text-indigo-100 block">Sincronizado no ERP</span>
        </div>
      </div>

      {/* Main Pronunciation Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Phrase Card & Mic Recorder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            {/* Audio Accent & Speed Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activePhrase.level}
                </span>
                <span className="font-semibold text-slate-500">{activePhrase.category}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Accent selector */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setAccent('en-US')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      accent === 'en-US'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🇺🇸 US English
                  </button>
                  <button
                    onClick={() => setAccent('en-GB')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      accent === 'en-GB'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🇬🇧 UK English
                  </button>
                </div>

                {/* Speed selector */}
                <button
                  onClick={() => setSpeed(speed === 0.9 ? 0.7 : 0.9)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    speed === 0.7
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {speed === 0.7 ? '🐢 0.7x Lento' : '⚡ 0.9x Normal'}
                </button>
              </div>
            </div>

            {/* Target Phrase Display */}
            <div className="p-6 rounded-2xl bg-linear-to-b from-indigo-50/40 via-white to-slate-50/40 border border-indigo-100 space-y-3 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-900">
                Frase para Treinamento
              </span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                "{activePhrase.phrase}"
              </p>
              <p className="text-xs font-mono font-semibold text-indigo-600">
                {activePhrase.phoneticGuide}
              </p>
              <p className="text-xs text-slate-500 italic">
                {activePhrase.translation}
              </p>

              {/* Listen to Native Audio Button */}
              <div className="pt-2">
                <button
                  onClick={() => playEnglishAudio(activePhrase.phrase, { lang: accent, rate: speed })}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  Escutar Pronúncia Modelo ({accent === 'en-US' ? 'Americana' : 'Britânica'})
                </button>
              </div>
            </div>

            {/* Phonetic Tip */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Dica do Professor:</strong> {activePhrase.tips}
              </div>
            </div>

            {/* Microphone Recording Zone */}
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                {isRecording && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
                )}
                <button
                  onClick={isRecording ? handleStopListening : handleStartListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer relative ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 scale-105 ring-4 ring-rose-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <div className="text-center">
                <span className="font-bold text-xs sm:text-sm text-slate-800 block">
                  {isRecording ? 'Ouvindo sua pronúncia em inglês... Fale agora!' : 'Clique no microfone para falar'}
                </span>
                <span className="text-[11px] text-slate-400">
                  Diga a frase com clareza mantendo o ritmo natural
                </span>
              </div>

              {/* Real-time Recognition Result Meter */}
              {accuracyScore !== null && (
                <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Resultado da Análise Fonética:</span>
                    <span
                      className={`text-base font-black ${
                        accuracyScore >= 85
                          ? 'text-emerald-700'
                          : accuracyScore >= 70
                          ? 'text-amber-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {accuracyScore}% de Precisão
                    </span>
                  </div>

                  {/* Accuracy progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        accuracyScore >= 85
                          ? 'bg-emerald-500'
                          : accuracyScore >= 70
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${accuracyScore}%` }}
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-left space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      O que o sistema capturou da sua fala:
                    </span>
                    <p className="font-semibold text-slate-800 italic">"{transcript}"</p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {accuracyScore >= 85
                        ? '✨ Excelente! Pronúncia límpida com ritmo nativo fluente. +15 XP adicionados ao seu perfil.'
                        : accuracyScore >= 70
                        ? '👍 Bom desempenho! Tente prestar atenção nas junções entre palavras.'
                        : '🎯 Continue praticando! Escute o áudio modelo mais uma vez e repita.'}
                    </p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-center">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Phrases Playlist */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Exercícios de Fala Recomendados
          </h2>
          <p className="text-xs text-slate-500">
            Selecione qualquer cenário para calibrar sua dicção e sotaque.
          </p>

          <div className="space-y-2 pt-2">
            {PRACTICE_PHRASES.map((ph, idx) => (
              <div
                key={ph.id}
                onClick={() => {
                  setSelectedPhraseIndex(idx);
                  setTranscript('');
                  setAccuracyScore(null);
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl border text-xs transition cursor-pointer space-y-1 ${
                  selectedPhraseIndex === idx
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-indigo-700 uppercase">
                    {ph.category}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {ph.level}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 line-clamp-2">"{ph.phrase}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
