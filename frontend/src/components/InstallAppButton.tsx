"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const navigatorWithStandalone = window.navigator as Navigator & {
      standalone?: boolean;
    };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true;

    const userAgent = window.navigator.userAgent.toLowerCase();

    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);

    setIsInstalled(isStandalone);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos && !installPrompt) {
      setShowIosHelp(true);
      return;
    }

    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }

    setInstallPrompt(null);
  };

  if (isInstalled) {
    return null;
  }

  if (!installPrompt && !isIos) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="fixed bottom-24 left-1/2 md:bottom-5 z-50 -translate-x-1/2 rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-400/30 transition hover:bg-sky-300"
      >
        📲 Instalar Dash Diário
      </button>

      {showIosHelp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-950 p-6 text-slate-100 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
                  Instalar no iPhone
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Adicione o Dash Diário à tela inicial
                </h2>
              </div>

              <button
                onClick={() => setShowIosHelp(false)}
                className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>
                No iPhone, a instalação é feita pelo Safari. Siga estes passos:
              </p>

              <ol className="space-y-3">
                <li className="rounded-2xl bg-slate-900 p-3">
                  <strong className="text-slate-100">1.</strong> Abra o site no
                  Safari.
                </li>

                <li className="rounded-2xl bg-slate-900 p-3">
                  <strong className="text-slate-100">2.</strong> Toque no botão
                  de compartilhar.
                </li>

                <li className="rounded-2xl bg-slate-900 p-3">
                  <strong className="text-slate-100">3.</strong> Escolha
                  “Adicionar à Tela de Início”.
                </li>

                <li className="rounded-2xl bg-slate-900 p-3">
                  <strong className="text-slate-100">4.</strong> Confirme em
                  “Adicionar”.
                </li>
              </ol>

              <p className="text-xs text-slate-400">
                Depois disso, o ícone do Dash Diário aparecerá junto dos seus
                aplicativos.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
