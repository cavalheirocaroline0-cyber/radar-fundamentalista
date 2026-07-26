"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const cacheDeAudio = new Map<string, string>();

function nomeDaPagina(pathname: string) {
  if (pathname === "/") return "início";
  if (pathname.startsWith("/empresas")) return "empresas";
  if (pathname.startsWith("/empresa/")) return "empresa";
  if (pathname.startsWith("/ranking")) return "ranking";
  if (pathname.startsWith("/macro")) return "macro";
  if (pathname.startsWith("/ia")) return "IA";
  if (pathname.startsWith("/premium")) return "premium";
  if (pathname.startsWith("/perfil")) return "perfil";
  return "página";
}

function buscarNomeUsuario() {
  if (typeof window === "undefined") return "";

  const chaves = Object.keys(localStorage);

  for (const chave of chaves) {
    const valor = localStorage.getItem(chave);

    if (!valor) continue;

    try {
      const dados = JSON.parse(valor);

      if (typeof dados?.nome === "string") return dados.nome;
      if (typeof dados?.name === "string") return dados.name;
      if (typeof dados?.usuario?.nome === "string") return dados.usuario.nome;
      if (typeof dados?.user?.nome === "string") return dados.user.nome;
      if (typeof dados?.user?.name === "string") return dados.user.name;
    } catch {
      continue;
    }
  }

  return "";
}

function chaveDoAudio(pathname: string) {
  const agora = new Date();

  const data = agora.toISOString().slice(0, 10);
  const hora = agora.getHours();

  return `${pathname}::${data}::${hora}`;
}

export default function DashVoiceAssistant() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tocando, setTocando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [usandoCache, setUsandoCache] = useState(false);

  useEffect(() => {
    pararAudio();
  }, [pathname]);

  async function tocarUrl(url: string) {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onplay = () => setTocando(true);
    audio.onpause = () => setTocando(false);
    audio.onended = () => setTocando(false);

    await audio.play();
  }

  async function ouvirPagina() {
    setErro("");
    setCarregando(true);
    setUsandoCache(false);

    try {
      pararAudio();

      const chave = chaveDoAudio(pathname);
      const audioSalvo = cacheDeAudio.get(chave);

      if (audioSalvo) {
        setUsandoCache(true);
        await tocarUrl(audioSalvo);
        return;
      }

      const resposta = await fetch("/api/voz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pathname,
          nome: buscarNomeUsuario(),
          horaLocal: new Date().getHours()
        })
      });

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => null);
        throw new Error(dados?.erro || "Não foi possível gerar a voz.");
      }

      const blob = await resposta.blob();
      const url = URL.createObjectURL(blob);

      cacheDeAudio.set(chave, url);

      await tocarUrl(url);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro ao reproduzir a voz do Dash.";

      setErro(mensagem);
      setTocando(false);
    } finally {
      setCarregando(false);
    }
  }

  function pararAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setTocando(false);
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 md:bottom-6">
      {erro && (
        <div className="max-w-xs rounded-2xl border border-red-400/30 bg-red-950/95 px-4 py-3 text-xs text-red-100 shadow-xl">
          {erro}
        </div>
      )}

      <div className="rounded-3xl border border-emerald-400/30 bg-slate-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Voz do Dash
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={ouvirPagina}
            disabled={carregando}
            className="rounded-2xl bg-emerald-400 px-4 py-3 text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando
              ? "Gerando voz..."
              : tocando
                ? "Falando..."
                : `🎧 Ouvir ${nomeDaPagina(pathname)}`}
          </button>

          {tocando && (
            <button
              type="button"
              onClick={pararAudio}
              className="rounded-2xl border border-slate-700 px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-emerald-400"
            >
              Parar
            </button>
          )}
        </div>

        {usandoCache && (
          <p className="mt-2 px-2 text-[11px] text-slate-500">
            Reproduzindo a leitura já gerada desta página.
          </p>
        )}
      </div>
    </div>
  );
}
