"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import MeuPlanoCard from "@/components/MeuPlanoCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  plano: string;
  criado_em?: string;
};

type Favorito = {
  ticker: string;
  empresa?: string | null;
  setor?: string | null;
  preco?: number | string | null;
  pl?: number | string | null;
  roe?: number | string | null;
  dividend_yield?: number | string | null;
  classificacao?: string | null;
};

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [ticker, setTicker] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarPerfil() {
    const token = localStorage.getItem("dash_token");

    if (!token) {
      setCarregando(false);
      return;
    }

    try {
      const respostaUsuario = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!respostaUsuario.ok) {
        localStorage.removeItem("dash_token");
        localStorage.removeItem("dash_usuario");
        setCarregando(false);
        return;
      }

      const dadosUsuario = await respostaUsuario.json();
      setUsuario(dadosUsuario.usuario);

      const respostaFavoritos = await fetch(`${API_URL}/favoritos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (respostaFavoritos.ok) {
        const dadosFavoritos = await respostaFavoritos.json();
        setFavoritos(dadosFavoritos.favoritos || []);
      }
    } catch {
      setMensagem("Não foi possível carregar seu perfil agora.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function adicionarFavorito(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("dash_token");

    if (!token) {
      setMensagem("Entre na sua conta para favoritar empresas.");
      return;
    }

    const tickerNormalizado = ticker.trim().toUpperCase();

    if (!tickerNormalizado) {
      setMensagem("Digite um ticker.");
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/favoritos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticker: tickerNormalizado,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.detail || "Não foi possível adicionar favorito.");
        return;
      }

      setTicker("");
      setMensagem(`${tickerNormalizado} adicionada à sua watchlist.`);
      carregarPerfil();
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  }

  async function removerFavorito(tickerRemover: string) {
    const token = localStorage.getItem("dash_token");

    if (!token) return;

    try {
      const resposta = await fetch(`${API_URL}/favoritos/${tickerRemover}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resposta.ok) {
        setMensagem(`${tickerRemover} removida da watchlist.`);
        carregarPerfil();
      }
    } catch {
      setMensagem("Não foi possível remover o favorito.");
    }
  }

  function sair() {
    localStorage.removeItem("dash_token");
    localStorage.removeItem("dash_usuario");
    window.location.href = "/";
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />

      <div className="mx-auto max-w-7xl px-6 pt-8">
        <MeuPlanoCard />
      </div>
        <section className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-slate-300">Carregando seu perfil...</p>
        </section>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />

        <section className="mx-auto flex min-h-[75vh] max-w-5xl items-center px-6 py-16">
          <div className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-8">
            <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
              👤 Perfil do Dash
            </div>

            <h1 className="mt-6 text-4xl font-black md:text-5xl">
              Entre na sua conta para personalizar sua experiência.
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Com uma conta, você poderá montar sua watchlist, favoritar empresas
              e receber um resumo diário mais personalizado.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cadastro"
                className="rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300"
              >
                Criar cadastro
              </Link>

              <Link
                href="/entrar"
                className="rounded-full border border-white/20 px-6 py-3 font-bold text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Entrar
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
              👤 Minha área
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight">
              Olá, {usuario.nome}.
            </h1>

            <p className="mt-4 text-lg text-slate-300">
              Esta é sua área no Dash Diário. Aqui ficam seu perfil, sua watchlist
              e suas preferências.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Dados da conta
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Nome</p>
                  <p className="text-xl font-bold">{usuario.nome}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">E-mail</p>
                  <p className="text-xl font-bold">{usuario.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Plano</p>
                  <span className="mt-2 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-300">
                    {usuario.plano || "gratuito"}
                  </span>
                </div>
              </div>

              <button
                onClick={sair}
                className="mt-6 rounded-full border border-white/20 px-5 py-3 font-bold text-white transition hover:border-red-400 hover:text-red-300"
              >
                Sair da conta
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                ⭐ Minha watchlist
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Empresas favoritas
              </h2>

              <p className="mt-3 text-slate-300">
                Adicione tickers para acompanhar suas empresas favoritas.
              </p>

              <form onSubmit={adicionarFavorito} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="Ex: PETR4"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                />

                <button
                  type="submit"
                  className="rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300"
                >
                  Favoritar
                </button>
              </form>

              {mensagem && (
                <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
                  {mensagem}
                </div>
              )}

        <div className="mt-6">
          {favoritos.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
              <p className="text-slate-300">
                Você ainda não adicionou empresas à sua watchlist.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {favoritos.map((item) => (
                <div
                  key={item.ticker}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {item.setor || "Setor não informado"}
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-sky-300">
                        {item.ticker}
                      </h3>

                      <p className="text-slate-300">
                        {item.empresa || "Empresa monitorada"}
                      </p>
                    </div>

                    {item.classificacao && (
                      <span className="w-fit rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
                        {item.classificacao}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Preço
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {item.preco !== null && item.preco !== undefined
  ? `R$ ${Number(item.preco).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  : "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        P/L
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {item.pl ?? "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        ROE
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {item.roe != null ? `${item.roe}%` : "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Dividend Yield
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {item.dividend_yield != null
                          ? `${item.dividend_yield}%`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/empresa/${item.ticker}`}
                      className="rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
                    >
                      Ver empresa
                    </Link>

                    <button
                      type="button"
                      onClick={() => removerFavorito(item.ticker)}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:border-red-400 hover:text-red-300"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                ⚙️ Preferências
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Personalização em construção
              </h2>

              <p className="mt-3 text-slate-300">
                Em breve você poderá escolher interesses como dividendos,
                crescimento, bancos, energia, FIIs e exterior.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
