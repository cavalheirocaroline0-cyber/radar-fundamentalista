"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();

    if (!aceitouTermos) {
      setMensagem(
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade."
      );
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.detail || "Não foi possível criar sua conta.");
        return;
      }

      localStorage.setItem("dash_token", dados.token);
      localStorage.setItem("dash_usuario", JSON.stringify(dados.usuario));

      setMensagem("Conta criada com sucesso! Redirecionando...");

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
              ☀️ Todo dia começa com o Dash
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Crie sua conta e personalize seu resumo diário.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Com uma conta, você poderá montar sua watchlist, favoritar empresas
              e receber uma experiência mais personalizada no Dash Diário.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Em breve
              </p>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>⭐ Watchlist personalizada</li>
                <li>🔥 Empresas favoritas</li>
                <li>🔔 Alertas inteligentes</li>
                <li>🤖 IA conectada ao seu perfil</li>
              </ul>
            </div>
          </div>

          <form
            onSubmit={cadastrar}
            className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-sky-950/30"
          >
            <h2 className="text-3xl font-bold">Criar cadastro</h2>
            <p className="mt-2 text-sm text-slate-400">
              Comece gratuitamente.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300">Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  placeholder="Seu nome"
                />
              </div>

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
                  minLength={6}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            {mensagem && (
              <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
                {mensagem}
              </div>
            )}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <input
            id="aceite"
            type="checkbox"
            checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
            className="mt-1 h-4 w-4 accent-sky-400"
          />

          <label
            htmlFor="aceite"
            className="text-sm leading-6 text-slate-300"
          >
            Li e aceito os{" "}
            <Link
              href="/termos-de-uso"
              target="_blank"
              className="font-semibold text-sky-300 hover:underline"
            >
              Termos de Uso
            </Link>{" "}
            e declaro estar ciente da{" "}
            <Link
              href="/politica-de-privacidade"
              target="_blank"
              className="font-semibold text-sky-300 hover:underline"
            >
              Política de Privacidade
            </Link>.
          </label>
        </div>
            <button
              type="submit"
              disabled={carregando || !aceitouTermos}
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
            >
              {carregando ? "Criando conta..." : "Criar minha conta"}
            </button>

            <p className="mt-5 text-center text-sm text-slate-400">
              Já tem conta?{" "}
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
