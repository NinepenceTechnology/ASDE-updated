import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Monitor, Apple, X, CheckCircle2, Sparkles } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  // If already running standalone, display a small verified pill or hide
  if (isInstalled) {
    return null;
  }

  const handleButtonClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        title="Instalar App no Celular (Android/iOS) ou Windows"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-500/40 text-[11px] font-bold transition shadow-xs cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">App</span>
      </button>

      {/* iOS Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-emerald-100 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-800" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Instalar no iPhone / iPad (iOS)
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <p>
                  No Safari do iOS, toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima na barra inferior).
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <p>
                  Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <p>
                  Toque em <strong>Adicionar</strong>. O aplicativo do CFP - ASDE será aberto sem barras de navegação com tela cheia.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Multiplatform Guide Modal (Android APK / Windows / macOS) */}
      {showGenericModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-emerald-100 text-slate-800 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Compatibilidade: iOS, Android (APK) e Windows
                </h3>
              </div>
              <button
                onClick={() => setShowGenericModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              O aplicativo do <strong>Centro de Formação Profissional ASDE</strong> foi construído como PWA (Progressive Web Application) universal, funcionando com desempenho nativo em qualquer sistema:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold">Android (APK / PWA)</strong>
                  <span className="text-slate-600">
                    Toque nos 3 pontos do Chrome e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong> para gerar o APK nativo no seu dispositivo.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Monitor className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold">Windows & Computador</strong>
                  <span className="text-slate-600">
                    No Google Chrome ou Microsoft Edge, clique no ícone de computador/instalação na barra de endereço para instalar como aplicativo de desktop autônomo.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Apple className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold">Apple iOS (iPhone / iPad)</strong>
                  <span className="text-slate-600">
                    No Safari, toque em Compartilhar e selecione <strong>"Adicionar à Tela de Início"</strong>.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGenericModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Fechar Guia
            </button>
          </div>
        </div>
      )}
    </>
  );
};
