import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Download,
  Type,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { playEnglishAudio } from '../../utils/speech';

interface WhiteboardCanvasProps {
  onClose?: () => void;
  classNameTitle?: string;
  teacherName?: string;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  onClose,
  classNameTitle = 'Quadro Virtual da Aula',
  teacherName = 'Professor',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#10b981'); // Emerald
  const [lineWidth, setLineWidth] = useState<number>(3);

  // Vocabulary chips on whiteboard
  const [vocabNotes, setVocabNotes] = useState<
    Array<{ id: string; term: string; translation: string; pronunciationTip: string }>
  >([
    {
      id: 'v-1',
      term: 'Carry on',
      translation: 'Continuar / Prosseguir',
      pronunciationTip: '/ˈkæri ɒn/ • Phrasal verb',
    },
    {
      id: 'v-2',
      term: 'Breakthrough',
      translation: 'Avanço / Conquista significativa',
      pronunciationTip: '/ˈbreɪkˌθruː/ • Noun',
    },
    {
      id: 'v-3',
      term: 'Fluency & Accuracy',
      translation: 'Fluência e Precisão gramatical',
      pronunciationTip: 'Foco na conversação sem receio',
    },
  ]);

  const [newVocabTerm, setNewVocabTerm] = useState('');
  const [newVocabTrans, setNewVocabTrans] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill initial dark slate chalkboard background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Default welcoming teacher note
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`Quadro Virtual • ${classNameTitle}`, 24, 36);
    ctx.font = '13px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Mediação: ${teacherName} • Anote estruturas, correções fonéticas e gramática`, 24, 58);
  }, [classNameTitle, teacherName]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 24;
      ctx.globalAlpha = 1.0;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 18;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 1.0;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const downloadWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `quadro-aula-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const addVocabChip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVocabTerm.trim()) return;

    setVocabNotes((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}`,
        term: newVocabTerm.trim(),
        translation: newVocabTrans.trim() || 'Vocabulário da aula',
        pronunciationTip: 'Pratique a pronúncia com a turma',
      },
    ]);
    setNewVocabTerm('');
    setNewVocabTrans('');
  };

  const removeVocab = (id: string) => {
    setVocabNotes((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-700 p-4 sm:p-5 text-white shadow-2xl flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              Quadro Virtual Interativo (Whiteboard)
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Ao Vivo
              </span>
            </h4>
            <span className="text-[10px] text-slate-400">
              O professor pode desenhar, esquematizar regras gramaticais e salvar para os formandos.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            title="Limpar quadro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>

          <button
            type="button"
            onClick={downloadWhiteboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            title="Descarregar quadro"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salvar Imagem</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Drawing Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800 text-xs">
        {/* Tool Selector */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTool('pen')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              tool === 'pen'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Caneta</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('highlighter')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              tool === 'highlighter'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marcador</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              tool === 'eraser'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Borracha</span>
          </button>
        </div>

        {/* Color Palette */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Cor:</span>
            <div className="flex items-center gap-1.5">
              {[
                { hex: '#10b981', label: 'Verde Esmeralda' },
                { hex: '#38bdf8', label: 'Azul Claro' },
                { hex: '#f59e0b', label: 'Âmbar' },
                { hex: '#f43f5e', label: 'Rosa / Destaque' },
                { hex: '#ffffff', label: 'Branco' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  title={c.label}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer border-2 ${
                    color === c.hex ? 'scale-125 border-white ring-2 ring-emerald-400' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Line Thickness */}
        {tool === 'pen' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Espessura:</span>
            <div className="flex items-center gap-1">
              {[2, 4, 8].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setLineWidth(w)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                    lineWidth === w ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Drawing Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={900}
          height={420}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[320px] sm:h-[400px] cursor-crosshair touch-none block"
        />
      </div>

      {/* Live Vocabulary Chips added during the Call */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-emerald-400" />
            Vocabulário & Expressões Anotadas na Aula ao Vivo ({vocabNotes.length})
          </span>
          <span className="text-[10px] text-slate-500">
            Clique no ícone de som para ouvir a pronúncia nativa
          </span>
        </div>

        {/* Chips Grid */}
        <div className="flex flex-wrap gap-2">
          {vocabNotes.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs shadow-xs group"
            >
              <button
                type="button"
                onClick={() => playEnglishAudio(v.term)}
                className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white transition cursor-pointer"
                title={`Ouvir pronúncia: "${v.term}"`}
              >
                <Volume2 className="w-3 h-3" />
              </button>
              <div>
                <strong className="text-emerald-300 font-bold block leading-tight">{v.term}</strong>
                <span className="text-[10px] text-slate-400">{v.translation}</span>
              </div>
              <button
                type="button"
                onClick={() => removeVocab(v.id)}
                className="text-slate-500 hover:text-rose-400 transition cursor-pointer ml-1"
                title="Remover"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Add Vocab Form */}
        <form onSubmit={addVocabChip} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Nova palavra em inglês (ex: Breakthrough)..."
            value={newVocabTerm}
            onChange={(e) => setNewVocabTerm(e.target.value)}
            className="flex-1 w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 focus:outline-hidden focus:border-emerald-500 text-white placeholder-slate-500"
          />
          <input
            type="text"
            placeholder="Significado em português..."
            value={newVocabTrans}
            onChange={(e) => setNewVocabTrans(e.target.value)}
            className="flex-1 w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 focus:outline-hidden focus:border-emerald-500 text-white placeholder-slate-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-xs"
          >
            Adicionar ao Quadro
          </button>
        </form>
      </div>
    </div>
  );
};
