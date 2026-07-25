"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const sugestoes = [
  "Oi Dash, como está o mercado hoje?",
  "Explique o que é ROE de forma simples.",
  "Como analisar dívida líquida sobre patrimônio?",
  "O que significa dividend yield?",
  "Compare ROE, P/L e P/VP em linguagem simples.",
];

type UsuarioDash = {
  nome?: string;
  email?: string;
  plano?: string;
  status_assinatura?: string;
};

export default function IAPage() {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [checandoUsuario, setChecandoUsuario] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioDash | null>(null);

  useEffect(() => {
    async function iniciar() {
      try {
        const params = new URLSearchParams(window.location.search);
        const perguntaUrl = params.get("pergunta");

        if (perguntaUrl) {
          setPergunta(perguntaUrl);
        }

        const usuarioSalvo = localStorage.getItem("dash_usuario");

        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        }

        const token = localStorage.getItem("dash_token");

        if (!token) {
          return;
        }

        const retorno = await fetch(`${API_URL}/usuarios/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (retorno.ok) {
          const dados = await retorno.json();
          const usuarioAtualizado = dados.usuario || dados;

          setUsuario(usuarioAtualizado);
          localStorage.setItem("dash_usuario", JSON.stringify(usuarioAtualizado));
        }
      } catch {
        // Se falhar, mantém o usuário salvo localmente, quando existir.
      } finally {
        setChecandoUsuario(false);
      }
    }

    iniciar();
  }, []);

  async function perguntarIA(texto?: string) {
    const perguntaFinal = (texto || pergunta).trim();

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

  if (checandoUsuario) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />

        <section className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-slate-300">Preparando a IA do Dash...</p>
        </section>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
              IA liberada no beta
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              Crie sua conta grátis para usar a IA do Dash.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Durante o período beta, a IA está liberada para usuários cadastrados.
              Crie sua conta gratuitamente e use o Dash para entender mercado,
              empresas, indicadores e rankings em linguagem simples.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="inline-flex justify-center rounded-full bg-sky-400 px-8 py-4 text-base font-black text-slate-950 transition hover:bg-sky-300"
              >
                Criar minha conta grátis
              </Link>

              <Link
                href="/entrar"
                className="inline-flex justify-center rounded-full border border-white/15 px-8 py-4 text-base font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300"
              >
                Já tenho conta
              </Link>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              O Dash Diário é educativo e informativo. Não fazemos recomendações de investimento.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-28 text-white">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-sky-400/20 bg-gradient-to-br from-sky-400/10 via-white/[0.03] to-slate-950 p-6 shadow-2xl shadow-sky-950/30 md:p-10">
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            ✨ IA liberada no beta
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Pergunte para a IA do Dash Diário.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Durante o beta, todos os usuários cadastrados podem usar a IA do Dash
            para entender indicadores, empresas, rankings e cenário de mercado
            com explicações simples e educativas.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
            O Dash Diário é uma ferramenta informativa e educacional. A IA não faz
            recomendação de compra, venda ou manutenção de ativos.
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <label className="text-sm font-semibold text-slate-300">
              Sua pergunta
            </label>

            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Ex: Oi Dash, como está o mercado hoje?"
              className="mt-3 min-h-40 w-full resize-none rounded-3xl border border-white/10 bg-slate-900 p-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400"
            />

            <button
              onClick={() => perguntarIA()}
              disabled={carregando}
              className="mt-4 w-full rounded-full bg-sky-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Consultando IA..." : "Perguntar para a IA"}
            </button>

            {erro && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                {erro}
              </div>
            )}

            {resposta && (
              <div className="mt-6 rounded-3xl border border-sky-400/20 bg-slate-900/80 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                  Resposta da IA
                </p>

                <div className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-200">
                  {resposta}
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <h2 className="text-2xl font-bold">Perguntas rápidas</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Comece por uma dessas perguntas para testar a IA do Dash.
            </p>

            <div className="mt-5 space-y-3">
              {sugestoes.map((item) => (
                <button
                  key={item}
                  onClick={() => perguntarIA(item)}
                  disabled={carregando}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-left text-sm font-semibold text-slate-300 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-300 disabled:opacity-60"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-white">
                Melhor uso da IA
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use para entender conceitos, comparar indicadores e estudar empresas.
                Para decisões financeiras, faça sua própria análise ou consulte um profissional.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
