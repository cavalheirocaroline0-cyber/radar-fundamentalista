import Link from "next/link";

export default function PremiumOfferBanner() {
  return (
    <section className="mx-auto mb-8 w-full max-w-6xl px-4 pt-4">
      <div className="overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-5 shadow-2xl shadow-sky-950/30">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
              Novo recurso premium
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-slate-100 md:text-4xl">
              🧠 Libere a IA do Dash Diário
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              Entenda indicadores, rankings, empresas e cenário de mercado com
              uma assistente educativa sempre à disposição.
            </p>

            <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <p>✅ Explicações sobre P/L, P/VP, ROE e Dividend Yield</p>
              <p>✅ Apoio para interpretar rankings e score</p>
              <p>✅ Leitura simples de Selic, IPCA, dólar e mercado</p>
              <p>✅ Experiência premium dentro do app</p>
            </div>

            <p className="mt-4 text-xs text-amber-200">
              Conteúdo educativo e informativo. Não é recomendação de
              investimento.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5 text-center">
            <p className="text-sm text-slate-400">Plano inicial</p>

            <div className="mt-2 flex items-end justify-center gap-1">
              <span className="text-2xl font-bold text-slate-100">R$</span>
              <span className="text-5xl font-extrabold text-sky-300">
                19,90
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-400">por mês</p>

            <Link
              href="/ia"
              className="mt-5 block rounded-2xl bg-sky-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-sky-300"
            >
              Assinar agora
            </Link>

            <p className="mt-3 text-xs text-slate-500">
              Acesso premium em validação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
