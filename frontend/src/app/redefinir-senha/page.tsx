"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RedefinirSenhaPage() {
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenUrl = params.get("token") || "";
    setToken(tokenUrl);
  }, []);

  async function redefinirSenha(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setSucesso(false);

    if (!token) {
      setMensagem("Token de recuperação não encontrado.");
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem("As senhas não conferem.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/usuarios/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          nova_senha: novaSenha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.detail || "Não foi possível redefinir a senha.");
        return;
      }

      setSucesso(true);
      setMensagem("Senha redefinida com sucesso. Agora você já pode entrar.");
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
              🔑 Nova senha
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Crie uma nova senha para acessar o Dash.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Depois de redefinir sua senha, você poderá entrar normalmente e acessar
              sua área, perfil e watchlist.
            </p>
          </div>

          <form
            onSubmit={redefinirSenha}
            className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-sky-950/30"
          >
            <h2 className="text-3xl font-bold">Redefinir senha</h2>
            <p className="mt-2 text-sm text-slate-400">
              Escolha uma nova senha.
            </p>

            {!token && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                Token não encontrado. Volte para “Esqueci minha senha” e gere um novo link.
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300">Nova senha</label>
                <input
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  type="password"
                  minLength={6}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Confirmar senha</label>
                <input
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  type="password"
                  minLength={6}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  placeholder="Digite novamente"
                />
              </div>
            </div>

            {mensagem && (
              <div
                className={`mt-5 rounded-2xl border p-4 text-sm ${
                  sucesso
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-sky-400/20 bg-sky-400/10 text-sky-200"
                }`}
              >
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando || !token || sucesso}
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
            >
              {carregando ? "Redefinindo..." : "Salvar nova senha"}
            </button>

            {sucesso && (
              <Link
                href="/entrar"
                className="mt-4 flex w-full justify-center rounded-full border border-white/20 px-6 py-3 font-bold text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Entrar no Dash
              </Link>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
