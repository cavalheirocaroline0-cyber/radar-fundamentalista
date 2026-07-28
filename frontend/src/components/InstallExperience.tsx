"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function registrarEvento(nome: string) {
  const janela = window as Window & {
    gtag?: (comando: string, evento: string, parametros?: Record<string, string>) => void;
  };

  janela.gtag?.("event", nome, { origem: "home_install_section" });
}

export default function InstallExperience() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

    const detectionTimer = window.setTimeout(() => {
      setIsInstalled(standalone);
      setIsIos(ios);
    }, 0);

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      registrarEvento("pwa_instalada");
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(detectionTimer);
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function instalar() {
    registrarEvento("clique_instalar_pwa");

    if (isInstalled) return;

    if (isIos || !installPrompt) {
      setShowHelp(true);
      return;
    }

    await installPrompt.prompt();
    const escolha = await installPrompt.userChoice;
    if (escolha.outcome === "accepted") setIsInstalled(true);
    setInstallPrompt(null);
  }

  return (
    <section id="instalar" className="scroll-mt-24 border-y border-white/8 bg-[#061126]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Do navegador para a sua rotina</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            O Dash fica a um toque de distância.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Adicione o Dash Diário à tela inicial e abra como um aplicativo — sem
            procurar link, sem loja e sem ocupar sua manhã.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={instalar}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-7 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              {isInstalled ? "Dash já instalado" : "Instalar na tela inicial"}
            </button>
            <Link href="/cadastro" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/12 px-7 font-bold text-white transition hover:border-sky-300/50 hover:bg-white/[0.04]">
              Primeiro, criar minha conta
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Funciona no Android e no iPhone. A instalação é gratuita.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-sky-400/10 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-[#020817] p-5 sm:p-7">
            <div className="flex items-center gap-4 border-b border-white/8 pb-5">
              <Image src="/dash-icon-navbar.png" alt="Ícone do aplicativo Dash Diário" width={72} height={72} className="h-16 w-16 rounded-2xl object-cover shadow-[0_0_30px_rgba(14,165,233,0.25)]" />
              <div>
                <p className="text-lg font-black text-white">Dash Diário</p>
                <p className="mt-1 text-sm text-slate-400">Seu mercado, todos os dias.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["1", "Abra o site", "Use Safari no iPhone ou Chrome no Android."],
                ["2", "Adicione", "Escolha instalar ou adicionar à tela inicial."],
                ["3", "Volte amanhã", "Abra pelo ícone e acompanhe o novo dia."],
              ].map(([numero, titulo, texto]) => (
                <div key={numero} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-300/12 text-sm font-black text-sky-300">{numero}</span>
                  <p className="mt-4 font-black text-white">{titulo}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="install-help-title">
          <div className="w-full max-w-md rounded-[2rem] border border-sky-300/20 bg-[#061126] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">Instalação rápida</p>
                <h3 id="install-help-title" className="mt-2 text-2xl font-black text-white">
                  {isIos ? "Adicionar no iPhone" : "Adicionar no celular"}
                </h3>
              </div>
              <button type="button" onClick={() => setShowHelp(false)} aria-label="Fechar instruções" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-slate-300 hover:bg-white/12">
                ✕
              </button>
            </div>

            <ol className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
              {isIos ? (
                <>
                  <li className="rounded-2xl bg-white/[0.04] p-4"><strong className="text-white">1.</strong> Abra o Dash no Safari.</li>
                  <li className="rounded-2xl bg-white/[0.04] p-4"><strong className="text-white">2.</strong> Toque em Compartilhar.</li>
                  <li className="rounded-2xl bg-white/[0.04] p-4"><strong className="text-white">3.</strong> Escolha “Adicionar à Tela de Início”.</li>
                </>
              ) : (
                <>
                  <li className="rounded-2xl bg-white/[0.04] p-4"><strong className="text-white">1.</strong> Abra o menu do navegador.</li>
                  <li className="rounded-2xl bg-white/[0.04] p-4"><strong className="text-white">2.</strong> Toque em “Instalar app” ou “Adicionar à tela inicial”.</li>
                  <li className="rounded-2xl bg-white/[0.04] p-4"><strong className="text-white">3.</strong> Confirme a instalação.</li>
                </>
              )}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
