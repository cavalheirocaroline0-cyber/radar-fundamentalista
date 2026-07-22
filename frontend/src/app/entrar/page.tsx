"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.detail || "Não foi possível entrar.");
        return;
      }

      localStorage.setItem("token", dados.token);
      localStorage.setItem("dash_token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));
      localStorage.setItem("dash_usuario", JSON.stringify(dados.usuario));

      window.dispatchEvent(new Event("auth-changed"));

      setMensagem("Login realizado com sucesso! Redirecionando...");

      setTimeout(() => {
        window.location.href = "/perfil";
      }, 800);
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
              👤 Entrar no Dash
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Acesse sua conta e continue sua rotina diária.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Entre para acessar sua watchlist, empresas favoritas e sua área personalizada no Dash Diário.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Sua experiência
              </p>

              <ul className="mt-4 space-y-3 text-slate-300">
                <li>☀️ Resumo diário personalizado</li>
                <li>⭐ Watchlist salva</li>
                <li>🔥 Empresas favoritas</li>
                <li>🔔 Futuramente: alertas inteligentes</li>
              </ul>
            </div>
          </div>

          <form
            onSubmit={entrar}
            className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-sky-950/30"
          >
            <h2 className="text-3xl font-bold">Entrar</h2>
            <p className="mt-2 text-sm text-slate-400">
              Use seu e-mail e senha cadastrados.
            </p>

            <div className="mt-6 space-y-4">
              <div>
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

              <div>
                <label className="text-sm text-slate-300">Senha</label>
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            <div className="mt-3 text-right">
              <Link href="/esqueci-senha" className="text-sm font-semibold text-sky-300 hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            {mensagem && (
              <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar no Dash"}
            </button>

            <p className="mt-5 text-center text-sm text-slate-400">
              Ainda não tem conta?{" "}
              <Link href="/cadastro" className="font-semibold text-sky-300 hover:underline">
                Criar cadastro
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
