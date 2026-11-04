import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, Upload, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface CameraPhotoCaptureProps {
  currentPhoto?: string | null;
  onPhotoCaptured: (photoDataUrl: string) => void;
  label?: string;
}

export const CameraPhotoCapture: React.FC<CameraPhotoCaptureProps> = ({
  currentPhoto,
  onPhotoCaptured,
  label = 'Tirar Foto para o Processo de Inscrição',
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(currentPhoto || null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks helper
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste navegador ou ambiente.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError(
        'Não foi possível acessar a câmera (permissão recusada ou dispositivo indisponível). Você pode carregar um arquivo de imagem abaixo.'
      );
      setIsCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const startX = ((video.videoWidth || size) - size) / 2;
    const startY = ((video.videoHeight || size) - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPreviewPhoto(dataUrl);
    stopCameraStream();
    setIsCameraActive(false);
    onPhotoCaptured(dataUrl);
  };

  const handleRetake = () => {
    setPreviewPhoto(null);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewPhoto(result);
        stopCameraStream();
        setIsCameraActive(false);
        onPhotoCaptured(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-emerald-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-emerald-700" />
          <span>{label}</span>
        </label>
        {previewPhoto && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Foto Anexada ao Processo
          </span>
        )}
      </div>

      {cameraError && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Viewfinder when Camera is Active */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500 shadow-md">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-64 object-cover -scale-x-100"
          />

          {/* Guidelines framing overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-44 h-44 rounded-full border-2 border-dashed border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <span className="text-[10px] text-white/90 bg-slate-900/80 px-2 py-0.5 rounded-md">
                Enquadre o rosto
              </span>
            </div>
          </div>

          {/* Controls bar over video */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 px-4">
            <button
              type="button"
              onClick={captureSnapshot}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Capturar Foto Agora</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setIsCameraActive(false);
              }}
              className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-xs cursor-pointer"
              title="Cancelar Câmera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : previewPhoto ? (
        /* Preview of the Captured Photo */
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white rounded-xl border border-emerald-200">
          <div className="relative">
            <img
              src={previewPhoto}
              alt="Foto do Processo"
              className="w-24 h-24 rounded-full object-cover border-3 border-emerald-600 shadow-md"
            />
            <span className="absolute bottom-0 right-0 p-1 bg-emerald-600 text-white rounded-full shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <p className="text-xs font-bold text-slate-800">
              Fotografia oficial registrada para a ficha do formando.
            </p>
            <p className="text-[11px] text-slate-500">
              Esta imagem será anexada ao processo acadêmico e destacada no ranking de desempenho.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tirar Nova Foto</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Substituir por Arquivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Initial Action: Trigger Live Camera or Upload */
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border-2 border-dashed border-emerald-300">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">
                Fotografia Obrigatória para o Processo
              </p>
              <p className="text-[11px] text-slate-500">
                Tire a foto diretamente pela câmera do computador/celular no ato da inscrição.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={startCamera}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Abrir Câmera</span>
            </button>

            <label className="px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anexar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
