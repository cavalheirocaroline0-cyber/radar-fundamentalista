"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [linkRedefinicao, setLinkRedefinicao] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function solicitarRecuperacao(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");
    setLinkRedefinicao("");

    try {
      const resposta = await fetch(`${API_URL}/usuarios/esqueci-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.detail || "Não foi possível gerar recuperação de senha.");
        return;
      }

      setMensagem(dados.mensagem || "Se o e-mail estiver cadastrado, enviaremos instruções.");

      if (dados.link_redefinicao) {
        setLinkRedefinicao(dados.link_redefinicao);
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
              🔐 Recuperação de acesso
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Esqueceu sua senha?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Informe o e-mail cadastrado no Dash Diário para redefinir sua senha
              e voltar para sua watchlist.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Segurança
              </p>
              <p className="mt-4 text-slate-300">
                Por segurança, o Dash não informa se o e-mail existe ou não.
                Se estiver cadastrado, a recuperação será gerada.
              </p>
            </div>
          </div>

          <form
            onSubmit={solicitarRecuperacao}
            className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-sky-950/30"
          >
            <h2 className="text-3xl font-bold">Redefinir senha</h2>
            <p className="mt-2 text-sm text-slate-400">
              Digite seu e-mail para continuar.
            </p>

            <div className="mt-6">
              <label className="text-sm text-slate-300">E-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                placeholder="voce@email.com"
              />
            </div>

            {mensagem && (
              <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
                {mensagem}
              </div>
            )}

            {linkRedefinicao && (
              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                <p className="font-semibold">MVP de teste:</p>
                <p className="mt-2">
                  Por enquanto, o link aparece aqui. Depois vamos enviar por e-mail.
                </p>

                <Link
                  href={linkRedefinicao.replace("http://localhost:3000", "")}
                  className="mt-4 inline-flex rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
                >
                  Redefinir senha
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
            >
              {carregando ? "Gerando link..." : "Gerar recuperação"}
            </button>

            <p className="mt-5 text-center text-sm text-slate-400">
              Lembrou a senha?{" "}
              <Link href="/entrar" className="font-semibold text-sky-300 hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
