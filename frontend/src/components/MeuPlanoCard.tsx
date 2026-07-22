"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UsuarioDash = {
  nome?: string;
  email?: string;
  plano?: string;
  status_assinatura?: string;
};

function normalizar(valor?: string) {
  return String(valor || "").toLowerCase();
}

export default function MeuPlanoCard() {
  const [usuario, setUsuario] = useState<UsuarioDash | null>(null);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("dash_usuario");

      if (salvo) {
        setUsuario(JSON.parse(salvo));
      }
    } catch {
      setUsuario(null);
    }
  }, []);

  const plano = normalizar(usuario?.plano);
  const status = normalizar(usuario?.status_assinatura);

  const premium =
    plano === "premium" || status === "ativo" || status === "trial";

  return (
    <section className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
            Meu plano
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {premium ? "Premium com IA" : "Gratuito"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            {premium
              ? "Seu acesso Premium está ativo. Você tem os recursos do Dash e a IA educativa para explicar indicadores, empresas, ranking e mercado."
              : "Você está usando o Dash gratuitamente. Para liberar a IA educativa, ative o Premium com 7 dias grátis e depois R$ 5,00 por semana."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300 md:min-w-64">
          <p className="font-bold text-white">
            {premium ? "Incluído no seu plano" : "Premium libera"}
          </p>

          <div className="mt-3 space-y-2">
            <p>✅ Home, empresas e ranking</p>
            <p>✅ Indicadores macro</p>
            <p>✅ Watchlist</p>
            <p>{premium ? "✅ IA do Dash" : "🔒 IA do Dash"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {premium ? (
          <Link
            href="/ia"
            className="inline-flex justify-center rounded-full bg-sky-400 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-sky-300"
          >
            Usar IA do Dash
          </Link>
        ) : (
          <Link
            href="/checkout?plano=premium"
            className="inline-flex justify-center rounded-full bg-sky-400 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-sky-300"
          >
            Fazer upgrade para Premium
          </Link>
        )}

        <Link
          href="/planos"
          className="inline-flex justify-center rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300"
        >
          Comparar planos
        </Link>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        O Dash Diário é educativo e informativo. Não fazemos recomendações de investimento.
      </p>
    </section>
  );
}
