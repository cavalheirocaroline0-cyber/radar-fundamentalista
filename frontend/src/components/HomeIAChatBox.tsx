"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type UsuarioDash = {
  nome?: string;
  email?: string;
};

const perguntasRapidas = [
  "Como está o mercado hoje?",
  "Me explica o que é ROE.",
  "O que olhar antes de analisar uma empresa?",
];

export default function HomeIAChatBox() {
  const [usuario, setUsuario] = useState<UsuarioDash | null>(null);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("dash_usuario");
      const token = localStorage.getItem("dash_token");

      if (salvo && token) {
        setUsuario(JSON.parse(salvo));
      }
    } catch {
      setUsuario(null);
    }
  }, []);

  async function perguntar(texto?: string) {
    const perguntaFinal = (texto || pergunta).trim();

    if (!usuario) {
      setErro("Crie sua conta grátis para usar a IA do Dash durante o beta.");
      return;
    }

    if (!perguntaFinal) {
      setErro("Digite uma pergunta para a IA do Dash.");
      return;
    }

    setPergunta(perguntaFinal);
    setResposta("");
    setErro("");
    setCarregando(true);

    try {
      const retorno = await fetch(`${API_URL}/ia/perguntar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pergunta: perguntaFinal,
        }),
      });

      const dados = await retorno.json();

      if (!retorno.ok) {
        setErro(dados.detail || "Não foi possível consultar a IA agora.");
        return;
      }

      setResposta(dados.resposta || "A IA respondeu, mas não retornou texto.");
    } catch {
      setErro("Erro ao conectar com o servidor da IA.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mt-4 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-lg">
          🤖
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
            IA do Dash
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Pergunte sobre mercado, indicadores, empresas e conceitos fundamentalistas.
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3">
            <textarea
              value={pergunta}
              onChange={(event) => setPergunta(event.target.value)}
              maxLength={280}
              placeholder="Ex: Dash, me explica o que é ROE?"
              className="min-h-24 w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-600"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {pergunta.length}/280
              </p>

              <button
                type="button"
                onClick={() => perguntar()}
                disabled={carregando}
                className="rounded-full bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando ? "Pensando..." : "Perguntar"}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {perguntasRapidas.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => perguntar(item)}
                disabled={carregando}
                className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300 disabled:opacity-60"
              >
                {item}
              </button>
            ))}
          </div>

          {!usuario && (
            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100">
              Durante o beta, a IA está liberada para usuários cadastrados.
              <Link href="/cadastro" className="ml-1 font-black text-emerald-200 hover:text-white">
                Criar conta grátis.
              </Link>
            </div>
          )}

          {erro && (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm leading-6 text-red-200">
              {erro}
            </div>
          )}

          {resposta && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                Resposta
              </p>

              <div className="mt-3 max-h-72 overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {resposta}
              </div>
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Uso educativo. O Dash não recomenda compra, venda ou manutenção de ativos.
          </p>
        </div>
      </div>
    </div>
  );
}
