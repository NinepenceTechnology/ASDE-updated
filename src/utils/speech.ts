/**
 * Web Speech API utilities for native English pronunciation playback and recognition
 */

export const playEnglishAudio = (
  text: string,
  options?: { rate?: number; pitch?: number; lang?: 'en-US' | 'en-GB' }
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending utterance

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options?.lang || 'en-US';
  utterance.rate = options?.rate || 0.9; // slightly calibrated for clarity
  utterance.pitch = options?.pitch || 1.0;

  // Try to pick a natural sounding native voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith(options?.lang === 'en-GB' ? 'en-GB' : 'en-US') &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('English'))
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Calculate normalized similarity percentage between spoken text and expected target
export const calculateSpeechAccuracy = (spoken: string, expected: string): number => {
  const cleanSpoken = spoken
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
  const cleanExpected = expected
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();

  if (cleanSpoken === cleanExpected) return 100;
  if (!cleanSpoken || !cleanExpected) return 0;

  // Word level accuracy
  const expectedWords = cleanExpected.split(/\s+/);
  const spokenWords = cleanSpoken.split(/\s+/);

  let matchCount = 0;
  for (const word of expectedWords) {
    if (spokenWords.includes(word)) {
      matchCount++;
    }
  }

  const wordScore = (matchCount / expectedWords.length) * 100;

  // Character Levenshtein distance for finer precision
  const matrix: number[][] = [];
  for (let i = 0; i <= cleanSpoken.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= cleanExpected.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= cleanSpoken.length; i++) {
    for (let j = 1; j <= cleanExpected.length; j++) {
      if (cleanSpoken.charAt(i - 1) === cleanExpected.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[cleanSpoken.length][cleanExpected.length];
  const maxLen = Math.max(cleanSpoken.length, cleanExpected.length);
  const charScore = Math.max(0, ((maxLen - distance) / maxLen) * 100);

  return Math.round((wordScore * 0.6 + charScore * 0.4));
};

export interface SpeechRecognitionResult {
  transcript: string;
  accuracyScore: number;
}

export class SpeechRecorder {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  public get isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(
    targetText: string,
    onResult: (res: SpeechRecognitionResult) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('O seu navegador não suporta a Web Speech API. Use o Chrome ou Edge.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const accuracyScore = calculateSpeechAccuracy(transcript, targetText);
      onResult({ transcript, accuracyScore });
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error === 'no-speech' ? 'Nenhuma fala detectada. Tente novamente falando perto do microfone.' : `Erro: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError(err.message || 'Falha ao iniciar microfone.');
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}
